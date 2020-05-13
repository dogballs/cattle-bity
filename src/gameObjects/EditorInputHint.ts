import { GameObject, RectPainter, SpriteLoader, TextAlignment } from '../core';
import { GameUpdateArgs } from '../game';
import {
  InputBindingType,
  EditorMapInputContext,
  InputManager,
} from '../input';
import { TerrainType } from '../terrain';
import * as config from '../config';

import { EditorBrush } from './editor';
import { SpriteText } from './text';

export class EditorInputHint extends GameObject {
  public zIndex = 0;
  private bindingType: InputBindingType;
  private inputManager: InputManager;
  private spriteLoader: SpriteLoader;
  private brushIcon: GameObject;
  private moveUpHint: SpriteText;
  private moveDownHint: SpriteText;
  private moveLeftHint: SpriteText;
  private moveRightHint: SpriteText;
  private drawHint: SpriteText;
  private eraseHint: SpriteText;
  private nextBrushHint: SpriteText;
  private prevBrushHint: SpriteText;
  private backHint: SpriteText;

  constructor(bindingType: InputBindingType) {
    super(config.CANVAS_WIDTH, 570);

    this.bindingType = bindingType;
  }

  public setVariantType(bindingType: InputBindingType): void {
    this.bindingType = bindingType;
    this.updateText();
  }

  protected setup(updateArgs: GameUpdateArgs): void {
    const { inputManager } = updateArgs;

    this.inputManager = inputManager;

    this.painter = new RectPainter(config.COLOR_GRAY_LIGHT);

    this.brushIcon = new EditorBrush(64, 64, TerrainType.Brick);
    this.brushIcon.origin.setX(0.5);
    this.brushIcon.setCenterX(this.getSelfCenter().x);
    this.brushIcon.position.setY(106);
    this.add(this.brushIcon);

    this.moveUpHint = new SpriteText('', {
      alignment: TextAlignment.Center,
    });
    this.moveUpHint.origin.setX(0.5);
    this.moveUpHint.setCenterX(this.getSelfCenter().x);
    this.moveUpHint.position.setY(20);
    this.add(this.moveUpHint);

    this.moveDownHint = new SpriteText('', {
      alignment: TextAlignment.Center,
    });
    this.moveDownHint.origin.setX(0.5);
    this.moveDownHint.setCenterX(this.getSelfCenter().x);
    this.moveDownHint.position.setY(190);
    this.add(this.moveDownHint);

    this.moveLeftHint = new SpriteText('', {
      alignment: TextAlignment.Right,
    });
    this.moveLeftHint.origin.setX(1);
    this.moveLeftHint.position.set(460, 125);
    this.add(this.moveLeftHint);

    this.moveRightHint = new SpriteText('', {
      alignment: TextAlignment.Right,
    });
    this.moveRightHint.position.set(560, 125);
    this.add(this.moveRightHint);

    this.drawHint = new SpriteText();
    this.drawHint.position.set(270, 320);
    this.add(this.drawHint);

    this.eraseHint = new SpriteText();
    this.eraseHint.position.set(270, 370);
    this.add(this.eraseHint);

    this.nextBrushHint = new SpriteText();
    this.nextBrushHint.position.set(270, 420);
    this.add(this.nextBrushHint);

    this.prevBrushHint = new SpriteText();
    this.prevBrushHint.position.set(270, 470);
    this.add(this.prevBrushHint);

    this.backHint = new SpriteText();
    this.backHint.position.set(270, 520);
    this.add(this.backHint);

    this.updateText();
  }

  private updateText(): void {
    const moveUpDisplayCode = this.inputManager.getDisplayedControlCode(
      this.bindingType,
      EditorMapInputContext.MoveUp[0],
    );
    this.moveUpHint.setText(`${moveUpDisplayCode}\n↑`);

    const moveDownDisplayCode = this.inputManager.getDisplayedControlCode(
      this.bindingType,
      EditorMapInputContext.MoveDown[0],
    );
    this.moveDownHint.setText(`↓\n${moveDownDisplayCode}`);

    const moveLeftDisplayCode = this.inputManager.getDisplayedControlCode(
      this.bindingType,
      EditorMapInputContext.MoveLeft[0],
    );
    this.moveLeftHint.setText(`${moveLeftDisplayCode} ←`);

    const moveRightDisplayCode = this.inputManager.getDisplayedControlCode(
      this.bindingType,
      EditorMapInputContext.MoveRight[0],
    );
    this.moveRightHint.setText(`→ ${moveRightDisplayCode}`);

    const drawDisplayCode = this.inputManager.getDisplayedControlCode(
      this.bindingType,
      EditorMapInputContext.Draw[0],
    );
    this.drawHint.setText(`DRAW       - ${drawDisplayCode}`);

    const eraseDisplayCode = this.inputManager.getDisplayedControlCode(
      this.bindingType,
      EditorMapInputContext.Erase[0],
    );
    this.eraseHint.setText(`ERASE      - ${eraseDisplayCode}`);

    const nextBrushDisplayCode = this.inputManager.getDisplayedControlCode(
      this.bindingType,
      EditorMapInputContext.NextBrush[0],
    );
    this.nextBrushHint.setText(`NEXT BRUSH - ${nextBrushDisplayCode}`);

    const prevBrushDisplayCode = this.inputManager.getDisplayedControlCode(
      this.bindingType,
      EditorMapInputContext.PrevBrush[0],
    );
    this.prevBrushHint.setText(`PREV BRUSH - ${prevBrushDisplayCode}`);

    const backDisplayCode = this.inputManager.getDisplayedControlCode(
      this.bindingType,
      EditorMapInputContext.Menu[0],
    );
    this.backHint.setText(`MENU       - ${backDisplayCode}`);
  }
}
