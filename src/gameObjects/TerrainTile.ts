import { GameObject, Subject, Vector } from '../core';
import { TerrainType } from '../terrain';

export abstract class TerrainTile extends GameObject {
  public abstract type: TerrainType;
  public destroyed = new Subject<{ centerPosition: Vector }>();

  public destroy(): void {
    this.removeSelf();
    this.destroyed.notify({
      centerPosition: this.getCenter(),
    });
  }
}
