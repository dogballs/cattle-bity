import { CanvasRenderContext, RenderContext } from './render';

import { BoundingBox } from './BoundingBox';
import { RenderObject } from './RenderObject';

export interface GameRendererOptions {
  debug?: boolean;
  dirtyPassCount?: number;
  height?: number;
  width?: number;
}

const DEFAULT_OPTIONS = {
  debug: false,
  dirtyPassCount: 2,
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
    // Update all world matrixes for all objects in the tree.
    // Note: only objects that actually need an update will recalculate their
    // matrix, thanks to dirty flag.
    root.updateWorldMatrix(false, true);

    const objects = [];

    // Move all objects into an array
    root.traverse((object) => {
      // Root is handled separately later on, because root is a scene root.
      if (object === root) {
        return;
      }

      objects.push(object);

      // Some objects might have been removed. We need to re-render the area
      // they were removed at.
      // Each object stores a list of children that have been removed.
      // Retrieve them and then clear the list for the next frame.
      if (object.removedChildren.length > 0) {
        objects.push(...object.removedChildren);
        object.cleanupRemoved();
      }
    });

    let wasRootCleared = false;

    // If scene root needs to repaint, means that entire scene needs to repaint.
    // In that case we simply clear the enitre screen.
    if (root.doesNeedPaint()) {
      this.clearBox(root.getWorldBoundingBox());

      root.resetNeedsPaint();

      wasRootCleared = true;

      // In case some object have been marked as dirty, skip this info,
      // because we are clearing entire screen anyway, so this info does not
      // transition into next frame.
      for (const object of objects) {
        object.resetPrevDirtyBox();
      }
    }

    // Objects that will be painted
    const dirtyObjects: RenderObject[] = [];

    // If entire scene was cleared - all objects must be rendered
    if (wasRootCleared) {
      dirtyObjects.push(...objects);
    } else {
      // Otherwise, we need to find which objects need re-paint for any reason
      // like animation, movement or visibility change.

      // Bounding boxes that will be cleared
      const dirtyBoxes: BoundingBox[] = [];

      for (const object of objects) {
        const box = object.getWorldBoundingBox();

        // In case object in renderable and wants to repaint
        if (object.canRender() && object.doesNeedPaint()) {
          dirtyObjects.push(object);
          dirtyBoxes.push(box);
        }

        // In case object has marked his previous bounding box (his previous
        // position) as dirty and he wants it to be cleared as well.
        const prevBox = object.getPrevDirtyBox();
        if (prevBox !== null) {
          dirtyBoxes.push(prevBox);
          object.resetPrevDirtyBox();
        }
      }

      // At this moment we collected all objects who wanted to repaint and
      // their current and previous boxes that need clearing.
      // But these objects might overlap with other object who did not want
      // to repaint, but because dirty object touch them, they need to be
      // repaint as well.
      // Each time we find new overlaped objects, they become dirty and need
      // re-paint like the original ones. But new dirty objects might now touch
      // other resting objects as well. So this becomes a cycle of multiple
      // passes to ensure that all touching objects are marked as dirty.
      // For now, during testing, the number of passes is hardcoded as it seem
      // to cover all cases.

      for (let i = 0; i < this.options.dirtyPassCount; i += 1) {
        // Note: arrays will be populated by reference
        this.findIntersectionBoxes(objects, dirtyBoxes, dirtyObjects);
      }

      // Clear all dirty boxes
      for (const dirtyBox of dirtyBoxes) {
        this.clearBox(dirtyBox);
      }
    }

    // Sort object by z-index before rendering they will be rendered in
    // right order
    const zSortedObjects = dirtyObjects.sort((a, b) => {
      return a.getWorldZIndex() - b.getWorldZIndex();
    });

    zSortedObjects.forEach((object) => {
      this.renderObject(object);
    });
  }

  private renderObject(renderObject: RenderObject): void {
    if (this.options.debug) {
      this.renderDebugBox(renderObject.getWorldBoundingBox());
    }

    if (!renderObject.canRender()) {
      return;
    }

    if (renderObject.isRemoved) {
      return;
    }

    renderObject.painter.paint(this.context, renderObject);
    renderObject.resetNeedsPaint();
  }

  private findIntersectionBoxes(
    objects: RenderObject[],
    dirtyBoxes: BoundingBox[],
    dirtyObjects: RenderObject[],
  ): void {
    // Walk over all available objects
    for (const object of objects) {
      // Only check the ones that are renderable
      if (!object.canRender()) {
        continue;
      }

      // Object is already marked
      if (object.doesNeedPaint()) {
        continue;
      }

      const box = object.getWorldBoundingBox();

      // Check if object intersects any dirty box
      for (const dirtyBox of dirtyBoxes) {
        // Make sure object is not in the list already
        if (box.intersectsBox(dirtyBox) && !dirtyObjects.includes(object)) {
          dirtyObjects.push(object);
          dirtyBoxes.push(box);
          break;
        }
      }
    }
  }

  private clearBox(box: BoundingBox): void {
    this.context.clearRect(
      Math.round(box.min.x),
      Math.round(box.min.y),
      box.max.x - box.min.x,
      box.max.y - box.min.y,
    );
  }

  private renderDebugBox(box: BoundingBox, color = '#fff'): void {
    this.context.strokeRect(
      box.min.x,
      box.min.y,
      box.max.x - box.min.x,
      box.max.y - box.min.y,
      color,
    );
  }
}
