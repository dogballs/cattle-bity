import { AudioLoader, Sound } from '../../core';
import { GameUpdateArgs } from '../../game';
import { LevelInputContext } from '../../input';
import { PowerupType } from '../../powerup';

import { LevelScript } from '../LevelScript';
import { LevelPowerupPickedEvent } from '../events';

const MOVE_CONTROLS = [
  ...LevelInputContext.MoveUp,
  ...LevelInputContext.MoveDown,
  ...LevelInputContext.MoveLeft,
  ...LevelInputContext.MoveRight,
];

enum TankState {
  Idle,
  Moving,
}

export class LevelAudioScript extends LevelScript {
  private audioLoader: AudioLoader;
  private tankState = TankState.Idle;

  private moveSound: Sound;
  private idleSound: Sound;
  private pauseSound: Sound;
  private playerExplosionSound: Sound;

  protected setup({ audioLoader }: GameUpdateArgs): void {
    this.audioLoader = audioLoader;

    this.eventBus.baseDied.addListener(this.handleBaseDied);
    this.eventBus.enemyDied.addListener(this.handleEnemyDied);
    this.eventBus.playerDied.addListener(this.handlePlayerDied);
    this.eventBus.playerFired.addListener(this.handlePlayerFired);
    this.eventBus.powerupSpawned.addListener(this.handlePowerupSpawned);
    this.eventBus.powerupPicked.addListener(this.handlePowerupPicked);
    this.eventBus.levelPaused.addListener(this.handleLevelPaused);
    this.eventBus.levelUnpaused.addListener(this.levelUnpaused);
    this.eventBus.levelGameOverMoveBlocked.addListener(
      this.handleLevelGameOverMoveBlocked,
    );
    this.eventBus.levelWinCompleted.addListener(this.handleLevelWinCompleted);

    this.session.primaryPlayer.lifeup.addListener(this.handleSessionLifeup);

    this.moveSound = audioLoader.load('tank.move');
    this.idleSound = audioLoader.load('tank.idle');
    this.pauseSound = audioLoader.load('pause');
    this.playerExplosionSound = audioLoader.load('explosion.player');

    // Play level intro right away. Rest of the sound must be muted until
    // intro finishes.
    const introSound = this.audioLoader.load('level-intro');
    introSound.ended.addListener(() => {
      this.audioLoader.unmuteAll();
    });
    introSound.play();

    this.audioLoader.muteAllExcept(
      introSound,
      this.pauseSound,
      this.playerExplosionSound,
    );

    this.idleSound.playLoop();
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { input } = updateArgs;

    // Check if started moving
    if (input.isHoldAny(MOVE_CONTROLS) && this.tankState !== TankState.Moving) {
      this.tankState = TankState.Moving;
      this.idleSound.stop();
      this.moveSound.playLoop();
    }

    // If stopped moving
    if (
      input.isNotHoldAll(MOVE_CONTROLS) &&
      this.tankState !== TankState.Idle
    ) {
      this.tankState = TankState.Idle;
      this.moveSound.stop();
      this.idleSound.playLoop();
    }
  }

  private handleBaseDied = (): void => {
    this.playerExplosionSound.play();
  };

  private handleEnemyDied = (): void => {
    // TODO: wipeout powerup explodes multiple enemies, should trigger
    // single audio
    this.audioLoader.load('explosion.enemy').play();
  };

  private handlePlayerDied = (): void => {
    this.playerExplosionSound.play();
  };

  private handlePlayerFired = (): void => {
    this.audioLoader.load('fire').play();
  };

  private handlePowerupSpawned = (): void => {
    this.audioLoader.load('powerup.spawn').play();
  };

  private handlePowerupPicked = (event: LevelPowerupPickedEvent): void => {
    // Separate sound for life pickup
    if (event.type === PowerupType.Life) {
      return;
    }

    this.audioLoader.load('powerup.pickup').play();
  };

  private handleSessionLifeup = (): void => {
    this.audioLoader.load('life').play();
  };

  private handleLevelPaused = (): void => {
    this.audioLoader.pauseAll();
    this.pauseSound.play();
  };

  private levelUnpaused = (): void => {
    this.audioLoader.resumeAll();
  };

  private handleLevelGameOverMoveBlocked = (): void => {
    this.moveSound.stop();
    this.idleSound.stop();
  };

  private handleLevelWinCompleted = (): void => {
    this.audioLoader.stopAll();
  };
}
