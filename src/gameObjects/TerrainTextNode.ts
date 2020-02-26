import {
  ArrayUtils,
  GameObject,
  GameObjectUpdateArgs,
  Rect,
  Text,
  TextOptions,
} from '../core';
import { TerrainFactory, TerrainType } from '../terrain';

export class TerrainTextNode extends GameObject {
  private readonly fontId: string;
  private terrainType: TerrainType;
  private text: Text<Rect[]>;

  constructor(
    fontId: string,
    message = '',
    terrainType: TerrainType,
    options: TextOptions = {},
  ) {
    super();

    this.fontId = fontId;
    this.text = new Text(message, options);
    this.terrainType = terrainType;
  }

  protected setup({ rectFontLoader }: GameObjectUpdateArgs): void {
    const font = rectFontLoader.load(this.fontId);

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
