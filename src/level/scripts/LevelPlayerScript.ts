import { Timer, Vector } from '../../core';
import { DebugLevelPlayerMenu } from '../../debug';
import { GameUpdateArgs } from '../../game';
import { PlayerTank } from '../../gameObjects';
import { PowerupType } from '../../powerup';
import { TankFactory, TankParty } from '../../tank';
import * as config from '../../config';

import { LevelScript } from '../LevelScript';
import {
  LevelPlayerSpawnCompletedEvent,
  LevelPowerupPickedEvent,
} from '../events';

export class LevelPlayerScript extends LevelScript {
  private positions: Vector[] = [];
  private timers: Timer[] = [];
  private playerIndex = 0;
  private tanks: PlayerTank[] = [];

  protected setup({ session }: GameUpdateArgs): void {
    this.eventBus.playerSpawnCompleted.addListener(this.handleSpawnCompleted);
    this.eventBus.powerupPicked.addListener(this.handlePowerupPicked);
    this.eventBus.levelGameOverMoveBlocked.addListener(
      this.handleLevelGameOverMoveBlocked,
    );

    this.positions = this.mapConfig.getPlayerSpawnPositions();

    // Keep only one player if not multiplayer
    if (!session.isMultiplayer()) {
      this.positions = this.positions.slice(0, 1);
    }

    this.positions.forEach((position, index) => {
      const timer = new Timer(config.PLAYER_FIRST_SPAWN_DELAY);
      timer.done.addListener(() => {
        this.requestSpawn(index);
      });
      this.timers.push(timer);

      // Fill in the array of tanks
      this.tanks.push(null);
    });

    if (config.IS_DEV) {
      const debugMenu = new DebugLevelPlayerMenu({
        top: 300,
      });
      debugMenu.attach();
      debugMenu.upgradeRequest.addListener((playerIndex) => {
        const tank = this.tanks[playerIndex];
        if (tank === null) {
          return;
        }
        tank.upgrade();
      });
      debugMenu.deathRequest.addListener((playerIndex) => {
        const tank = this.tanks[playerIndex];
        if (tank === null) {
          return;
        }
        tank.die();
      });
      debugMenu.moveSpeedUpRequest.addListener(({ playerIndex, speed }) => {
        const tank = this.tanks[playerIndex];
        if (tank === null) {
          return;
        }
        tank.attributes.moveSpeed += speed;
      });
    }
  }

  protected update({ deltaTime }: GameUpdateArgs): void {
    this.timers.forEach((timer) => {
      timer.update(deltaTime);
    });
  }

  private requestSpawn = (playerIndex: number): void => {
    const playerSession = this.session.getPlayer(playerIndex);
    if (!playerSession.isAlive()) {
      return;
    }

    const position = this.positions[playerIndex];

    const type = TankFactory.createPlayerType();

    this.eventBus.playerSpawnRequested.notify({
      type,
      playerIndex,
      position,
    });
  };

  private handleSpawnCompleted = (
    event: LevelPlayerSpawnCompletedEvent,
  ): void => {
    if (event.type.party !== TankParty.Player) {
      return;
    }

    const { playerIndex } = event;

    const tank = TankFactory.createPlayer(playerIndex);
    tank.updateMatrix();
    tank.setCenter(event.centerPosition);
    tank.updateMatrix();
    tank.activateShield(config.SHIELD_SPAWN_DURATION);

    const playerSession = this.session.getPlayer(playerIndex);

    // Check if tank tier from previous level should be activated.
    // If tank dies - it loses all this tiers, so it applies only to first
    // spawn.
    if (playerSession.isLevelFirstSpawn()) {
      const carryoverTier = playerSession.getTankTier();
      tank.upgrade(carryoverTier, false);
    }

    tank.died.addListener(() => {
      this.eventBus.playerDied.notify({
        type: event.type,
        centerPosition: tank.getCenter(),
        playerIndex,
      });

      tank.removeSelf();
      this.tanks[playerIndex] = null;
      this.world.removePlayerTank(playerIndex);

      this.timers[playerIndex].reset(config.PLAYER_SPAWN_DELAY);

      playerSession.resetTankTier();
    });

    tank.fired.addListener(() => {
      this.eventBus.playerFired.notify(null);
    });

    tank.upgraded.addListener((event) => {
      playerSession.setTankTier(event.tier);
    });

    tank.slided.addListener(() => {
      this.eventBus.playerSlided.notify(null);
    });

    playerSession.setLevelSpawned();

    this.tanks[playerIndex] = tank;

    this.world.addPlayerTank(playerIndex, tank);
  };

  private handlePowerupPicked = (event: LevelPowerupPickedEvent): void => {
    const { type: powerupType, playerIndex } = event;

    const tank = this.tanks[playerIndex];

    if (powerupType === PowerupType.Shield) {
      tank.activateShield(config.SHIELD_POWERUP_DURATION);
    }

    if (powerupType === PowerupType.Upgrade) {
      tank.upgrade();
    }
  };

  private handleLevelGameOverMoveBlocked = (): void => {
    this.tanks.forEach((tank) => {
      if (tank === null) {
        return;
      }

      // Freeze the tank
      tank.freezeState.set(true);
    });
  };
}
