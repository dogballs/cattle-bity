import { GameObject, SpritePainter } from '../../core';
import { GameUpdateArgs } from '../../game';

import { SpriteText } from '../text';

export class LevelLivesCounter extends GameObject {
  private title: SpriteText;
  private livesText = new SpriteText('0');
  private icon = new GameObject(28, 32);
  private playerIndex: number;

  constructor(playerIndex: number) {
    super(64, 64);

    this.playerIndex = playerIndex;
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    const titleText = `${this.getPlayerNumberText(this.playerIndex)}P`;
    this.title = new SpriteText(titleText);

    this.icon.painter = new SpritePainter(spriteLoader.load('ui.player'));
    this.icon.position.set(0, 32);
    this.add(this.icon);

    this.livesText.position.set(32, 32);
    this.add(this.livesText);

    this.add(this.title);
  }

  public setCount(livesCount: number): void {
    const displayLivesCount = Math.max(0, livesCount - 1);
    this.livesText.setText(displayLivesCount.toString());
  }

  private getPlayerNumberText(playerIndex: number): string {
    if (playerIndex === 0) {
      return 'Ⅰ';
    }
    if (playerIndex === 1) {
      return 'Ⅱ';
    }
    return '?';
  }
}
