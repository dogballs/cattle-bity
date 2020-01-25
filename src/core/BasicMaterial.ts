import { Material } from './Material';

export class BasicMaterial extends Material {
  constructor(fillColor = null, strokeColor = null) {
    super();

    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
  }
}
