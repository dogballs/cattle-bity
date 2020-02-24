import { ArrayUtils, GameObject, GameObjectUpdateArgs, Text } from '../core';
import { TerrainFactory, TerrainType } from '../terrain';
import * as config from '../config';

export class GameOverScene extends GameObject {
  public setup({ rectFontLoader }: GameObjectUpdateArgs): void {
    const font = rectFontLoader.load('primary');
    const text = new Text('GAME\nOVER', font, {
      lineSpacing: 6,
      scale: config.TILE_SIZE_SMALL,
    });

    const rects = text.build();
    const tiles = TerrainFactory.createFromRegions(
      TerrainType.Brick,
      ArrayUtils.flatten(rects),
    );

    const textGroup = new GameObject(text.getWidth(), text.getHeight());
    textGroup.add(...tiles);
    textGroup.setCenter(this.getChildrenCenter());
    textGroup.position.addY(-32);
    this.add(textGroup);
  }

  public update(updateArgs: GameObjectUpdateArgs): void {
    this.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }
}
