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
  public readonly domElement: HTMLCanvasElement;
  public readonly options: GameRendererOptions;
  protected readonly context: CanvasRenderingContext2D;

  constructor(options: GameRendererOptions = {}) {
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

  protected renderGameObject(gameObject: GameObject): void {
    if (gameObject.renderer !== null && gameObject.visible) {
      gameObject.renderer.render(this.domElement, gameObject);
    }

    if (this.options.debug) {
      this.renderGameObjectDebugFrame(gameObject);
    }

    if (gameObject.visible === true) {
      gameObject.children.forEach((child) => {
        this.renderGameObject(child);
      });
    }
  }

  // TODO: debug should not be a part of game renderer
  protected renderGameObjectDebugFrame(gameObject: GameObject): void {
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
