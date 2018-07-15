import GameObject from '../core/GameObject';

abstract class EnemyTank extends GameObject {
  public health: number = 1;
}

export default EnemyTank;
