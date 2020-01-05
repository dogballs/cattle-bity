import { BasicMaterial } from './BasicMaterial';
import { GameObject } from './GameObject';
import { Node } from './Node';
import { SpriteMaterial } from './SpriteMaterial';
import { Vector } from './Vector';

export class Renderer {
  public domElement: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor() {
    this.domElement = document.createElement('canvas');
    this.context = this.domElement.getContext('2d');
  }

  public setSize(width: number, height: number) {
    this.domElement.width = width;
    this.domElement.height = height;
  }

  public clear() {
    this.context.clearRect(0, 0, this.domElement.width, this.domElement.height);
  }

  public render(root: GameObject) {
    this.clear();

    // When image is scaled, display pixels as is without smoothing.
    // Should be reset every time after clearing.
    this.context.imageSmoothingEnabled = false;

    this.renderGameObject(root);
  }

  private renderGameObject(gameObject: GameObject) {
    const material = gameObject.material;

    if (material instanceof BasicMaterial) {
      this.renderGameObjectWithBasicMaterial(gameObject);
    } else if (material instanceof SpriteMaterial) {
      this.renderGameObjectWithSpriteMaterial(gameObject);
    }

    gameObject.children.forEach((child) => {
      this.renderGameObject(child);
    });
  }

  private renderGameObjectWithBasicMaterial(gameObject: GameObject) {
    const { min, max } = gameObject.getWorldBoundingBox();

    this.context.beginPath();
    this.context.moveTo(min.x, min.y);
    this.context.lineTo(max.x, min.y);
    this.context.lineTo(max.x, max.y);
    this.context.lineTo(min.x, max.y);
    this.context.lineTo(min.x, min.y);

    const { color } = gameObject.material;

    this.context.fillStyle = color;
    this.context.fill();
  }

  private renderGameObjectWithSpriteMaterial(gameObject: GameObject) {
    const { min, max } = gameObject.getWorldBoundingBox();
    const { width, height } = gameObject.getComputedDimensions();

    const material = gameObject.material;

    const sprite = material.sprite;
    if (sprite === null) {
      return;
    }

    this.context.drawImage(
      sprite.texture.imageElement,
      sprite.rect.x,
      sprite.rect.y,
      sprite.rect.w,
      sprite.rect.h,
      min.x,
      min.y,
      max.x - min.x,
      max.y - min.y,
    );

    this.renderGameObjectDebugFrame(gameObject);
  }

  private renderGameObjectDebugFrame(gameObject: GameObject) {
    const { min, max } = gameObject.getWorldBoundingBox();
    const { width, height } = gameObject.getComputedDimensions();

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
