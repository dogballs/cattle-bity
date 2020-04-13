import { Animation, BoxCollider, Sprite, SpritePainter } from '../../core';
import { GameUpdateArgs, Tag } from '../../game';
import { TerrainType } from '../../terrain';
import * as config from '../../config';

import { TerrainTile } from '../TerrainTile';

export class WaterTerrainTile extends TerrainTile {
  public type = TerrainType.Water;
  public collider = new BoxCollider(this);
  public tags = [Tag.BlockMove];
  public readonly painter = new SpritePainter();
  private animation: Animation<Sprite>;

  constructor() {
    super(config.WATER_TILE_SIZE, config.WATER_TILE_SIZE);
  }

  public destroy(): void {
    super.destroy();
    this.collider.unregister();
  }

  protected setup({ collisionSystem, spriteLoader }: GameUpdateArgs): void {
    collisionSystem.register(this.collider);

    this.animation = new Animation(
      spriteLoader.loadList(['terrain.water.1', 'terrain.water.2']),
      { delay: 0.5, loop: true },
    );
  }

  protected update(updateArgs: GameUpdateArgs): void {
    this.collider.update();

    this.animation.update(updateArgs.deltaTime);
    this.painter.sprite = this.animation.getCurrentFrame();
  }
}
