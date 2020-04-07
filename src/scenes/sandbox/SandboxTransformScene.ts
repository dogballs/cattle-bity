import { GameObject, RectPainter, Scene } from '../../core';
import { GameUpdateArgs } from '../../game';
import { InputControl } from '../../input';
import { TankColor } from '../../tank';

import { TestTank } from '../../gameObjects/TestTank';

export class SandboxTransformScene extends Scene {
  private parent: GameObject;
  private child: GameObject;
  private angle = 0;

  protected setup(): void {
    this.root.painter = new RectPainter('#777');

    this.parent = new GameObject(600, 300);
    this.parent.painter = new RectPainter('#00f');
    this.parent.position.set(200, 200);
    this.parent.pivot.set(0.5, 0.5);
    this.parent.rotate(45);

    this.child = new GameObject(100, 50);
    this.child.painter = new RectPainter('#f00');
    this.child.position.set(100, 100);
    this.child.pivot.set(0.5, 0.5);
    this.child.rotate(90);

    this.root.add(this.parent);
    this.parent.add(this.child);

    const tank1 = new TestTank(TankColor.Default, TankColor.Secondary);
    tank1.position.set(20, 20);
    this.root.add(tank1);

    const tank2 = new TestTank(TankColor.Default, TankColor.Primary);
    tank2.position.set(100, 20);
    this.root.add(tank2);

    const tank3 = new TestTank(TankColor.Primary, TankColor.Secondary);
    tank3.position.set(180, 20);
    this.root.add(tank3);

    // const tank4 = new TestTank(TankColor.Secondary, TankColor.Primary);
    // tank4.position.set(260, 20);
    // this.root.add(tank4);

    // const tank5 = new TestTank(TankColor.Default, TankColor.Danger);
    // tank5.position.set(340, 20);
    // this.root.add(tank5);

    // const tank6 = new TestTank(TankColor.Danger, TankColor.Primary);
    // tank6.position.set(420, 20);
    // this.root.add(tank6);

    const tank7 = new TestTank(TankColor.Default, TankColor.Default);
    tank7.position.set(260, 20);
    this.root.add(tank7);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { input } = updateArgs;

    if (input.isDown(InputControl.Select)) {
      this.angle += 90;
      this.child.rotate(this.angle);
    }

    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }
}
