import { Rect } from '../Rect';
import { Vector } from '../Vector';

import { Font } from './Font';

export interface RectFontConfig {
  fillSymbol: string;
  emptySymbol: string;
  characterWidth: number;
  characterHeight: number;
  characterSet: string;
  characters: string[][];
}

export class RectFont implements Font<Rect[]> {
  public readonly config: RectFontConfig;

  constructor(config: RectFontConfig) {
    this.config = config;
  }

  public buildCharacter(
    character: string,
    scale = new Vector(1, 1),
    offset = new Vector(0, 0),
  ): Rect[] {
    const characterIndex = this.config.characterSet.indexOf(character);
    if (characterIndex === -1) {
      throw new Error(`Font character "${character}" is not defined`);
    }
    const characterConfig = this.config.characters[characterIndex];

    const rects: Rect[] = [];

    characterConfig.forEach((row, rowIndex) => {
      Array.from(row).forEach((symbol, colIndex) => {
        if (symbol !== this.config.fillSymbol) {
          return;
        }

        const x = colIndex * scale.x + offset.x * scale.x;
        const y = rowIndex * scale.y + offset.y * scale.y;
        const width = scale.x;
        const height = scale.y;

        const rect = new Rect(x, y, width, height);

        rects.push(rect);
      });
    });

    return rects;
  }

  public getCharacterWidth(): number {
    return this.config.characterWidth;
  }

  public getCharacterHeight(): number {
    return this.config.characterHeight;
  }
}
