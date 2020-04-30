import {
  GameObject,
  RectPainter,
  Scene,
  SpritePainter,
  TextAlignment,
} from '../../core';
import { GameUpdateArgs, Rotation } from '../../game';
import { InputHint, SpriteText } from '../../gameObjects';
import { LevelHintInputContext, LevelPlayInputContext } from '../../input';
import { TankColor, TankSpriteId, TankType } from '../../tank';
import * as config from '../../config';

import { GameSceneType } from '../GameSceneType';

import { LevelLocationParams } from './params';

export class LevelHintScene extends Scene<LevelLocationParams> {
  private background: GameObject;
  private title: SpriteText;
  private tankIcon: GameObject;
  private moveUpHint: SpriteText;
  private moveDownHint: SpriteText;
  private moveLeftHint: SpriteText;
  private moveRightHint: SpriteText;
  private fireHint: SpriteText;
  private rapidFireHint: SpriteText;
  private pauseHint: SpriteText;
  private continueHint: GameObject;

  protected setup({
    inputHintSettings,
    inputManager,
    spriteLoader,
  }: GameUpdateArgs): void {
    inputHintSettings.setSeenLevelHint();

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

    const tankSpriteId = TankSpriteId.create(
      TankType.PlayerA(),
      TankColor.Primary,
      Rotation.Up,
    );
    this.tankIcon = new GameObject(64, 64);
    this.tankIcon.origin.set(0.5, 0.5);
    this.tankIcon.setCenterX(this.root.getSelfCenter().x);
    this.tankIcon.position.setY(302);
    this.tankIcon.painter = new SpritePainter(spriteLoader.load(tankSpriteId));
    this.root.add(this.tankIcon);

    const moveUpDisplayCode = inputManager.getPresentedControlCode(
      LevelPlayInputContext.MoveUp[0],
    );
    this.moveUpHint = new SpriteText(`${moveUpDisplayCode}\n↑`, {
      alignment: TextAlignment.Center,
    });
    this.moveUpHint.origin.set(0.5, 0.5);
    this.moveUpHint.setCenterX(this.root.getSelfCenter().x);
    this.moveUpHint.position.setY(216);
    this.root.add(this.moveUpHint);

    const moveDownDisplayCode = inputManager.getPresentedControlCode(
      LevelPlayInputContext.MoveDown[0],
    );
    this.moveDownHint = new SpriteText(`↓\n${moveDownDisplayCode}`, {
      alignment: TextAlignment.Center,
    });
    this.moveDownHint.origin.set(0.5, 0.5);
    this.moveDownHint.setCenterX(this.root.getSelfCenter().x);
    this.moveDownHint.position.setY(400);
    this.root.add(this.moveDownHint);

    const moveLeftDisplayCode = inputManager.getPresentedControlCode(
      LevelPlayInputContext.MoveLeft[0],
    );
    this.moveLeftHint = new SpriteText(`${moveLeftDisplayCode} ←`, {
      alignment: TextAlignment.Right,
    });
    this.moveLeftHint.origin.set(1, 0.5);
    this.moveLeftHint.position.set(460, 305);
    this.root.add(this.moveLeftHint);

    const moveRightDisplayCode = inputManager.getPresentedControlCode(
      LevelPlayInputContext.MoveRight[0],
    );
    this.moveRightHint = new SpriteText(`→ ${moveRightDisplayCode}`, {
      alignment: TextAlignment.Right,
    });
    this.moveRightHint.origin.set(0, 0.5);
    this.moveRightHint.position.set(560, 305);
    this.root.add(this.moveRightHint);

    const fireDisplayCode = inputManager.getPresentedControlCode(
      LevelPlayInputContext.Fire[0],
    );
    this.fireHint = new SpriteText(`FIRE       - ${fireDisplayCode}`);
    this.fireHint.position.set(250, 550);
    this.root.add(this.fireHint);

    const rapidFireDisplayCode = inputManager.getPresentedControlCode(
      LevelPlayInputContext.RapidFire[0],
    );
    this.rapidFireHint = new SpriteText(`RAPID FIRE - ${rapidFireDisplayCode}`);
    this.rapidFireHint.position.set(250, 600);
    this.root.add(this.rapidFireHint);

    const pauseDisplayCode = inputManager.getPresentedControlCode(
      LevelPlayInputContext.Pause[0],
    );
    this.pauseHint = new SpriteText(`PAUSE      - ${pauseDisplayCode}`);
    this.pauseHint.position.set(250, 650);
    this.root.add(this.pauseHint);

    const continueDisplayedCode = inputManager.getPresentedControlCode(
      LevelHintInputContext.Skip[0],
    );
    this.continueHint = new InputHint(`${continueDisplayedCode} TO CONTINUE`);
    this.root.add(this.continueHint);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { input } = updateArgs;

    if (input.isDownAny(LevelHintInputContext.Skip)) {
      // Map config is forwarded from level load scene
      this.navigator.replace(GameSceneType.LevelPlay, this.params);
      return;
    }

    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }
}
