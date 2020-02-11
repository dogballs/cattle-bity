import { BasicMaterial } from './BasicMaterial';
import { GameObject } from './GameObject';
import { Rect } from './Rect';
import { SpriteMaterial, SpriteAlignment } from './SpriteMaterial';

export interface RendererOptions {
  height?: number;
  debug?: boolean;
  width?: number;
}

const DEFAULT_OPTIONS = {
  debug: false,
  height: 640,
  width: 640,
};

export class Renderer {
  public readonly domElement: HTMLCanvasElement;
  public readonly options: RendererOptions;
  private readonly context: CanvasRenderingContext2D;

  constructor(options: RendererOptions = {}) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);

    this.domElement = document.createElement('canvas');
    this.domElement.width = options.width;
    this.domElement.height = options.height;

    this.context = this.domElement.getContext('2d');
  }

  public clear(): void {
    this.context.clearRect(0, 0, this.domElement.width, this.domElement.height);
  }

  public render(root: GameObject): void {
    this.clear();

    // When image is scaled, display pixels as is without smoothing.
    // Should be reset every time after clearing.
    this.context.imageSmoothingEnabled = false;

    this.renderGameObject(root);
  }

  private renderGameObject(gameObject: GameObject): void {
    const material = gameObject.material;

    if (material instanceof BasicMaterial) {
      this.renderGameObjectWithBasicMaterial(gameObject);
    } else if (material instanceof SpriteMaterial) {
      this.renderGameObjectWithSpriteMaterial(gameObject);
    }

    if (this.options.debug) {
      this.renderGameObjectDebugFrame(gameObject);
    }

    gameObject.children.forEach((child) => {
      this.renderGameObject(child);
    });
  }

  private renderGameObjectWithBasicMaterial(gameObject: GameObject): void {
    const { min, max } = gameObject.getWorldBoundingBox();

    this.context.beginPath();
    this.context.moveTo(min.x, min.y);
    this.context.lineTo(max.x, min.y);
    this.context.lineTo(max.x, max.y);
    this.context.lineTo(min.x, max.y);
    this.context.lineTo(min.x, min.y);

    const { fillColor, strokeColor } = gameObject.material;

    if (fillColor !== null) {
      this.context.fillStyle = fillColor;
      this.context.fill();
    }

    if (strokeColor !== null) {
      this.context.strokeStyle = strokeColor;
      this.context.stroke();
    }
  }

  private renderGameObjectWithSpriteMaterial(gameObject: GameObject): void {
    const objectBox = gameObject.getWorldBoundingBox();
    const objectRect = objectBox.toRect();

    const material = gameObject.material as SpriteMaterial;

    const sprite = material.sprite;
    if (sprite === null) {
      return;
    }
    if (sprite.texture.imageElement === null) {
      return;
    }

    let targetRect = objectRect;
    if (material.alignment === SpriteAlignment.Stretch) {
      targetRect = objectRect;
    } else if (material.alignment === SpriteAlignment.TopLeft) {
      targetRect = new Rect(
        objectRect.x,
        objectRect.y,
        sprite.targetDims.width,
        sprite.targetDims.height,
      );
    } else if (material.alignment === SpriteAlignment.Center) {
      targetRect = new Rect(
        objectRect.x + objectRect.width / 2 - sprite.targetDims.width / 2,
        objectRect.y + objectRect.height / 2 - sprite.targetDims.height / 2,
        sprite.targetDims.width,
        sprite.targetDims.height,
      );
    }

    this.context.drawImage(
      sprite.texture.imageElement,
      sprite.textureRect.x,
      sprite.textureRect.y,
      sprite.textureRect.width,
      sprite.textureRect.height,
      targetRect.x,
      targetRect.y,
      targetRect.width,
      targetRect.height,
    );
  }

  private renderGameObjectDebugFrame(gameObject: GameObject): void {
    const { min, max } = gameObject.getWorldBoundingBox();

    this.context.beginPath();
    this.context.moveTo(min.x, min.y);
    this.context.lineTo(max.x, min.y);
    this.context.lineTo(max.x, max.y);
    this.context.lineTo(min.x, max.y);
    this.context.lineTo(min.x, min.y);

    this.context.strokeStyle = '#fff';
    this.context.stroke();
  }
}
