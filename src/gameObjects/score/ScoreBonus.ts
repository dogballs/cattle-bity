import { GameObject } from '../../core';
import * as config from '../../config';

import { SpriteText } from '../text';

export class ScoreBonus extends GameObject {
  private title: SpriteText;
  private points: SpriteText;

  protected setup(): void {
    this.title = new SpriteText('BONUS!', {
      color: config.COLOR_RED,
    });
    this.add(this.title);

    const pointsText = `${config.BONUS_POINTS.toString()} PTS`;
    this.points = new SpriteText(pointsText, {
      color: config.COLOR_WHITE,
    });
    this.points.position.setY(32);
    this.add(this.points);
  }
}
