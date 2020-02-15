import {
  BoundingBox,
  Size,
  GameObject,
  KeyboardInput,
  KeyboardKey,
  RectRenderer,
  Subject,
} from '../core';

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

  public update({ input }: { input: KeyboardInput }): void {
    const { size } = this;

    if (input.isDown(KeyboardKey.ArrowUp)) {
      this.position.y -= size.height;
    } else if (input.isDown(KeyboardKey.ArrowDown)) {
      this.position.y += size.height;
    } else if (input.isDown(KeyboardKey.ArrowLeft)) {
      this.position.x -= size.width;
    } else if (input.isDown(KeyboardKey.ArrowRight)) {
      this.position.x += size.height;
    }

    if (input.isDown(KeyboardKey.B)) {
      this.switchToNextBrushSize();
    }

    if (input.isDown(KeyboardKey.Space)) {
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
