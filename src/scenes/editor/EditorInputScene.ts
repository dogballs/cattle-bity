import { GameObject, RectPainter } from '../../core';
import { GameUpdateArgs } from '../../game';
import { EditorInputHint, SceneInputHint, SpriteText } from '../../gameObjects';
import { EditorHintInputContext } from '../../input';
import * as config from '../../config';

import { GameScene } from '../GameScene';
import { GameSceneType } from '../GameSceneType';

import { EditorLocationParams } from './params';

export class EditorInputScene extends GameScene<EditorLocationParams> {
  private background: GameObject;
  private title: SpriteText;
  private editorHint: EditorInputHint;
  private continueHint: GameObject;

  protected setup({ inputHintSettings, inputManager }: GameUpdateArgs): void {
    inputHintSettings.setSeenEditorHint();

    const activeVariantType = inputManager.getActiveVariantType();

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

    this.editorHint = new EditorInputHint(activeVariantType);
    this.editorHint.position.setY(200);
    this.root.add(this.editorHint);

    const continueDisplayedCode = inputManager.getDisplayedControlCode(
      activeVariantType,
      EditorHintInputContext.Skip[0],
    );
    this.continueHint = new SceneInputHint(
      `${continueDisplayedCode} TO CONTINUE`,
    );
    this.root.add(this.continueHint);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { inputManager } = updateArgs;

    const inputVariant = inputManager.getActiveVariant();

    if (inputVariant.isDownAny(EditorHintInputContext.Skip)) {
      // Forward params
      this.navigator.replace(GameSceneType.EditorMap, this.params);
      return;
    }

    super.update(updateArgs);
  }
}
