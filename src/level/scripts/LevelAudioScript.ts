import { AudioLoader, Sound } from '../../core';
import { GameScript, GameUpdateArgs, Session } from '../../game';
import { LevelInputContext } from '../../input';
import { PowerupType } from '../../powerup';

import { LevelEventBus } from '../LevelEventBus';
import { LevelPowerupPickedEvent } from '../events';

const MOVE_CONTROLS = [
  ...LevelInputContext.MoveUp,
  ...LevelInputContext.MoveDown,
  ...LevelInputContext.MoveLeft,
  ...LevelInputContext.MoveRight,
];

enum State {
  Intro,
}

enum TankState {
  Idle,
  Moving,
}

export class LevelAudioScript extends GameScript {
  private eventBus: LevelEventBus;
  private session: Session;
  private audioLoader: AudioLoader;
  private state = State.Intro;
  private tankState = TankState.Idle;

  private moveSound: Sound;
  private idleSound: Sound;
  private pauseSound: Sound;
  private playerExplosionSound: Sound;

  constructor(eventBus: LevelEventBus, session: Session) {
    super();

    this.eventBus = eventBus;
    this.eventBus.baseDied.addListener(this.handleBaseDied);
    this.eventBus.enemyDied.addListener(this.handleEnemyDied);
    this.eventBus.playerDied.addListener(this.handlePlayerDied);
    this.eventBus.playerFired.addListener(this.handlePlayerFired);
    this.eventBus.powerupSpawned.addListener(this.handlePowerupSpawned);
    this.eventBus.powerupPicked.addListener(this.handlePowerupPicked);
    this.eventBus.paused.addListener(this.handlePaused);
    this.eventBus.unpaused.addListener(this.handleUnpaused);

    this.session = session;
    this.session.lifeup.addListener(this.handleSessionLifeup);
  }

  protected setup({ audioLoader }: GameUpdateArgs): void {
    this.audioLoader = audioLoader;

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

  private handlePaused = (): void => {
    this.audioLoader.pauseAll();
    this.pauseSound.play();
  };

  private handleUnpaused = (): void => {
    this.audioLoader.resumeAll();
  };
}
