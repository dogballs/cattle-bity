import { CanvasRenderContext, RenderContext } from './render';

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
  private readonly context: RenderContext;

  constructor(options: GameRendererOptions = {}) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);

    this.canvas = document.createElement('canvas');
    this.canvas.width = options.width;
    this.canvas.height = options.height;

    this.context = new CanvasRenderContext(this.canvas);
    this.context.init();
  }

  public getDomElement(): HTMLCanvasElement {
    return this.canvas;
  }

  public render(root: RenderObject): void {
    this.context.clear();

    root.updateWorldMatrix(false, true);

    const objects = root.flatten();

    const zSortedObjects = objects.sort((a, b) => {
      return a.getWorldZIndex() - b.getWorldZIndex();
    });

    zSortedObjects.forEach((object) => {
      this.renderObject(object);
    });
  }

  private renderObject(renderObject: RenderObject): void {
    if (renderObject.painter === null) {
      return;
    }

    if (renderObject.getWorldVisible() === false) {
      return;
    }

    renderObject.painter.paint(this.context, renderObject);

    if (this.options.debug) {
      this.renderObjectDebugBox(renderObject);
    }
  }

  // TODO: debug should not be a part of game renderer
  private renderObjectDebugBox(renderObject: RenderObject): void {
    const box = renderObject.getWorldBoundingBox();
    const rect = box.toRect();

    this.context.strokeRect(rect, '#fff');
  }
}
