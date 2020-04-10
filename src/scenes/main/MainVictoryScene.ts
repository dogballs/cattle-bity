import { CollisionDetector, Scene, Sound } from '../../core';
import { AudioController, GameUpdateArgs } from '../../game';
import { PlayerTank, VictoryHeading, VictoryMap } from '../../gameObjects';
import { TankFactory, TankType, VictoryTankBehavior } from '../../tank';

import { GameSceneType } from '../GameSceneType';

const VICTORY_PLAYS = 3;

export class MainVictoryScene extends Scene {
  private heading: VictoryHeading;
  private audioController: AudioController;
  private map: VictoryMap;
  private tank: PlayerTank;
  private behavior: VictoryTankBehavior;
  private victorySound: Sound;
  private victoryPlays = 0;

  protected setup({ audioController, audioLoader }: GameUpdateArgs): void {
    this.audioController = audioController;

    this.victorySound = audioLoader.load('victory');
    this.victorySound.ended.addListener(this.handleVictorySoundEnded);

    this.map = new VictoryMap();
    this.map.tileDestroyed.addListener(this.handleTileDestroyed);
    this.map.destroyed.addListener(this.handleMapDestroyed);
    this.root.add(this.map);

    this.heading = new VictoryHeading();
    this.heading.origin.set(0.5, 0.5);
    this.heading.setCenterX(this.root.getSelfCenter().x);
    this.heading.position.setY(256);

    this.behavior = new VictoryTankBehavior();
    this.behavior.stopped.addListener(this.handleStopped);

    this.tank = TankFactory.createPlayer(TankType.PlayerA(), this.behavior);
    this.tank.setCenterX(this.root.getSelfCenter().x);
    this.tank.position.setY(this.root.size.height + 300);
    this.tank.fired.addListener(this.handleTankFired);
    this.root.add(this.tank);

    this.audioController.playLoop('tank.move');
  }

  protected update(updateArgs: GameUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });

    // Update all transforms before checking collisions
    this.root.updateWorldMatrix(false, true);

    const nodes = this.root.flatten();

    const activeNodes = [];
    const bothNodes = [];

    nodes.forEach((node) => {
      if (node.collider === null) {
        return;
      }

      if (node.collider.active) {
        activeNodes.push(node);
        bothNodes.push(node);
      } else {
        bothNodes.push(node);
      }
    });

    // Detect and handle collisions of all objects on the scene
    const collisions = CollisionDetector.intersectObjects(
      activeNodes,
      bothNodes,
    );
    collisions.forEach((collision) => {
      collision.self.invokeCollide(collision);
    });
  }

  private handleStopped = (): void => {
    this.audioController.stop('tank.move');
  };

  private handleTankFired = (): void => {
    this.audioController.play('fire');
  };

  private handleTileDestroyed = (): void => {
    this.audioController.play('explosion.enemy');
  };

  private handleMapDestroyed = (): void => {
    this.victorySound.play();
    this.victoryPlays += 1;

    this.root.add(this.heading);
  };

  private handleVictorySoundEnded = (): void => {
    if (this.victoryPlays >= VICTORY_PLAYS) {
      this.audioController.stopAll();
      this.navigator.clearAndPush(GameSceneType.MainHighscore);
      return;
    }

    this.victorySound.play();
    this.victoryPlays += 1;
  };
}
