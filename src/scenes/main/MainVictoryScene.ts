import { Scene, Sound } from '../../core';
import { AudioManager, GameUpdateArgs } from '../../game';
import { PlayerTank, VictoryHeading, VictoryMap } from '../../gameObjects';
import { MenuInputContext } from '../../input';
import { TankFactory, TankType, VictoryTankBehavior } from '../../tank';

import { GameSceneType } from '../GameSceneType';

const VICTORY_PLAYS = 3;

export class MainVictoryScene extends Scene {
  private heading: VictoryHeading;
  private audioManager: AudioManager;
  private map: VictoryMap;
  private tank: PlayerTank;
  private behavior: VictoryTankBehavior;
  private victorySound: Sound;
  private victoryPlays = 0;

  protected setup({ audioManager, audioLoader }: GameUpdateArgs): void {
    this.audioManager = audioManager;

    this.victorySound = audioLoader.load('victory');
    this.victorySound.ended.addListener(this.handleVictorySoundEnded);

    this.map = new VictoryMap();
    this.map.tileDestroyed.addListener(this.handleTileDestroyed);
    this.map.destroyed.addListener(this.handleMapDestroyed);
    this.root.add(this.map);

    this.heading = new VictoryHeading();
    this.heading.updateMatrix();
    this.heading.origin.set(0.5, 0.5);
    this.heading.setCenterX(this.root.getSelfCenter().x);
    this.heading.position.setY(256);

    this.behavior = new VictoryTankBehavior();
    this.behavior.stopped.addListener(this.handleStopped);

    this.tank = TankFactory.createPlayer(TankType.PlayerA(), this.behavior);
    this.tank.updateMatrix();
    this.tank.setCenterX(this.root.getSelfCenter().x);
    this.tank.position.setY(this.root.size.height + 300);
    this.tank.fired.addListener(this.handleTankFired);
    this.root.add(this.tank);

    this.audioManager.playLoop('tank.move');
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { collisionSystem, input } = updateArgs;

    if (input.isDownAny(MenuInputContext.Skip)) {
      this.finish();
      return;
    }

    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });

    // Update all transforms before checking collisions
    this.root.updateWorldMatrix(false, true);

    collisionSystem.update();
    collisionSystem.collide();

    this.root.setNeedsPaint();
  }

  private handleStopped = (): void => {
    this.audioManager.stop('tank.move');
  };

  private handleTankFired = (): void => {
    this.audioManager.play('fire');
  };

  private handleTileDestroyed = (): void => {
    this.audioManager.play('explosion.enemy');
  };

  private handleMapDestroyed = (): void => {
    this.victorySound.play();
    this.victoryPlays += 1;

    this.root.add(this.heading);
  };

  private handleVictorySoundEnded = (): void => {
    if (this.victoryPlays >= VICTORY_PLAYS) {
      this.finish();
      return;
    }

    this.victorySound.play();
    this.victoryPlays += 1;
  };

  private finish(): void {
    this.audioManager.stopAll();
    this.navigator.clearAndPush(GameSceneType.MainHighscore);
  }
}
