import { RenderObject } from './RenderObject';

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
  private readonly offscreenContext: OffscreenCanvasRenderingContext2D;

  constructor(options: GameRendererOptions = {}) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);

    this.canvas = document.createElement('canvas');
    this.canvas.width = options.width;
    this.canvas.height = options.height;

    this.context = this.canvas.getContext('2d');

    this.offscreenCanvas = new OffscreenCanvas(options.width, options.height);
    this.offscreenContext = this.offscreenCanvas.getContext('2d');
  }

  public getDomElement(): HTMLCanvasElement {
    return this.canvas;
  }

  public clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public render(root: RenderObject): void {
    this.clear();

    // When image is scaled, display pixels as is without smoothing.
    // Should be reset every time after clearing.
    this.context.imageSmoothingEnabled = false;

    this.offscreenContext.imageSmoothingEnabled = false;

    root.updateWorldMatrix(false, true);
    root.updateWorldVisible(false, true);
    root.updateWorldZIndex(false, true);

    const objects = root.flatten();

    const zSortedObjects = objects.sort((a, b) => {
      return a.worldZIndex - b.worldZIndex;
    });

    zSortedObjects.forEach((object) => {
      this.renderObject(object);
    });
  }

  private renderObject(renderObject: RenderObject): void {
    if (renderObject.painter === null) {
      return;
    }

    if (renderObject.worldVisible === false) {
      return;
    }

    renderObject.painter.paint(
      this.context,
      renderObject,
      this.offscreenContext,
    );

    if (this.options.debug) {
      this.renderObjectDebugBox(renderObject);
    }
  }

  // TODO: debug should not be a part of game renderer
  private renderObjectDebugBox(renderObject: RenderObject): void {
    const { min, max } = renderObject.getWorldBoundingBox();

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
