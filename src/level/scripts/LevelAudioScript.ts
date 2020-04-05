import { AudioLoader } from '../../core';
import { GameScript, GameUpdateArgs } from '../../game';
import { LevelEventBus } from '../LevelEventBus';

export class LevelAudioScript extends GameScript {
  private eventBus: LevelEventBus;
  private audioLoader: AudioLoader;

  constructor(eventBus: LevelEventBus) {
    super();

    this.eventBus = eventBus;
    this.eventBus.enemyDied.addListener(this.handleEnemyDied);
    this.eventBus.playerDied.addListener(this.handlePlayerDied);
    this.eventBus.powerupSpawned.addListener(this.handlePowerupSpawned);
    this.eventBus.powerupPicked.addListener(this.handlePowerupPicked);
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

  private handlePowerupPicked = (): void => {
    this.audioLoader.load('powerup.pickup').play();
  };
}
