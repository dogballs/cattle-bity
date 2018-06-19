import RenderableSprite from '../core/RenderableSprite';

abstract class EnemyTank extends RenderableSprite {
  public abstract update();
  public abstract render();
}

export default EnemyTank;
