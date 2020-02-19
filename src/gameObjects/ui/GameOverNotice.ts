import { GameObject, SpriteRenderer } from '../../core';
import { SpriteFactory } from '../../sprite/SpriteFactory';

export class GameOverNotice extends GameObject {
  public readonly renderer = new SpriteRenderer();

  constructor() {
    super(124, 60);

    this.renderer.sprite = SpriteFactory.asOne('ui.gameOver');
  }
}
