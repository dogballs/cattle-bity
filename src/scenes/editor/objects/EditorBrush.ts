import { GameObject, Rect } from '../../../core';
import { TerrainFactory, TerrainType } from '../../../terrain';

export class EditorBrush extends GameObject {
  public type: TerrainType;

  constructor(width: number, height: number, type: TerrainType) {
    super(width, height);

    this.type = type;
  }

  protected setup(): void {
    const tiles = TerrainFactory.createFromRegion(
      this.type,
      new Rect(0, 0, this.size.width, this.size.height),
    );
    this.add(...tiles);
  }
}
