import {
  BasicMaterial,
  Dimensions,
  GameObject,
  KeyboardInput,
  KeyboardKey,
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

export enum EditorBrushEvent {
  Draw = 'Draw',
}

export class EditorBrush extends GameObject {
  public brushSize: EditorBrushSize = EditorBrushSize.Large;
  public brushType: EditorBrushType = EditorBrushType.BrickWall;
  public material = new BasicMaterial(null, 'red');

  constructor() {
    super();

    this.dimensions = this.getBrushDims();
  }

  public update({ input }: { input: KeyboardInput }): void {
    const { dimensions } = this;

    if (input.isDown(KeyboardKey.ArrowUp)) {
      this.position.y -= dimensions.height;
    } else if (input.isDown(KeyboardKey.ArrowDown)) {
      this.position.y += dimensions.height;
    } else if (input.isDown(KeyboardKey.ArrowLeft)) {
      this.position.x -= dimensions.width;
    } else if (input.isDown(KeyboardKey.ArrowRight)) {
      this.position.x += dimensions.height;
    }

    if (input.isDown(KeyboardKey.B)) {
      this.switchToNextBrushSize();
    }

    if (input.isDown(KeyboardKey.Space)) {
      this.emit(EditorBrushEvent.Draw, this.brushType, this.getBoundingBox());
    }
  }

  private switchToNextBrushSize(): void {
    let nextSize = this.brushSize + 1;
    if (nextSize > EditorBrushSize.Large) {
      nextSize = EditorBrushSize.Small;
    }
    this.brushSize = nextSize;
    this.dimensions = this.getBrushDims();
  }

  private getBrushDims(): Dimensions {
    switch (this.brushSize) {
      case EditorBrushSize.Small:
        return new Dimensions(16, 16);
      case EditorBrushSize.Medium:
        return new Dimensions(32, 32);
      case EditorBrushSize.Large:
      default:
        return new Dimensions(64, 64);
    }
  }
}
