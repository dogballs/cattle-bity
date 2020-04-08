import { GameObject, Subject } from '../core';
import { TerrainType } from '../terrain';

export abstract class TerrainTile extends GameObject {
  public abstract type: TerrainType;
  public destroyed = new Subject();

  public destroy(): void {
    this.removeSelf();
    this.destroyed.notify(null);
  }
}
