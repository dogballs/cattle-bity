import { GameObject, RectPainter } from '../../core';
import { GameUpdateArgs } from '../../game';
import {
  LevelInputHint,
  SceneInputHint,
  SelectorMenuItem,
  SelectorMenuItemChoice,
  SpriteText,
} from '../../gameObjects';
import { InputVariantType, LevelHintInputContext } from '../../input';
import * as config from '../../config';

import { GameScene } from '../GameScene';
import { GameSceneType } from '../GameSceneType';

import { LevelLocationParams } from './params';

const VARIANT_SELECTOR_CHOICES: SelectorMenuItemChoice<InputVariantType>[] = [
  { value: InputVariantType.PrimaryKeyboard(), text: 'KEYBOARD 1' },
  { value: InputVariantType.SecondaryKeyboard(), text: 'KEYBOARD 2' },
  { value: InputVariantType.TertiaryKeyboard(), text: 'KEYBOARD 3' },
  { value: InputVariantType.PrimaryGamepad(), text: 'GAMEPAD 1' },
  { value: InputVariantType.SecondaryGamepad(), text: 'GAMEPAD 2' },
];

export class LevelInputScene extends GameScene<LevelLocationParams> {
  private background: GameObject;
  private title: SpriteText;
  private selector: SelectorMenuItem<InputVariantType>;
  private levelHint: LevelInputHint;
  private continueHint: GameObject;

  protected setup({ inputHintSettings, inputManager }: GameUpdateArgs): void {
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

    this.selector = new SelectorMenuItem(VARIANT_SELECTOR_CHOICES, {
      color: config.COLOR_WHITE,
      containerWidth: 340,
    });
    this.selector.origin.set(0.5, 0.5);
    this.selector.setCenterX(this.root.getSelfCenter().x);
    this.selector.position.setY(144);
    this.selector.changed.addListener(this.handleSelectorChanged);
    // this.root.add(this.selector);

    this.levelHint = new LevelInputHint(inputManager.getActiveVariantType());
    this.levelHint.position.setY(200);
    this.root.add(this.levelHint);

    const continueDisplayedCode = inputManager.getDisplayedControlCode(
      inputManager.getActiveVariantType(),
      LevelHintInputContext.Skip[0],
    );
    this.continueHint = new SceneInputHint(
      `${continueDisplayedCode} TO CONTINUE`,
    );
    this.root.add(this.continueHint);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { inputManager } = updateArgs;

    const inputVariant = inputManager.getActiveVariant();

    if (inputVariant.isDownAny(LevelHintInputContext.Skip)) {
      // Map config is forwarded from level load scene
      this.navigator.replace(GameSceneType.LevelPlay, this.params);
      return;
    }

    super.update(updateArgs);

    // Usually it is handled by menu, but here we are using it outside menu
    this.selector.updateFocused(updateArgs);
  }

  private handleSelectorChanged = (
    choice: SelectorMenuItemChoice<InputVariantType>,
  ): void => {
    this.levelHint.setVariantType(choice.value);
  };
}
