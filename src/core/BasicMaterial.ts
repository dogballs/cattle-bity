import { Material } from './Material';

export class BasicMaterial extends Material {
  constructor(color = '#000') {
    super();

    this.color = color;
  }
}
