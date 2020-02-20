import { Rect } from '../Rect';
import { Sprite } from '../Sprite';
import { Texture } from '../Texture';
import { Vector } from '../Vector';

export interface SpriteFontConfig {
  characterSet: string;
  characterWidth: number;
  characterHeight: number;
  rowCount: number;
  columnCount: number;
  horizontalSpacing: number;
  verticalSpacing: number;
}

export interface SpriteFontOptions {
  letterSpacing?: number;
  lineSpacing?: number;
  scale?: Vector | number;
}

const DEFAULT_OPTIONS = {
  letterSpacing: 1,
  lineSpacing: 1,
  scale: 1,
};

export class SpriteFont {
  public readonly config: SpriteFontConfig;
  public readonly texture: Texture;
  public readonly options: SpriteFontOptions;

  constructor(
    config: SpriteFontConfig,
    texture: Texture,
    argOptions: SpriteFontOptions = {},
  ) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, argOptions);
    this.texture = texture;
    this.config = config;
  }

  public character(character: string, offset = new Vector(0, 0)): Sprite {
    const characterIndex = this.config.characterSet.indexOf(character);
    if (characterIndex === -1) {
      throw new Error(`Font character "${character}" is not defined`);
    }

    const {
      characterWidth,
      characterHeight,
      columnCount,
      horizontalSpacing,
      verticalSpacing,
    } = this.config;

    const rowIndex = Math.floor(characterIndex / columnCount);
    const columnIndex = characterIndex % columnCount;

    const sourceX =
      columnIndex * characterWidth + columnIndex * horizontalSpacing;
    const sourceY = rowIndex * characterHeight + rowIndex * verticalSpacing;
    const sourceWidth = characterWidth;
    const sourceHeight = characterHeight;

    const sourceRect = new Rect(sourceX, sourceY, sourceWidth, sourceHeight);

    const scale = this.getScaleVector();

    const targetX = offset.x * scale.x;
    const targetY = offset.y * scale.y;
    const targetWidth = characterWidth * scale.x;
    const targetHeight = characterHeight * scale.y;

    const targetRect = new Rect(targetX, targetY, targetWidth, targetHeight);

    const sprite = new Sprite(this.texture, sourceRect, targetRect);

    return sprite;
  }

  public word(word: string, offset = new Vector(0, 0)): Sprite[] {
    const wordSprites: Sprite[] = [];

    Array.from(word).forEach((character, index) => {
      const letterSpacing = index > 0 ? this.options.letterSpacing : 0;
      const characterOffset = offset
        .clone()
        .addX(index * (this.config.characterWidth + letterSpacing));

      const characterSprite = this.character(character, characterOffset);
      wordSprites.push(characterSprite);
    });

    return wordSprites;
  }

  public lines(lines: string[], offset = new Vector(0, 0)): Sprite[] {
    const lineSprites: Sprite[] = [];

    lines.forEach((word, index) => {
      const lineSpacing = index > 0 ? this.options.lineSpacing : 0;
      const wordOffset = offset
        .clone()
        .addY(index * (this.config.characterHeight + lineSpacing));

      const wordSprites = this.word(word, wordOffset);
      lineSprites.push(...wordSprites);
    });

    return lineSprites;
  }

  public getWordWidth(word: string): number {
    const { characterWidth } = this.config;
    const { letterSpacing } = this.options;

    const scale = this.getScaleVector();

    const charactersWidth = word.length * characterWidth * scale.x;
    const spacingWidth = (word.length - 1) * letterSpacing * scale.x;
    const wordWidth = charactersWidth + spacingWidth;

    return wordWidth;
  }

  public getCharacterHeight(): number {
    const scale = this.getScaleVector();

    const characterHeight = this.config.characterHeight * scale.y;

    return characterHeight;
  }

  public getLinesHeight(lines: string[]): number {
    const { characterHeight } = this.config;
    const { lineSpacing } = this.options;

    const scale = this.getScaleVector();

    const charactersHeight = lines.length * characterHeight * scale.y;
    const spacingHeight = (lines.length - 1) * lineSpacing * scale.y;
    const linesHeight = charactersHeight + spacingHeight;

    return linesHeight;
  }

  public getScaleVector(): Vector {
    const { scale } = this.options;

    if (typeof scale === 'number') {
      return new Vector(scale, scale);
    }

    return scale;
  }
}
