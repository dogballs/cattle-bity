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
  private position: Vector;
  private timer: Timer;
  private playerIndex = 0;
  private tank: PlayerTank = null;

  protected setup(): void {
    this.eventBus.playerSpawnCompleted.addListener(this.handleSpawnCompleted);
    this.eventBus.powerupPicked.addListener(this.handlePowerupPicked);
    this.eventBus.levelGameOverMoveBlocked.addListener(
      this.handleLevelGameOverMoveBlocked,
    );

    this.position = this.mapConfig.getPlayerSpawnPosition(this.playerIndex);

    this.timer = new Timer(config.PLAYER_FIRST_SPAWN_DELAY);
    this.timer.done.addListener(this.handleTimer);

    if (config.IS_DEV) {
      const debugMenu = new DebugLevelPlayerMenu({
        top: 270,
      });
      debugMenu.attach();
      debugMenu.upgradeRequest.addListener(() => {
        if (this.tank === null) {
          return;
        }
        this.tank.upgrade();
      });
      debugMenu.deathRequest.addListener(() => {
        if (this.tank === null) {
          return;
        }
        this.tank.die();
      });
      debugMenu.moveSpeedUpRequest.addListener((moveSpeedToAdd) => {
        if (this.tank === null) {
          return;
        }
        this.tank.attributes.moveSpeed += moveSpeedToAdd;
      });
    }
  }

  protected update({ deltaTime }: GameUpdateArgs): void {
    this.timer.update(deltaTime);
  }

  private handleTimer = (): void => {
    const position = this.position;

    const type = TankFactory.createPlayerType();

    this.eventBus.playerSpawnRequested.notify({
      type,
      position,
    });
  };

  private handleSpawnCompleted = (
    event: LevelPlayerSpawnCompletedEvent,
  ): void => {
    if (event.type.party !== TankParty.Player) {
      return;
    }

    const tank = TankFactory.createPlayer();
    tank.updateMatrix();
    tank.setCenter(event.centerPosition);
    tank.updateMatrix();
    tank.activateShield(config.SHIELD_SPAWN_DURATION);

    // Check if tank tier from previous level should be activated.
    // If tank dies - it loses all this tiers, so it applies only to first
    // spawn.
    if (this.session.primaryPlayer.isLevelFirstSpawn()) {
      const carryoverTier = this.session.primaryPlayer.getTankTier();
      tank.upgrade(carryoverTier, false);
    }

    tank.died.addListener(() => {
      this.eventBus.playerDied.notify({
        type: event.type,
        centerPosition: tank.getCenter(),
      });

      tank.removeSelf();
      this.tank = null;
      this.world.removePlayerTank();

      this.timer.reset(config.PLAYER_SPAWN_DELAY);

      this.session.primaryPlayer.resetTankTier();
    });

    tank.fired.addListener(() => {
      this.eventBus.playerFired.notify(null);
    });

    tank.upgraded.addListener((event) => {
      this.session.primaryPlayer.setTankTier(event.tier);
    });

    this.session.primaryPlayer.setLevelSpawned();

    this.tank = tank;

    this.world.addPlayerTank(this.tank);
  };

  private handlePowerupPicked = (event: LevelPowerupPickedEvent): void => {
    const { type: powerupType } = event;

    if (powerupType === PowerupType.Shield) {
      this.tank.activateShield(config.SHIELD_POWERUP_DURATION);
    }

    if (powerupType === PowerupType.Upgrade) {
      this.tank.upgrade();
    }
  };

  private handleLevelGameOverMoveBlocked = (): void => {
    if (this.tank === null) {
      return;
    }

    // Freeze the tank
    this.tank.freezeState.set(true);
  };
}
