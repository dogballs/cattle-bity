import {
  ArrayUtils,
  GameObject,
  GameObjectUpdateArgs,
  Text,
  TextAlignment,
} from '../core';
import { TerrainFactory, TerrainType } from '../terrain';
import * as config from '../config';

export class Title extends GameObject {
  constructor() {
    super(752, 272);
  }

  protected setup({ rectFontLoader }: GameObjectUpdateArgs): void {
    const font = rectFontLoader.load('primary');
    const text = new Text('BATTLE\nCITY', font, {
      alignment: TextAlignment.Center,
      lineSpacing: 3,
      scale: config.TILE_SIZE_SMALL,
    });

    const rects = text.build();
    const tiles = TerrainFactory.createFromRegions(
      TerrainType.MenuBrick,
      ArrayUtils.flatten(rects),
    );

    this.add(...tiles);
  }
}
