import { GameObject, LinePainter, RectPainter, Vector } from '../core';
import * as config from '../config';

export class DebugGrid extends GameObject {
  public zIndex = config.DEBUG_GRID_Z_INDEX;
  private step: number;
  private highlightedCells: GameObject[] = [];

  constructor(width: number, height: number, step: number, color = '#fff') {
    super(width, height);

    this.step = step;

    for (let x = 0; x <= width; x += step) {
      const line = new GameObject();
      const painter = new LinePainter();
      painter.strokeColor = color;
      painter.positions.push(new Vector(x, 0), new Vector(x, height));
      line.painter = painter;
      this.add(line);
    }

    for (let y = 0; y <= height; y += step) {
      const line = new GameObject();
      const painter = new LinePainter();
      painter.strokeColor = color;
      painter.positions.push(new Vector(0, y), new Vector(width, y));
      line.painter = painter;
      this.add(line);
    }
  }

  public highlightCell(index: Vector, color = 'rgba(255, 0, 0, 0.5)'): void {
    const cell = new GameObject(this.step, this.step);
    cell.painter = new RectPainter(color);
    cell.position.set(index.x * this.step, index.y * this.step);
    this.highlightedCells.push(cell);
    this.add(cell);
  }

  public removeAllCellHighlights(): void {
    this.highlightedCells.forEach((cell) => {
      cell.removeSelf();
    });
    this.highlightedCells = [];
  }
}
