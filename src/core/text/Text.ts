import { Vector } from '../Vector';

import { Font } from './Font';

// TODO: scale might belong to font

export interface TextOptions {
  letterSpacing?: number;
  lineSpacing?: number;
  scale?: Vector | number;
}

const DEFAULT_OPTIONS = {
  letterSpacing: 1,
  lineSpacing: 1,
  scale: 1,
};

const TEXT_LINE_SEPARATOR = '\n';
const TEXT_WORD_SEPARATOR = ' ';

export class Text<T> {
  public static LINE_SEPARATOR = TEXT_LINE_SEPARATOR;
  public static WORD_SEPARATOR = TEXT_WORD_SEPARATOR;

  public text = '';
  public readonly font: Font<T>;
  public readonly options: TextOptions;

  constructor(text = '', font: Font<T>, options: TextOptions = {}) {
    this.text = text;
    this.font = font;
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  public build(textOffset = new Vector(0, 0)): T[] {
    const items = this.buildTextLines(this.text, textOffset);
    return items;
  }

  public getWidth(): number {
    const lines = this.getTextLines(this.text);

    const lineWidths = lines.map((line) => {
      return this.getUnscaledLineWidth(line);
    });

    const maxLineWidth = Math.max(...lineWidths);

    const scale = this.getScaleVector();
    const width = maxLineWidth * scale.x;

    return width;
  }

  public getHeight(): number {
    const { lineSpacing } = this.options;

    const lines = this.getTextLines(this.text);
    const characterHeight = this.font.getCharacterHeight();
    const scale = this.getScaleVector();

    const charactersHeight = lines.length * characterHeight * scale.y;
    const spacingHeight = (lines.length - 1) * lineSpacing * scale.y;
    const linesHeight = charactersHeight + spacingHeight;

    return linesHeight;
  }

  private buildTextLines(text: string, textOffset = new Vector(0, 0)): T[] {
    const textItems: T[] = [];

    const lines = this.getTextLines(text);
    lines.forEach((line, index) => {
      const lineSpacing = index > 0 ? this.options.lineSpacing : 0;
      const lineOffset = textOffset
        .clone()
        .addY(index * (this.font.getCharacterHeight() + lineSpacing));

      const lineItems = this.buildLineWords(line, lineOffset);
      textItems.push(...lineItems);
    });

    return textItems;
  }

  private buildLineWords(line: string, lineOffset = new Vector(0, 0)): T[] {
    const lineItems: T[] = [];

    let priorWordsWidthSum = 0;

    const words = this.getLineWords(line);
    words.forEach((word, index) => {
      const wordOffset = lineOffset.clone().addX(priorWordsWidthSum);
      const wordWidth = this.getUnscaledWordWidth(word);

      const wordItems = this.buildWordCharacters(word, wordOffset);
      lineItems.push(...wordItems);

      const wordSpacing =
        index < words.length - 1 ? this.getWordSeparatorWidth() : 0;
      priorWordsWidthSum += wordWidth + wordSpacing;
    });

    return lineItems;
  }

  private buildWordCharacters(
    word: string,
    wordOffset = new Vector(0, 0),
  ): T[] {
    const wordItems: T[] = [];

    const scale = this.getScaleVector();
    const characters = this.getWordCharacters(word);

    characters.forEach((character, index) => {
      const letterSpacing = index > 0 ? this.options.letterSpacing : 0;
      const characterOffset = wordOffset
        .clone()
        .addX(index * (this.font.getCharacterWidth() + letterSpacing));

      const characterItem = this.font.buildCharacter(
        character,
        scale,
        characterOffset,
      );

      wordItems.push(characterItem);
    });

    return wordItems;
  }

  private getUnscaledLineWidth(line: string): number {
    let lineWidth = 0;

    const words = this.getLineWords(line);
    words.forEach((word, index) => {
      const wordWidth = this.getUnscaledWordWidth(word);
      const wordSpacing = index > 0 ? this.getWordSeparatorWidth() : 0;

      const wordTotalWidth = wordWidth + wordSpacing;

      lineWidth += wordTotalWidth;
    });

    return lineWidth;
  }

  private getUnscaledWordWidth(word: string): number {
    const characterWidth = this.font.getCharacterWidth();
    const { letterSpacing } = this.options;

    const charactersWidth = word.length * characterWidth;
    const spacingWidth = (word.length - 1) * letterSpacing;
    const wordWidth = charactersWidth + spacingWidth;

    return wordWidth;
  }

  private getWordSeparatorWidth(): number {
    return this.font.getCharacterWidth();
  }

  private getTextLines(text: string): string[] {
    const lines = text.split(TEXT_LINE_SEPARATOR);
    return lines;
  }

  private getLineWords(line: string): string[] {
    const words = line.split(TEXT_WORD_SEPARATOR);
    return words;
  }

  private getWordCharacters(word: string): string[] {
    const characters = Array.from(word);
    return characters;
  }

  private getScaleVector(): Vector {
    const { scale } = this.options;

    if (typeof scale === 'number') {
      return new Vector(scale, scale);
    }

    return scale;
  }
}
