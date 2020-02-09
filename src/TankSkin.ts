import { Animation, Rotation, Sprite } from './core';
import { SpriteFactory } from './sprite/SpriteFactory';

export enum TankGrade {
  A = 'a',
  E = 'e',
}

export enum TankColor {
  Gray = 'gray',
  Yellow = 'yellow',
}

const TANK_STRING = 'tank';
const DROP_STRING = 'drop';
const SPRITE_ID_SEPARATOR = '.';

export class TankSkin {
  public color: TankColor;
  public grade: TankGrade;
  public rotation: Rotation = Rotation.Up;
  public hasDrop: boolean;
  private sprites: Sprite[] = [];

  constructor(color: TankColor, grade: TankGrade, hasDrop = false) {
    this.color = color;
    this.grade = grade;
    this.hasDrop = hasDrop;
  }

  public createIdleAnimation(): Animation<Sprite> {
    const spriteIds = [];

    const frameNumber = 1;

    spriteIds.push(this.getSpriteId(frameNumber));

    if (this.hasDrop) {
      spriteIds.push(this.getSpriteId(frameNumber, true));
    }

    const sprites = SpriteFactory.asList(spriteIds);
    const animation = new Animation(sprites, { delay: 7, loop: true });

    return animation;
  }

  public createMoveAnimation(): Animation<Sprite> {
    const spriteIds = [];

    spriteIds.push(this.getSpriteId(1));
    spriteIds.push(this.getSpriteId(2));
    spriteIds.push(this.getSpriteId(1));
    spriteIds.push(this.getSpriteId(2));

    if (this.hasDrop) {
      spriteIds.push(this.getSpriteId(1, true));
      spriteIds.push(this.getSpriteId(2, true));
      spriteIds.push(this.getSpriteId(1, true));
      spriteIds.push(this.getSpriteId(2, true));
    }

    const sprites = SpriteFactory.asList(spriteIds);
    const animation = new Animation(sprites, { delay: 1, loop: true });

    return animation;
  }

  private getSpriteId(frameNumber: number, hasDrop = false): string {
    const parts = [];

    parts.push(TANK_STRING);
    parts.push(this.getColorString(this.color));
    parts.push(this.getGradeString(this.grade));

    if (hasDrop) {
      parts.push(DROP_STRING);
    }

    parts.push(this.getRotationString(this.rotation));
    parts.push(frameNumber.toString());

    const id = parts.join(SPRITE_ID_SEPARATOR);

    return id;
  }

  private getColorString(color: TankColor): string {
    return color.toString();
  }

  private getGradeString(grade: TankGrade): string {
    return grade.toString();
  }

  private getRotationString(rotation: Rotation): string {
    switch (rotation) {
      case Rotation.Up:
        return 'up';
      case Rotation.Down:
        return 'down';
      case Rotation.Left:
        return 'left';
      case Rotation.Right:
        return 'right';
    }
  }
}
