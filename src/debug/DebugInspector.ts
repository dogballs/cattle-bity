import { Subject, Vector } from '../core';
import { NumberUtils } from '../utils';

export class DebugInspector {
  public readonly click = new Subject<Vector>();
  protected readonly canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  public listen(): void {
    this.canvas.addEventListener('click', this.handleClick);
  }

  protected handleClick = (event: PointerEvent): void => {
    const pageScrollPosition = new Vector(
      window.pageXOffset,
      window.pageYOffset,
    );

    const cursorPagePosition = new Vector(event.pageX, event.pageY);

    const cursorWindowPosition = cursorPagePosition
      .clone()
      .sub(pageScrollPosition);

    const bounds = this.canvas.getBoundingClientRect();

    const x = NumberUtils.clamp(
      cursorWindowPosition.x - bounds.left,
      0,
      bounds.width,
    );
    const y = NumberUtils.clamp(
      cursorWindowPosition.y - bounds.top,
      0,
      bounds.height,
    );

    const position = new Vector(x, y);

    this.click.notify(position);
  };
}
