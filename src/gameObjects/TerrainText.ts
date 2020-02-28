import {
  ArrayUtils,
  GameObject,
  GameObjectUpdateArgs,
  Rect,
  Text,
  TextOptions,
} from '../core';
import { TerrainFactory, TerrainType } from '../terrain';
import * as constants from '../constants';

export class TerrainText extends GameObject {
  private terrainType: TerrainType;
  private text: Text<Rect[]>;

  constructor(text = '', terrainType: TerrainType, options: TextOptions = {}) {
    super();

    this.text = new Text(text, options);
    this.terrainType = terrainType;
  }

  protected setup({ rectFontLoader }: GameObjectUpdateArgs): void {
    const font = rectFontLoader.load(constants.PRIMARY_RECT_FONT_ID);

    this.text.setFont(font);
    this.size.copy(this.text.getSize());

    const rects = this.text.build();
    const tiles = TerrainFactory.createFromRegions(
      this.terrainType,
      ArrayUtils.flatten(rects),
    );

    this.add(...tiles);
  }
}
