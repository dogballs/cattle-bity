import { GameObject, SpritePainter } from '../../core';
import { GameUpdateArgs } from '../../game';

import { SpriteText } from '../text';

export class LevelNumberCounter extends GameObject {
  public icon = new GameObject(64, 64);
  public levelNumberText = new SpriteText();

  constructor() {
    super(64, 96);
  }

  public setLevelNumber(levelNumber: number): void {
    const text = levelNumber.toString().padStart(2, ' ');
    this.levelNumberText.setText(text);
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    this.icon.painter = new SpritePainter(spriteLoader.load('flag'));
    this.add(this.icon);

    this.levelNumberText.position.setY(72);
    this.add(this.levelNumberText);
  }
}
