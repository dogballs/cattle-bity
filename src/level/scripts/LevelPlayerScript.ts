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
      debugMenu.upgradeRequest.addListener((partyIndex) => {
        const tank = this.tanks[partyIndex];
        if (tank === null) {
          return;
        }
        tank.upgrade();
      });
      debugMenu.deathRequest.addListener((partyIndex) => {
        const tank = this.tanks[partyIndex];
        if (tank === null) {
          return;
        }
        tank.die();
      });
      debugMenu.moveSpeedUpRequest.addListener(({ partyIndex, speed }) => {
        const tank = this.tanks[partyIndex];
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

  private requestSpawn = (partyIndex: number): void => {
    const playerSession = this.session.getPlayer(partyIndex);
    if (!playerSession.isAlive()) {
      return;
    }

    const position = this.positions[partyIndex];

    const type = TankFactory.createPlayerType();

    this.eventBus.playerSpawnRequested.notify({
      type,
      partyIndex,
      position,
    });
  };

  private handleSpawnCompleted = (
    event: LevelPlayerSpawnCompletedEvent,
  ): void => {
    if (event.type.party !== TankParty.Player) {
      return;
    }

    const { partyIndex } = event;

    const tank = TankFactory.createPlayer(partyIndex);
    tank.updateMatrix();
    tank.setCenter(event.centerPosition);
    tank.updateMatrix();
    tank.activateShield(config.SHIELD_SPAWN_DURATION);

    const playerSession = this.session.getPlayer(partyIndex);

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
        partyIndex,
      });

      tank.removeSelf();
      this.tanks[partyIndex] = null;
      this.world.removePlayerTank(partyIndex);

      this.timers[partyIndex].reset(config.PLAYER_SPAWN_DELAY);

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

    this.tanks[partyIndex] = tank;

    this.world.addPlayerTank(partyIndex, tank);
  };

  private handlePowerupPicked = (event: LevelPowerupPickedEvent): void => {
    const { type: powerupType, partyIndex } = event;

    const tank = this.tanks[partyIndex];

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
