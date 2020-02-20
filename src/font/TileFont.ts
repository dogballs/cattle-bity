import { Rect, Vector } from '../core';

import { TileFontConfig } from './TileFontConfig';

export interface TileFontOptions {
  letterSpacing?: number;
  lineSpacing?: number;
  scale?: Vector;
}

const DEFAULT_OPTIONS = {
  letterSpacing: 1,
  lineSpacing: 1,
  scale: new Vector(1, 1),
};

export class TileFont {
  public readonly config: TileFontConfig;
  public readonly options: TileFontOptions;

  constructor(config: TileFontConfig, argOptions: TileFontOptions) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, argOptions);

    this.config = config;
  }

  character(character: string, offset = new Vector(0, 0)): Rect[] {
    const characterIndex = this.config.characterSet.indexOf(character);
    if (characterIndex === -1) {
      throw new Error(`Font character "${character}" is not defined`);
    }
    const characterConfig = this.config.characters[characterIndex];

    const rects: Rect[] = [];

    const { scale } = this.options;

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

  word(word: string, offset = new Vector(0, 0)): Rect[] {
    const wordRects: Rect[] = [];

    Array.from(word).forEach((character, index) => {
      const letterSpacing = index > 0 ? this.options.letterSpacing : 0;
      const characterOffset = offset
        .clone()
        .addX(index * (this.config.characterWidth + letterSpacing));

      const characterRects = this.character(character, characterOffset);
      wordRects.push(...characterRects);
    });

    return wordRects;
  }

  lines(lines: string[], offset = new Vector(0, 0)): Rect[] {
    const lineRects: Rect[] = [];

    lines.forEach((word, index) => {
      const lineSpacing = index > 0 ? this.options.lineSpacing : 0;
      const wordOffset = offset
        .clone()
        .addY(index * (this.config.characterHeight + lineSpacing));

      const wordRects = this.word(word, wordOffset);
      lineRects.push(...wordRects);
    });

    return lineRects;
  }

  getWordWidth(word: string): number {
    const charactersWidth =
      word.length * this.config.characterWidth * this.options.scale.x;
    const spacingWidth =
      (word.length - 1) * this.options.letterSpacing * this.options.scale.x;
    const wordWidth = charactersWidth + spacingWidth;
    return wordWidth;
  }

  getCharacterHeight(): number {
    const characterHeight = this.config.characterHeight * this.options.scale.y;
    return characterHeight;
  }

  getLinesHeight(lines: string[]): number {
    const charactersHeight =
      lines.length * this.config.characterHeight * this.options.scale.y;
    const spacingHeight =
      (lines.length - 1) * this.options.lineSpacing * this.options.scale.y;
    const linesHeight = charactersHeight + spacingHeight;
    return linesHeight;
  }
}
