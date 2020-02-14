import { Animation, Rotation, Sprite } from '../core';
import { SpriteFactory } from '../sprite/SpriteFactory';

import { TankGrade } from './TankGrade';
import { TankParty } from './TankParty';

export enum TankColor {
  Default = 'default',
  Primary = 'primary',
  Danger = 'danger',
}

const TANK_STRING = 'tank';
const SPRITE_ID_SEPARATOR = '.';

// TODO: Remake to factory?

export class TankSkin {
  public party: TankParty;
  public color: TankColor;
  public grade: TankGrade;
  public rotation: Rotation = Rotation.Up;
  public hasDrop: boolean;

  constructor(
    party: TankParty,
    color: TankColor,
    grade: TankGrade,
    hasDrop = false,
  ) {
    this.party = party;
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
    const color = hasDrop ? TankColor.Danger : this.color;

    const parts = [
      TANK_STRING,
      this.getPartyString(this.party),
      this.getColorString(color),
      this.getGradeString(this.grade),
      this.getRotationString(this.rotation),
      frameNumber.toString(),
    ];

    const id = parts.join(SPRITE_ID_SEPARATOR);

    return id;
  }

  private getColorString(color: TankColor): string {
    return color.toString();
  }

  private getGradeString(grade: TankGrade): string {
    return grade.toString();
  }

  private getPartyString(party: TankParty): string {
    return party.toString();
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
