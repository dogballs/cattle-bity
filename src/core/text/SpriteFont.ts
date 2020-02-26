import { Rect } from '../Rect';
import { Sprite } from '../Sprite';
import { Texture } from '../Texture';
import { Vector } from '../Vector';

import { Font } from './Font';

export interface SpriteFontConfig {
  file: string;
  characterSet: string;
  characterWidth: number;
  characterHeight: number;
  rowCount: number;
  columnCount: number;
  horizontalSpacing: number;
  verticalSpacing: number;
}

export class SpriteFont implements Font<Sprite> {
  public readonly config: SpriteFontConfig;
  public readonly texture: Texture;

  constructor(config: SpriteFontConfig, texture: Texture) {
    this.config = config;
    this.texture = texture;
  }

  public buildCharacter(
    character: string,
    scale = new Vector(1, 1),
    offset = new Vector(0, 0),
  ): Sprite {
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

    const targetX = offset.x * scale.x;
    const targetY = offset.y * scale.y;
    const targetWidth = characterWidth * scale.x;
    const targetHeight = characterHeight * scale.y;

    const targetRect = new Rect(targetX, targetY, targetWidth, targetHeight);

    const sprite = new Sprite(this.texture, sourceRect, targetRect);

    return sprite;
  }

  public getCharacterWidth(): number {
    return this.config.characterWidth;
  }

  public getCharacterHeight(): number {
    return this.config.characterHeight;
  }
}
