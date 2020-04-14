import { ArrayUtils, GameObject, Rect, Text, TextOptions } from '../../core';
import { GameUpdateArgs } from '../../game';
import { TerrainFactory, TerrainType } from '../../terrain';
import * as config from '../../config';

export class TerrainText extends GameObject {
  private terrainType: TerrainType;
  private text: Text<Rect[]>;

  constructor(text = '', terrainType: TerrainType, options: TextOptions = {}) {
    super();

    this.text = new Text(text, options);
    this.terrainType = terrainType;
  }

  protected setup({ rectFontLoader }: GameUpdateArgs): void {
    const font = rectFontLoader.load(config.PRIMARY_RECT_FONT_ID);

    this.text.setFont(font);
    this.size.copyFrom(this.text.getSize());

    const rects = this.text.build();
    const tiles = TerrainFactory.createFromRegions(
      this.terrainType,
      ArrayUtils.flatten(rects),
    );

    this.add(...tiles);
  }
}
