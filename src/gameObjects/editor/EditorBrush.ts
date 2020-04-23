import { GameObject, Rect } from '../../core';
import { TerrainFactory, TerrainType } from '../../terrain';
import * as config from '../../config';

export class EditorBrush extends GameObject {
  public type: TerrainType;
  public zIndex = config.EDITOR_BRUSH_Z_INDEX;

  constructor(width: number, height: number, type: TerrainType) {
    super(width, height);

    this.type = type;
  }

  protected setup(): void {
    const tiles = TerrainFactory.createFromRegions(this.type, [
      new Rect(0, 0, this.size.width, this.size.height),
    ]);
    for (const tile of tiles) {
      tile.setZIndex(this.zIndex + 1);
      this.add(tile);
    }
  }
}
