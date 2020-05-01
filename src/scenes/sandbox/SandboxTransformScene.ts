import { GameObject, SpritePainter } from '../../core';
import { GameUpdateArgs } from '../../game';
import { InputControl } from '../../input';

import { GameScene } from '../GameScene';

export class SandboxTransformScene extends GameScene {
  private parent: GameObject;
  private child: GameObject;
  private angle = 0;

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    const sprite = spriteLoader.load('tank.player.primary.a.up.1');

    this.parent = new GameObject(64, 64);
    this.parent.painter = new SpritePainter(sprite);
    this.parent.position.set(200, 200);
    // this.parent.pivot.set(0.5, 0.5);
    // this.parent.rotate(45);

    // this.child = new GameObject(100, 50);
    // this.child.painter = new RectPainter('#f00');
    // this.child.position.set(100, 100);
    // this.child.pivot.set(0.5, 0.5);
    // this.child.rotate(90);

    this.root.add(this.parent);
    // this.parent.add(this.child);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { input } = updateArgs;

    if (input.isDown(InputControl.PrimaryAction)) {
      this.parent.dirtyPaintBox();
      this.parent.position.addX(100);
      this.parent.updateMatrix();
      // this.angle += 90;
      // this.child.rotate(this.angle);
      // this.child.updateMatrix();
    }

    super.update(updateArgs);
  }
}
