import { GameObject, SpritePainter } from '../core';
import { GameUpdateArgs } from '../game';

import { SpriteText } from './SpriteText';

export class LivesCounter extends GameObject {
  private title = new SpriteText('ⅠP');
  private livesText = new SpriteText('0');
  private icon = new GameObject(28, 32);

  constructor() {
    super(64, 64);
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    this.icon.painter = new SpritePainter(spriteLoader.load('ui.player'));
    this.icon.position.set(0, 32);
    this.add(this.icon);

    this.livesText.position.set(32, 32);
    this.add(this.livesText);

    this.add(this.title);
  }

  public setCount(livesCounter: number): void {
    this.livesText.setText(livesCounter.toString());
  }
}
