import { Sound } from '../../core';
import { AudioManager, GameUpdateArgs, GameState } from '../../game';
import { LevelPlayInputContext } from '../../input';
import { PowerupType } from '../../powerup';

import { LevelScript } from '../LevelScript';
import { LevelPowerupPickedEvent } from '../events';

const MOVE_CONTROLS = [
  ...LevelPlayInputContext.MoveUp,
  ...LevelPlayInputContext.MoveDown,
  ...LevelPlayInputContext.MoveLeft,
  ...LevelPlayInputContext.MoveRight,
];

enum MoveState {
  Idle,
  Moving,
}

export class LevelAudioScript extends LevelScript {
  private audioConttoller: AudioManager;
  private moveState = MoveState.Idle;

  private moveSound: Sound;
  private idleSound: Sound;
  private pauseSound: Sound;
  private playerExplosionSound: Sound;

  protected setup({ audioManager, audioLoader }: GameUpdateArgs): void {
    this.audioConttoller = audioManager;

    this.eventBus.baseDied.addListener(this.handleBaseDied);
    this.eventBus.enemyDied.addListener(this.handleEnemyDied);
    this.eventBus.playerDied.addListener(this.handlePlayerDied);
    this.eventBus.playerFired.addListener(this.handlePlayerFired);
    this.eventBus.playerSlided.addListener(this.handlePlayerSlided);
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
    const introSound = audioLoader.load('level-intro');
    introSound.ended.addListener(() => {
      this.audioConttoller.unmuteAll();
    });
    introSound.play();

    this.audioConttoller.muteAllExcept(
      introSound,
      this.pauseSound,
      this.playerExplosionSound,
    );

    this.idleSound.playLoop();
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { gameState, inputManager, session } = updateArgs;

    const activeVariant = inputManager.getActiveVariant();

    // By default check single-player active input
    let inputVariants = [activeVariant];

    if (session.isMultiplayer()) {
      const playerSessions = session.getPlayers();

      // Get input variants for all players
      inputVariants = playerSessions.map((playerSession) => {
        const inputVariantType = playerSession.getInputVariantType();
        const inputVariant = inputManager.getVariant(inputVariantType);
        return inputVariant;
      });
    }

    const anybodyMoving = inputVariants.some((inputVariant) => {
      return inputVariant.isHoldAny(MOVE_CONTROLS);
    });

    const everybodyIdle = inputVariants.every((inputVariant) => {
      return inputVariant.isNotHoldAll(MOVE_CONTROLS);
    });

    if (!gameState.is(GameState.Paused)) {
      // Check if started moving
      if (anybodyMoving && this.moveState !== MoveState.Moving) {
        this.moveState = MoveState.Moving;
        this.idleSound.stop();
        this.moveSound.playLoop();
      }

      // If stopped moving
      if (everybodyIdle && this.moveState !== MoveState.Idle) {
        this.moveState = MoveState.Idle;
        this.moveSound.stop();
        this.idleSound.playLoop();
      }
    }
  }

  private handleBaseDied = (): void => {
    this.playerExplosionSound.play();
  };

  private handleEnemyDied = (): void => {
    // TODO: wipeout powerup explodes multiple enemies, should trigger
    // single audio
    this.audioConttoller.play('explosion.enemy');
  };

  private handlePlayerDied = (): void => {
    this.playerExplosionSound.play();
  };

  private handlePlayerFired = (): void => {
    this.audioConttoller.play('fire');
  };

  private handlePlayerSlided = (): void => {
    this.audioConttoller.play('ice');
  };

  private handlePowerupSpawned = (): void => {
    this.audioConttoller.play('powerup.spawn');
  };

  private handlePowerupPicked = (event: LevelPowerupPickedEvent): void => {
    // Separate sound for life pickup
    if (event.type === PowerupType.Life) {
      return;
    }

    this.audioConttoller.play('powerup.pickup');
  };

  private handleSessionLifeup = (): void => {
    this.audioConttoller.play('life');
  };

  private handleLevelPaused = (): void => {
    this.audioConttoller.pauseAll();
    this.pauseSound.play();
  };

  private levelUnpaused = (): void => {
    this.audioConttoller.resumeAll();
  };

  private handleLevelGameOverMoveBlocked = (): void => {
    this.moveSound.stop();
    this.idleSound.stop();
  };

  private handleLevelWinCompleted = (): void => {
    this.audioConttoller.stopAll();
  };
}
