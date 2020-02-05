import { BasicMaterial, GameObject } from '../core';

export class EnemyCounterItem extends GameObject {
  public readonly material = new BasicMaterial('#f00');

  constructor() {
    super(32, 32);
  }
}
