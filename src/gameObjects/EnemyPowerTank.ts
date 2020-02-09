import { EnemyTank } from './EnemyTank';

export class EnemyPowerTank extends EnemyTank {
  public bulletSpeed = 15;
  protected health = 3;
  protected speed = 2;

  constructor(hasDrop = false) {
    super(52, 60, hasDrop);
  }
}
