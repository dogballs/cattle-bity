import { GameObject } from '../core';
import { Field, PlayerTank } from '../gameObjects';

export class LevelWorld {
  public sceneRoot: GameObject;
  public field: Field;
  private playerTank: PlayerTank = null;

  constructor(sceneRoot: GameObject) {
    this.sceneRoot = sceneRoot;

    this.field = new Field();
  }

  public addPlayerTank(playerTank: PlayerTank): void {
    this.playerTank = playerTank;
    this.field.add(playerTank);
  }

  public removePlayerTank(): void {
    if (this.playerTank === null) {
      return;
    }
    this.playerTank.removeSelf();
    this.playerTank = null;
  }

  public getPlayerTank(): PlayerTank {
    return this.playerTank;
  }
}
