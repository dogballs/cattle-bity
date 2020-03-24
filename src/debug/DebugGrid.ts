import { GameObject, LinePainter, Vector } from '../core';

export class DebugGrid extends GameObject {
  protected readonly step: number;

  constructor(width: number, height: number, step: number, color = '#000') {
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
}
