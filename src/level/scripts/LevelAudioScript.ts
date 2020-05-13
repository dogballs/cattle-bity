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
  private audioManager: AudioManager;
  private moveState = MoveState.Idle;

  private moveSound: Sound;
  private idleSound: Sound;
  private pauseSound: Sound;
  private playerExplosionSound: Sound;

  protected setup({ audioManager, audioLoader }: GameUpdateArgs): void {
    this.audioManager = audioManager;

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

    this.session.getPlayers().forEach((playerSession) => {
      playerSession.lifeup.addListener(this.handlePlayerLifeup);
    });

    this.moveSound = audioLoader.load('tank.move');
    this.idleSound = audioLoader.load('tank.idle');
    this.pauseSound = audioLoader.load('pause');
    this.playerExplosionSound = audioLoader.load('explosion.player');

    // Play level intro right away. Rest of the sound must be muted until
    // intro finishes.
    const introSound = audioLoader.load('level-intro');
    introSound.ended.addListener(() => {
      this.audioManager.unmuteAll();
    });
    introSound.play();

    this.audioManager.muteAllExcept(
      introSound,
      this.pauseSound,
      this.playerExplosionSound,
    );

    this.idleSound.playLoop();
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { gameState, inputManager, session } = updateArgs;

    const activeMethod = inputManager.getActiveMethod();

    // By default check single-player active input
    let inputMethods = [activeMethod];

    if (session.isMultiplayer()) {
      const playerSessions = session.getPlayers();

      // Get input variants for all players
      inputMethods = playerSessions.map((playerSession) => {
        const playerVariant = playerSession.getInputVariant();
        const playerMethod = inputManager.getMethodByVariant(playerVariant);
        return playerMethod;
      });
    }

    const anybodyMoving = inputMethods.some((inputMethod) => {
      return inputMethod.isHoldAny(MOVE_CONTROLS);
    });

    const everybodyIdle = inputMethods.every((inputMethod) => {
      return inputMethod.isNotHoldAll(MOVE_CONTROLS);
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
    this.audioManager.play('explosion.enemy');
  };

  private handlePlayerDied = (): void => {
    this.playerExplosionSound.play();
  };

  private handlePlayerFired = (): void => {
    this.audioManager.play('fire');
  };

  private handlePlayerSlided = (): void => {
    this.audioManager.play('ice');
  };

  private handlePowerupSpawned = (): void => {
    this.audioManager.play('powerup.spawn');
  };

  private handlePowerupPicked = (event: LevelPowerupPickedEvent): void => {
    // Separate sound for life pickup
    if (event.type === PowerupType.Life) {
      return;
    }

    this.audioManager.play('powerup.pickup');
  };

  private handlePlayerLifeup = (): void => {
    this.audioManager.play('life');
  };

  private handleLevelPaused = (): void => {
    this.audioManager.pauseAll();
    this.pauseSound.play();
  };

  private levelUnpaused = (): void => {
    this.audioManager.resumeAll();
  };

  private handleLevelGameOverMoveBlocked = (): void => {
    this.moveSound.stop();
    this.idleSound.stop();
  };

  private handleLevelWinCompleted = (): void => {
    this.audioManager.stopAll();
  };
}
