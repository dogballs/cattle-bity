import { SpriteText } from './SpriteText';

export class LevelTitle extends SpriteText {
  constructor(levelNumber = 0) {
    const text = LevelTitle.getLevelText(levelNumber);
    super(text);
  }

  public setLevelNumber(levelNumber: number): void {
    const text = LevelTitle.getLevelText(levelNumber);
    this.setText(text);
  }

  private static getLevelText(levelNumber: number): string {
    const numberText = levelNumber.toString().padStart(2, ' ');
    const text = `STAGE ${numberText}`;

    return text;
  }
}
