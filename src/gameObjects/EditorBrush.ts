import { BoundingBox, Size, GameObject, RectRenderer, Subject } from '../core';
import { GameObjectUpdateArgs } from '../game';
import { InputControl } from '../input';

export enum EditorBrushSize {
  Small = 0,
  Medium = 1,
  Large = 2,
}

export enum EditorBrushType {
  BrickWall = 0,
  SteelWall = 1,
}

export class EditorBrush extends GameObject {
  public brushSize: EditorBrushSize = EditorBrushSize.Large;
  public brushType: EditorBrushType = EditorBrushType.BrickWall;
  public renderer = new RectRenderer(null, 'red');
  public draw = new Subject<{ brushType: EditorBrushType; box: BoundingBox }>();

  constructor() {
    super();

    this.size = this.getBrushSize();
  }

  public update({ input }: GameObjectUpdateArgs): void {
    const { size } = this;

    if (input.isDown(InputControl.Up)) {
      this.position.y -= size.height;
    } else if (input.isDown(InputControl.Down)) {
      this.position.y += size.height;
    } else if (input.isDown(InputControl.Left)) {
      this.position.x -= size.width;
    } else if (input.isDown(InputControl.Right)) {
      this.position.x += size.height;
    }

    if (input.isDown(InputControl.A)) {
      this.switchToNextBrushSize();
    }

    if (input.isDown(InputControl.B)) {
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
