import { AudioLoader } from '../../core';
import { GameScript, GameUpdateArgs, Session } from '../../game';
import { PowerupType } from '../../powerup';

import { LevelEventBus } from '../LevelEventBus';
import { LevelPowerupPickedEvent } from '../events';

export class LevelAudioScript extends GameScript {
  private eventBus: LevelEventBus;
  private session: Session;
  private audioLoader: AudioLoader;

  constructor(eventBus: LevelEventBus, session: Session) {
    super();

    this.eventBus = eventBus;
    this.eventBus.enemyDied.addListener(this.handleEnemyDied);
    this.eventBus.playerDied.addListener(this.handlePlayerDied);
    this.eventBus.powerupSpawned.addListener(this.handlePowerupSpawned);
    this.eventBus.powerupPicked.addListener(this.handlePowerupPicked);

    this.session = session;
    this.session.lifeup.addListener(this.handleSessionLifeup);
  }

  protected setup({ audioLoader }: GameUpdateArgs): void {
    this.audioLoader = audioLoader;
  }

  private handleEnemyDied = (): void => {
    // TODO: wipeout powerup explodes multiple enemies, should trigger
    // single audio
    this.audioLoader.load('explosion.enemy').play();
  };

  private handlePlayerDied = (): void => {
    this.audioLoader.load('explosion.player').play();
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
}
