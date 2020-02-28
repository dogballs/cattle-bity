import { Size } from '../Size';
import { Vector } from '../Vector';

import { Font } from './Font';
import { NullFont } from './NullFont';

export enum TextAlignment {
  Left,
  Center,
}

export interface TextOptions {
  alignment?: TextAlignment;
  letterSpacing?: number;
  lineSpacing?: number;
}

const DEFAULT_OPTIONS = {
  alignment: TextAlignment.Left,
  letterSpacing: 1,
  lineSpacing: 1,
};

const TEXT_LINE_SEPARATOR = '\n';
const TEXT_WORD_SEPARATOR = ' ';

export class Text<T> {
  public static LINE_SEPARATOR = TEXT_LINE_SEPARATOR;
  public static WORD_SEPARATOR = TEXT_WORD_SEPARATOR;

  private text = '';
  private font: Font<T> = new NullFont();
  private options: TextOptions;

  constructor(text = '', options: TextOptions = {}) {
    this.text = text;
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  public setText(text: string): this {
    this.text = text;

    return this;
  }

  public setFont(font: Font<T>): this {
    this.font = font;

    return this;
  }

  public setOptions(options: TextOptions = {}): this {
    this.options = Object.assign({}, this.options, options);

    return this;
  }

  public getFont(): Font<T> {
    return this.font;
  }

  public build(): T[] {
    // TODO: text offset can be passed from outside, but it won't work now
    // because external offset is scaled, but internal calculated offset is not
    const textOffset = new Vector(0, 0);
    const items = this.buildLinesFromText(this.text, textOffset);
    return items;
  }

  public getWidth(): number {
    const unscaledWidth = this.getUnscaledTextWidth(this.text);
    const scale = this.font.getScale();
    const width = unscaledWidth * scale.x;

    return width;
  }

  public getHeight(): number {
    const { lineSpacing } = this.options;

    const lines = this.splitTextToLines(this.text);
    const characterHeight = this.font.getCharacterHeight();
    const scale = this.font.getScale();

    const charactersHeight = lines.length * characterHeight * scale.y;
    const spacingHeight = (lines.length - 1) * lineSpacing * scale.y;
    const linesHeight = charactersHeight + spacingHeight;

    return linesHeight;
  }

  public getSize(): Size {
    const size = new Size(this.getWidth(), this.getHeight());
    return size;
  }

  private buildLinesFromText(text: string, textOffset = new Vector(0, 0)): T[] {
    const textItems: T[] = [];

    const characterHeight = this.font.getCharacterHeight();
    const textWidth = this.getUnscaledTextWidth(this.text);

    const lines = this.splitTextToLines(text);
    lines.forEach((line, index) => {
      const lineSpacing = index > 0 ? this.options.lineSpacing : 0;
      const lineOffsetY = index * (characterHeight + lineSpacing);

      let lineOffsetX = 0;
      if (this.options.alignment === TextAlignment.Center) {
        const lineWidth = this.getUnscaledLineWidth(line);
        lineOffsetX = (textWidth - lineWidth) / 2;
      }

      const lineOffset = textOffset
        .clone()
        .addX(lineOffsetX)
        .addY(lineOffsetY);

      const lineItems = this.buildWordsFromLine(line, lineOffset);
      textItems.push(...lineItems);
    });

    return textItems;
  }

  private buildWordsFromLine(line: string, lineOffset = new Vector(0, 0)): T[] {
    const lineItems: T[] = [];

    let wordOffsetX = 0;

    const words = this.splitLineToWords(line);
    words.forEach((word, index) => {
      const wordOffset = lineOffset.clone().addX(wordOffsetX);
      const wordWidth = this.getUnscaledWordWidth(word);

      const wordItems = this.buildCharactersFromWord(word, wordOffset);
      lineItems.push(...wordItems);

      const wordSpacing =
        index < words.length - 1 ? this.getWordSeparatorWidth() : 0;
      wordOffsetX += wordWidth + wordSpacing;
    });

    return lineItems;
  }

  private buildCharactersFromWord(
    word: string,
    wordOffset = new Vector(0, 0),
  ): T[] {
    const wordItems: T[] = [];

    const scale = this.font.getScale();
    const characters = this.splitWordToCharacters(word);

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

  private getUnscaledTextWidth(text: string): number {
    const lines = this.splitTextToLines(text);

    const lineWidths = lines.map((line) => {
      return this.getUnscaledLineWidth(line);
    });

    const maxLineWidth = Math.max(...lineWidths);

    return maxLineWidth;
  }

  private getUnscaledLineWidth(line: string): number {
    let lineWidth = 0;

    const words = this.splitLineToWords(line);
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
    const { letterSpacing } = this.options;
    const characterWidth = this.font.getCharacterWidth();
    const separatorWidth = characterWidth + letterSpacing * 2;

    return separatorWidth;
  }

  private splitTextToLines(text: string): string[] {
    const lines = text.split(TEXT_LINE_SEPARATOR);
    return lines;
  }

  private splitLineToWords(line: string): string[] {
    const words = line.split(TEXT_WORD_SEPARATOR);
    return words;
  }

  private splitWordToCharacters(word: string): string[] {
    const characters = Array.from(word);
    return characters;
  }
}
