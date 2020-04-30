import { GameObject, RectPainter, Scene, TextAlignment } from '../../core';
import { GameUpdateArgs } from '../../game';
import { EditorBrush, InputHint, SpriteText } from '../../gameObjects';
import { EditorHintInputContext, EditorMapInputContext } from '../../input';
import { TerrainType } from '../../terrain';
import * as config from '../../config';

import { GameSceneType } from '../GameSceneType';

import { EditorLocationParams } from './params';

export class EditorHintScene extends Scene<EditorLocationParams> {
  private background: GameObject;
  private title: SpriteText;
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
  private continueHint: GameObject;

  protected setup({ inputHintSettings, inputManager }: GameUpdateArgs): void {
    inputHintSettings.setSeenEditorHint();

    this.background = new GameObject();
    this.background.size.copyFrom(this.root.size);
    this.background.painter = new RectPainter(config.COLOR_GRAY);
    this.root.add(this.background);

    this.title = new SpriteText('CONTROLS', {
      color: config.COLOR_YELLOW,
    });
    this.title.origin.set(0.5, 0.5);
    this.title.setCenterX(this.root.getSelfCenter().x);
    this.title.position.setY(64);
    this.root.add(this.title);

    this.brushIcon = new EditorBrush(64, 64, TerrainType.Brick);
    this.brushIcon.origin.set(0.5, 0.5);
    this.brushIcon.setCenterX(this.root.getSelfCenter().x);
    this.brushIcon.position.setY(302);
    this.root.add(this.brushIcon);

    const moveUpDisplayCode = inputManager.getPresentedControlCode(
      EditorMapInputContext.MoveUp[0],
    );
    this.moveUpHint = new SpriteText(`${moveUpDisplayCode}\n↑`, {
      alignment: TextAlignment.Center,
    });
    this.moveUpHint.origin.set(0.5, 0.5);
    this.moveUpHint.setCenterX(this.root.getSelfCenter().x);
    this.moveUpHint.position.setY(216);
    this.root.add(this.moveUpHint);

    const moveDownDisplayCode = inputManager.getPresentedControlCode(
      EditorMapInputContext.MoveDown[0],
    );
    this.moveDownHint = new SpriteText(`↓\n${moveDownDisplayCode}`, {
      alignment: TextAlignment.Center,
    });
    this.moveDownHint.origin.set(0.5, 0.5);
    this.moveDownHint.setCenterX(this.root.getSelfCenter().x);
    this.moveDownHint.position.setY(400);
    this.root.add(this.moveDownHint);

    const moveLeftDisplayCode = inputManager.getPresentedControlCode(
      EditorMapInputContext.MoveLeft[0],
    );
    this.moveLeftHint = new SpriteText(`${moveLeftDisplayCode} ←`, {
      alignment: TextAlignment.Right,
    });
    this.moveLeftHint.origin.set(1, 0.5);
    this.moveLeftHint.position.set(460, 305);
    this.root.add(this.moveLeftHint);

    const moveRightDisplayCode = inputManager.getPresentedControlCode(
      EditorMapInputContext.MoveRight[0],
    );
    this.moveRightHint = new SpriteText(`→ ${moveRightDisplayCode}`, {
      alignment: TextAlignment.Right,
    });
    this.moveRightHint.origin.set(0, 0.5);
    this.moveRightHint.position.set(560, 305);
    this.root.add(this.moveRightHint);

    const drawDisplayCode = inputManager.getPresentedControlCode(
      EditorMapInputContext.Draw[0],
    );
    this.drawHint = new SpriteText(`DRAW       - ${drawDisplayCode}`);
    this.drawHint.position.set(290, 500);
    this.root.add(this.drawHint);

    const eraseDisplayCode = inputManager.getPresentedControlCode(
      EditorMapInputContext.Erase[0],
    );
    this.eraseHint = new SpriteText(`ERASE      - ${eraseDisplayCode}`);
    this.eraseHint.position.set(290, 550);
    this.root.add(this.eraseHint);

    const nextBrushDisplayCode = inputManager.getPresentedControlCode(
      EditorMapInputContext.NextBrush[0],
    );
    this.nextBrushHint = new SpriteText(`NEXT BRUSH - ${nextBrushDisplayCode}`);
    this.nextBrushHint.position.set(290, 600);
    this.root.add(this.nextBrushHint);

    const prevBrushDisplayCode = inputManager.getPresentedControlCode(
      EditorMapInputContext.PrevBrush[0],
    );
    this.prevBrushHint = new SpriteText(`PREV BRUSH - ${prevBrushDisplayCode}`);
    this.prevBrushHint.position.set(290, 650);
    this.root.add(this.prevBrushHint);

    const backDisplayCode = inputManager.getPresentedControlCode(
      EditorMapInputContext.Menu[0],
    );
    this.backHint = new SpriteText(`MENU       - ${backDisplayCode}`);
    this.backHint.position.set(290, 700);
    this.root.add(this.backHint);

    const continueDisplayedCode = inputManager.getPresentedControlCode(
      EditorHintInputContext.Skip[0],
    );
    this.continueHint = new InputHint(`${continueDisplayedCode} TO CONTINUE`);
    this.root.add(this.continueHint);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { input } = updateArgs;

    if (input.isDownAny(EditorHintInputContext.Skip)) {
      // Forward params
      this.navigator.replace(GameSceneType.EditorMap, this.params);
      return;
    }

    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }
}
