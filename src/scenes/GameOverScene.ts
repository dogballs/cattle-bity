import { GameObject } from '../core';
import { GameOverHeading } from '../gameObjects';

export class GameOverScene extends GameObject {
  private heading = new GameOverHeading();

  protected setup(): void {
    this.heading.pivot.set(0.5, 0.5);
    this.heading.setCenter(this.getChildrenCenter());
    this.heading.position.addY(-32);
    this.add(this.heading);
  }
}
