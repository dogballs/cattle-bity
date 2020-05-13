import { GameObject } from '../core';
import { Field, PlayerTank } from '../gameObjects';

export class LevelWorld {
  public sceneRoot: GameObject;
  public field: Field;
  private playerTanks: PlayerTank[] = [];

  constructor(sceneRoot: GameObject) {
    this.sceneRoot = sceneRoot;

    this.field = new Field();
  }

  public addPlayerTank(playerIndex: number, playerTank: PlayerTank): void {
    this.playerTanks[playerIndex] = playerTank;
    this.field.add(playerTank);
  }

  public removePlayerTank(playerIndex: number): void {
    const playerTank = this.playerTanks[playerIndex];

    if (playerTank === null || playerTank === undefined) {
      return;
    }

    playerTank.removeSelf();

    this.playerTanks[playerIndex] = null;
  }

  public getPlayerTanks(): PlayerTank[] {
    return this.playerTanks;
  }
}
