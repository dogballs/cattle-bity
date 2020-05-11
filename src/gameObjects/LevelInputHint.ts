import {
  GameObject,
  RectPainter,
  SpriteLoader,
  SpritePainter,
  TextAlignment,
} from '../core';
import { GameUpdateArgs, Rotation } from '../game';
import {
  InputManager,
  InputVariantType,
  LevelPlayInputContext,
} from '../input';
import { TankColor, TankSpriteId, TankType } from '../tank';
import * as config from '../config';

import { SpriteText } from './text';

export class LevelInputHint extends GameObject {
  public zIndex = 0;
  private variantType: InputVariantType;
  private inputManager: InputManager;
  private spriteLoader: SpriteLoader;
  private tankIcon: GameObject;
  private moveUpHint: SpriteText;
  private moveDownHint: SpriteText;
  private moveLeftHint: SpriteText;
  private moveRightHint: SpriteText;
  private fireHint: SpriteText;
  private rapidFireHint: SpriteText;
  private pauseHint: SpriteText;

  constructor(variantType: InputVariantType) {
    super(config.CANVAS_WIDTH, 510);

    this.variantType = variantType;
  }

  public setVariantType(variantType: InputVariantType): void {
    this.variantType = variantType;
    this.updateText();
  }

  protected setup(updateArgs: GameUpdateArgs): void {
    const { inputManager, spriteLoader } = updateArgs;

    this.inputManager = inputManager;
    this.spriteLoader = spriteLoader;

    this.painter = new RectPainter(config.COLOR_GRAY_LIGHT);

    const tankSpriteId = TankSpriteId.create(
      TankType.PlayerA(),
      TankColor.Primary,
      Rotation.Up,
    );
    this.tankIcon = new GameObject(64, 64);
    this.tankIcon.setZIndex(this.zIndex + 1);
    this.tankIcon.origin.setX(0.5);
    this.tankIcon.setCenterX(this.getSelfCenter().x);
    this.tankIcon.position.setY(106);
    this.tankIcon.painter = new SpritePainter(
      this.spriteLoader.load(tankSpriteId),
    );
    this.add(this.tankIcon);

    this.moveUpHint = new SpriteText('', {
      alignment: TextAlignment.Center,
    });
    this.moveUpHint.setZIndex(this.zIndex + 1);
    this.moveUpHint.origin.setX(0.5);
    this.moveUpHint.setCenterX(this.getSelfCenter().x);
    this.moveUpHint.position.setY(20);
    this.add(this.moveUpHint);

    this.moveDownHint = new SpriteText('', {
      alignment: TextAlignment.Center,
    });
    this.moveDownHint.setZIndex(this.zIndex + 1);
    this.moveDownHint.origin.setX(0.5);
    this.moveDownHint.setCenterX(this.getSelfCenter().x);
    this.moveDownHint.position.setY(190);
    this.add(this.moveDownHint);

    this.moveLeftHint = new SpriteText('', {
      alignment: TextAlignment.Right,
    });
    this.moveLeftHint.setZIndex(this.zIndex + 1);
    this.moveLeftHint.origin.setX(1);
    this.moveLeftHint.position.set(460, 125);
    this.add(this.moveLeftHint);

    this.moveRightHint = new SpriteText('', {
      alignment: TextAlignment.Right,
    });
    this.moveRightHint.setZIndex(this.zIndex + 1);
    this.moveRightHint.position.set(560, 125);
    this.add(this.moveRightHint);

    this.fireHint = new SpriteText('');
    this.fireHint.setZIndex(this.zIndex + 1);
    this.fireHint.position.set(250, 354);
    this.add(this.fireHint);

    this.rapidFireHint = new SpriteText('');
    this.rapidFireHint.setZIndex(this.zIndex + 1);
    this.rapidFireHint.position.set(250, 404);
    this.add(this.rapidFireHint);

    this.pauseHint = new SpriteText('');
    this.pauseHint.setZIndex(this.zIndex + 1);
    this.pauseHint.position.set(250, 454);
    this.add(this.pauseHint);

    this.updateText();
  }

  private updateText(): void {
    const moveUpDisplayCode = this.inputManager.getDisplayedControlCode(
      this.variantType,
      LevelPlayInputContext.MoveUp[0],
    );
    this.moveUpHint.setText(`${moveUpDisplayCode}\n↑`);

    const moveDownDisplayCode = this.inputManager.getDisplayedControlCode(
      this.variantType,
      LevelPlayInputContext.MoveDown[0],
    );
    this.moveDownHint.setText(`↓\n${moveDownDisplayCode}`);

    const moveLeftDisplayCode = this.inputManager.getDisplayedControlCode(
      this.variantType,
      LevelPlayInputContext.MoveLeft[0],
    );
    this.moveLeftHint.setText(`${moveLeftDisplayCode} ←`);

    const moveRightDisplayCode = this.inputManager.getDisplayedControlCode(
      this.variantType,
      LevelPlayInputContext.MoveRight[0],
    );
    this.moveRightHint.setText(`→ ${moveRightDisplayCode}`);

    const fireDisplayCode = this.inputManager.getDisplayedControlCode(
      this.variantType,
      LevelPlayInputContext.Fire[0],
    );
    this.fireHint.setText(`FIRE       - ${fireDisplayCode}`);

    const rapidFireDisplayCode = this.inputManager.getDisplayedControlCode(
      this.variantType,
      LevelPlayInputContext.RapidFire[0],
    );
    this.rapidFireHint.setText(`RAPID FIRE - ${rapidFireDisplayCode}`);

    const pauseDisplayCode = this.inputManager.getDisplayedControlCode(
      this.variantType,
      LevelPlayInputContext.Pause[0],
    );
    this.pauseHint.setText(`PAUSE      - ${pauseDisplayCode}`);
  }
}
