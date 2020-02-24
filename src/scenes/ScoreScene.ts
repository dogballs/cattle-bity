import { GameObject, GameObjectUpdateArgs, RectRenderer } from '../core';
import * as config from '../config';

export class ScoreScene extends GameObject {
  public setup({ spriteFontLoader }: GameObjectUpdateArgs): void {
    this.renderer = new RectRenderer(config.BACKGROUND_COLOR);

    const font = spriteFontLoader.load('primary');
    console.log(font);
  }
}
