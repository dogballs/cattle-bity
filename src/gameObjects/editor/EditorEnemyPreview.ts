import {
  Animation,
  GameObject,
  RectPainter,
  Sprite,
  SpritePainter,
} from '../../core';
import { GameObjectUpdateArgs, Rotation } from '../../game';
import { TankType, TankIdleAnimation } from '../../tank';
import * as config from '../../config';

export class EditorEnemyPreview extends GameObject {
  public painter = new RectPainter(null, config.COLOR_WHITE);
  private container: GameObject;
  private animations: Animation<Sprite>[] = [];
  private types: TankType[];
  private selectedIndex = -1;

  constructor(types: TankType[] = []) {
    super(96, 96);

    this.types = types;
  }

  public show(typeToShow: TankType): void {
    const index = this.types.findIndex((type) => type.equals(typeToShow));

    this.selectedIndex = index;

    if (this.selectedIndex === -1) {
      this.visible = false;
    } else {
      this.visible = true;
    }
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    this.container = new GameObject(64, 64);
    this.container.setCenter(this.getSelfCenter());
    this.container.painter = new SpritePainter();
    this.add(this.container);

    this.animations = this.types.map((type) => {
      return new TankIdleAnimation(
        spriteLoader,
        type,
        Rotation.Up,
        type.hasDrop,
      );
    });
  }

  protected update({ deltaTime }: GameObjectUpdateArgs): void {
    const animation = this.animations[this.selectedIndex];
    if (animation === undefined) {
      return;
    }

    animation.update(deltaTime);

    const painter = this.container.painter as SpritePainter;
    painter.sprite = animation.getCurrentFrame();
  }
}
