import { GameObject } from '../core';

import { SpriteText } from './SpriteText';

export class ScoreTablePointCounter extends GameObject {
  private pointsText = new SpriteText('PTS', { scale: 4 });

  constructor() {
    super(352, 28);
  }

  protected setup(): void {
    this.pointsText.position.setX(96);
    this.pointsText.pivot.setX(1);
    this.add(this.pointsText);
  }
}
