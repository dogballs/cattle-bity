import { GameObject, LineRenderer, Vector } from '../core';

export class DebugGrid extends GameObject {
  protected readonly step: number;

  constructor(width: number, height: number, step: number, color = '#000') {
    super(width, height);

    this.step = step;

    for (let x = 0; x <= width; x += step) {
      const line = new GameObject();
      const renderer = new LineRenderer();
      renderer.strokeColor = color;
      renderer.positions.push(new Vector(x, 0), new Vector(x, height));
      line.renderer = renderer;
      this.add(line);
    }

    for (let y = 0; y <= height; y += step) {
      const line = new GameObject();
      const renderer = new LineRenderer();
      renderer.strokeColor = color;
      renderer.positions.push(new Vector(0, y), new Vector(width, y));
      line.renderer = renderer;
      this.add(line);
    }
  }
}
