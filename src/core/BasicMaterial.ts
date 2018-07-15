import Material from './Material';

class BasicMaterial extends Material {
  constructor(color: string = '#000') {
    super();

    this.color = color;
  }
}

export default BasicMaterial;
