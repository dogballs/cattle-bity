import { GameObject } from './GameObject';

export interface GameRendererOptions {
  height?: number;
  debug?: boolean;
  width?: number;
}

const DEFAULT_OPTIONS = {
  debug: false,
  height: 640,
  width: 640,
};

export class GameRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly options: GameRendererOptions;
  private readonly context: CanvasRenderingContext2D;
  private readonly offscreenCanvas: OffscreenCanvas;

  constructor(options: GameRendererOptions = {}) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);

    this.canvas = document.createElement('canvas');
    this.canvas.width = options.width;
    this.canvas.height = options.height;

    this.offscreenCanvas = new OffscreenCanvas(options.width, options.height);

    this.context = this.canvas.getContext('2d');
  }

  public getElement(): HTMLCanvasElement {
    return this.canvas;
  }

  public clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public render(root: GameObject): void {
    this.clear();

    // When image is scaled, display pixels as is without smoothing.
    // Should be reset every time after clearing.
    this.context.imageSmoothingEnabled = false;

    const offscreenContext = this.offscreenCanvas.getContext('2d');
    offscreenContext.imageSmoothingEnabled = false;

    root.updateWorldMatrix(false, true);

    this.renderGameObject(root);
  }

  private renderGameObject(gameObject: GameObject): void {
    if (gameObject.renderer !== null && gameObject.visible) {
      gameObject.renderer.render(this.canvas, gameObject, this.offscreenCanvas);
    }

    if (this.options.debug) {
      this.renderGameObjectDebugBox(gameObject);
    }

    if (gameObject.visible === true) {
      gameObject.children.forEach((child) => {
        this.renderGameObject(child);
      });
    }
  }

  // TODO: debug should not be a part of game renderer
  private renderGameObjectDebugBox(gameObject: GameObject): void {
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
