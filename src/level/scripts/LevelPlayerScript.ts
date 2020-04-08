import { Timer, Vector } from '../../core';
import { DebugLevelPlayerMenu } from '../../debug';
import { GameScript, GameUpdateArgs } from '../../game';
import { PlayerTank } from '../../gameObjects';
import { MapConfig } from '../../map';
import { PowerupType } from '../../powerup';
import { TankFactory, TankParty } from '../../tank';
import * as config from '../../config';

import { LevelEventBus } from '../LevelEventBus';
import { LevelWorld } from '../LevelWorld';
import {
  LevelPlayerSpawnCompletedEvent,
  LevelPowerupPickedEvent,
} from '../events';

export class LevelPlayerScript extends GameScript {
  private world: LevelWorld;
  private eventBus: LevelEventBus;
  private position: Vector;
  private timer: Timer;
  private playerIndex = 0;
  private tank: PlayerTank = null;

  constructor(
    world: LevelWorld,
    eventBus: LevelEventBus,
    mapConfig: MapConfig,
  ) {
    super();

    this.world = world;

    this.eventBus = eventBus;
    this.eventBus.playerSpawnCompleted.addListener(this.handleSpawnCompleted);
    this.eventBus.powerupPicked.addListener(this.handlePowerupPicked);

    this.position = mapConfig.getPlayerSpawnPosition(this.playerIndex);

    this.timer = new Timer(config.PLAYER_FIRST_SPAWN_DELAY);
    this.timer.done.addListener(this.handleTimer);
  }

  protected setup(): void {
    if (config.IS_DEV) {
      const debugMenu = new DebugLevelPlayerMenu({
        top: 250,
      });
      debugMenu.attach();
      debugMenu.upgradeRequest.addListener(() => {
        if (this.tank === null) {
          return;
        }
        this.tank.upgrade();
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
    tank.setCenter(event.centerPosition);
    tank.activateShield(config.SHIELD_SPAWN_DURATION);

    tank.died.addListener(() => {
      this.eventBus.playerDied.notify({
        type: event.type,
        centerPosition: tank.getCenter(),
      });

      tank.removeSelf();
      this.tank = null;
      this.world.removePlayerTank();

      this.timer.reset(config.PLAYER_SPAWN_DELAY);
    });

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
}
