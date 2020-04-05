import { Animation, GameObject, Sprite, SpritePainter } from '../../core';
import { GameUpdateArgs, Tag } from '../../game';
import * as config from '../../config';

export class WaterTerrainTile extends GameObject {
  public tags = [Tag.BlockMove];
  public readonly painter = new SpritePainter();
  private animation: Animation<Sprite>;

  constructor() {
    super(config.WATER_TILE_SIZE, config.WATER_TILE_SIZE);
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    this.animation = new Animation(
      spriteLoader.loadList(['terrain.water.1', 'terrain.water.2']),
      { delay: 0.5, loop: true },
    );
  }

  protected update(updateArgs: GameUpdateArgs): void {
    this.animation.update(updateArgs.deltaTime);
    this.painter.sprite = this.animation.getCurrentFrame();
  }
}
