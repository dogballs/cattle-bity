import { Tag } from '../Tag';

import { Tank } from './Tank';

export abstract class EnemyTank extends Tank {
  public tags = [Tag.Tank, Tag.Enemy];
  public readonly hasDrop: boolean = false;

  constructor(width: number, height: number, hasDrop = false) {
    super(width, height);

    this.hasDrop = hasDrop;
  }
}
