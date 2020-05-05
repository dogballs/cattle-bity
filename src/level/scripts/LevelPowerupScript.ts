import { Rect, Timer } from '../../core';
import { DebugLevelPowerupMenu } from '../../debug';
import { GameUpdateArgs } from '../../game';
import { Powerup } from '../../gameObjects';
import { PowerupFactory, PowerupGrid, PowerupType } from '../../powerup';
import { TerrainType } from '../../terrain';
import * as config from '../../config';

import { LevelScript } from '../LevelScript';
import {
  LevelEnemyHitEvent,
  LevelEnemySpawnCompletedEvent,
  LevelMapTileDestroyedEvent,
} from '../events';

export class LevelPowerupScript extends LevelScript {
  private timer: Timer;
  private activePowerup: Powerup = null;
  private grid: PowerupGrid;

  protected setup(): void {
    this.eventBus.enemyHit.addListener(this.handleEnemyHit);
    this.eventBus.enemySpawnCompleted.addListener(
      this.handleEnemySpawnCompleted,
    );
    this.eventBus.mapTileDestroyed.addListener(this.handleMapTileDestroyed);

    this.timer = new Timer();
    this.timer.done.addListener(this.handleTimer);

    this.grid = new PowerupGrid();
    this.blockGridDefaults();
    this.blockGridInitialMap();

    if (config.IS_DEV) {
      const debugMenu = new DebugLevelPowerupMenu(this.world, this.grid, {
        top: 125,
      });
      debugMenu.attach();
      debugMenu.spawnRequest.addListener((type: PowerupType) => {
        this.spawn(type);
      });
    }
  }

  protected update({ deltaTime }: GameUpdateArgs): void {
    this.timer.update(deltaTime);
  }

  private handleEnemyHit = (event: LevelEnemyHitEvent): void => {
    const { type: tankType } = event;

    // Ignore if tank does not have droppable powerup
    if (!tankType.hasDrop) {
      return;
    }

    this.spawn();
  };

  // Remove active powerup whenever new enemy spawns with drop
  private handleEnemySpawnCompleted = (
    event: LevelEnemySpawnCompletedEvent,
  ): void => {
    const { type: tankType } = event;

    // Tanks without drops don't affect powerups
    if (!tankType.hasDrop) {
      return;
    }

    this.revoke();
  };

  // Remove powerup after timer expires
  private handleTimer = (): void => {
    this.revoke();
  };

  private handleMapTileDestroyed = (
    event: LevelMapTileDestroyedEvent,
  ): void => {
    const { type: terrainType, position, size } = event;

    // Only steel tiles when destroyed can free new space for powerup spawn
    if (terrainType !== TerrainType.Steel) {
      return;
    }

    const rect = new Rect(position.x, position.y, size.width, size.height);

    this.grid.freeRect(rect);
  };

  private spawn(type: PowerupType = null): void {
    // Override previous powerup with newly picked up one
    this.revoke();

    const powerup =
      type !== null
        ? PowerupFactory.create(type)
        : PowerupFactory.createRandom();

    // Block area around player tank at the moment of powerup spawn
    // so player won't accidently pick up a powerup. After spawning free it back
    // because player tank is in constant movement.
    const playerTankRects = this.createPlayerTankRects();
    if (playerTankRects.length > 0) {
      this.grid.backup();
      playerTankRects.forEach((playerTankRect) => {
        if (playerTankRect === null) {
          return;
        }
        this.grid.blockRect(playerTankRect);
      });
    }

    const position = this.grid.getRandomPosition();

    if (playerTankRects.length > 0) {
      this.grid.restore();
    }

    // In case no free position available, give powerup directly to player.
    // Spawn it on top of player tank, if available. Otherwise, on top of base.
    // Specify appropriate center position to display points for picking it up.
    if (position === null) {
      // Check which player rect is available
      // If primary player tank is missing, use second tank
      let playerIndex = 0;
      if (playerTankRects[0] === null) {
        playerIndex = 1;
      }

      // In case second is missing - use default spot
      const directRect = playerTankRects[playerIndex] ?? this.createBaseRect();

      this.eventBus.powerupPicked.notify({
        type: powerup.type,
        centerPosition: directRect.getCenter(),
        playerIndex,
      });
      return;
    }

    powerup.position.copyFrom(position);

    powerup.picked.addListener(({ playerIndex }) => {
      this.eventBus.powerupPicked.notify({
        type: powerup.type,
        centerPosition: powerup.getCenter(),
        playerIndex,
      });
    });

    this.timer.reset(config.POWERUP_DURATION);

    this.activePowerup = powerup;

    this.world.field.add(powerup);

    this.eventBus.powerupSpawned.notify({
      type: powerup.type,
      position,
    });
  }

  private revoke(): void {
    if (this.activePowerup === null) {
      return;
    }

    this.activePowerup.destroy();
    this.activePowerup = null;

    this.eventBus.powerupRevoked.notify(null);
  }

  private createBaseRect(): Rect {
    return new Rect(
      config.BASE_DEFAULT_POSITION.x,
      config.BASE_DEFAULT_POSITION.y,
      config.BASE_DEFAULT_SIZE.width,
      config.BASE_DEFAULT_SIZE.height,
    );
  }

  private createPlayerTankRects(): Rect[] {
    const rects = [];

    const playerTanks = this.world.getPlayerTanks();
    playerTanks.forEach((playerTank) => {
      if (playerTank === null) {
        rects.push(null);
        return;
      }

      // Create a margin around player tank, so player won't accidently pick
      // powerup up.
      const margin = config.TILE_SIZE_LARGE;

      const rect = new Rect(
        playerTank.position.x - margin,
        playerTank.position.y - margin,
        playerTank.size.width + margin * 2,
        playerTank.size.height + margin * 2,
      );

      rects.push(rect);
    });

    return rects;
  }

  private blockGridDefaults(): void {
    this.grid.blockRect(this.createBaseRect());

    const playerSpawnPositions = this.mapConfig.getPlayerSpawnPositions();
    playerSpawnPositions.forEach((position) => {
      this.grid.blockRect(new Rect(position.x, position.y, 64, 64));
    });

    const enemySpawnPositions = this.mapConfig.getEnemySpawnPositions();
    enemySpawnPositions.forEach((position) => {
      this.grid.blockRect(new Rect(position.x, position.y, 64, 64));
    });
  }

  private blockGridInitialMap(): void {
    const denyTypes = [TerrainType.Steel, TerrainType.Water];
    const regions = this.mapConfig.getTerrainRegions();

    regions.forEach((region) => {
      if (!denyTypes.includes(region.type)) {
        return;
      }

      this.grid.blockRect(
        new Rect(region.x, region.y, region.width, region.height),
      );
    });
  }
}
