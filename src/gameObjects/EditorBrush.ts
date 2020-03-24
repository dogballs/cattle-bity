import { BoundingBox, Size, GameObject, RectPainter, Subject } from '../core';
import { GameObjectUpdateArgs } from '../game';
import { EditorInputContext } from '../input';

export enum EditorBrushSize {
  Small = 0,
  Medium = 1,
  Large = 2,
}

export enum EditorBrushType {
  BrickWall = 0,
  SteelWall = 1,
}

export interface EditorBrushDrawEvent {
  brushType: EditorBrushType;
  box: BoundingBox;
}

export class EditorBrush extends GameObject {
  public brushSize: EditorBrushSize = EditorBrushSize.Large;
  public brushType: EditorBrushType = EditorBrushType.BrickWall;
  public renderer = new RectPainter(null, 'red');
  public draw = new Subject<EditorBrushDrawEvent>();

  constructor() {
    super();

    this.size = this.getBrushSize();
  }

  public update({ input }: GameObjectUpdateArgs): void {
    const { size } = this;

    if (input.isDownAny(EditorInputContext.MoveUp)) {
      this.position.y -= size.height;
    } else if (input.isDownAny(EditorInputContext.MoveDown)) {
      this.position.y += size.height;
    } else if (input.isDownAny(EditorInputContext.MoveLeft)) {
      this.position.x -= size.width;
    } else if (input.isDownAny(EditorInputContext.MoveRight)) {
      this.position.x += size.height;
    }

    if (input.isDownAny(EditorInputContext.ToggleBrushSize)) {
      this.switchToNextBrushSize();
    }

    if (input.isDownAny(EditorInputContext.Draw)) {
      this.draw.notify({
        brushType: this.brushType,
        box: this.getBoundingBox(),
      });
    }
  }

  private switchToNextBrushSize(): void {
    let nextSize = this.brushSize + 1;
    if (nextSize > EditorBrushSize.Large) {
      nextSize = EditorBrushSize.Small;
    }
    this.brushSize = nextSize;
    this.size = this.getBrushSize();
  }

  private getBrushSize(): Size {
    switch (this.brushSize) {
      case EditorBrushSize.Small:
        return new Size(16, 16);
      case EditorBrushSize.Medium:
        return new Size(32, 32);
      case EditorBrushSize.Large:
      default:
        return new Size(64, 64);
    }
  }
}
