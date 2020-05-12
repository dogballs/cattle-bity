import { GameObject, RectPainter } from '../../core';
import { GameUpdateArgs, Session } from '../../game';
import {
  LevelInputHint,
  SceneInputHint,
  SelectorMenuItem,
  SelectorMenuItemChoice,
  SpriteText,
} from '../../gameObjects';
import { InputVariantType, LevelControlsInputContext } from '../../input';
import * as config from '../../config';

import { GameScene } from '../GameScene';
import { GameSceneType } from '../GameSceneType';

import { LevelControlsLocationParams, LevelPlayLocationParams } from './params';

const VARIANT_SELECTOR_CHOICES: SelectorMenuItemChoice<InputVariantType>[] = [
  { value: InputVariantType.PrimaryKeyboard(), text: 'KEYBOARD 1' },
  { value: InputVariantType.SecondaryKeyboard(), text: 'KEYBOARD 2' },
  { value: InputVariantType.TertiaryKeyboard(), text: 'KEYBOARD 3' },
  { value: InputVariantType.PrimaryGamepad(), text: 'GAMEPAD 1' },
  { value: InputVariantType.SecondaryGamepad(), text: 'GAMEPAD 2' },
];

// For multiplayer suggest primary player - keyboard #2, and for secondary
// player - keyboard #3. Will be queried by player index.
const DEFAULT_CHOICE_VALUES = [
  VARIANT_SELECTOR_CHOICES[1].value,
  VARIANT_SELECTOR_CHOICES[2].value,
];

export class LevelControlsScene extends GameScene<LevelControlsLocationParams> {
  private background: GameObject;
  private title: SpriteText;
  private selector: SelectorMenuItem<InputVariantType>;
  private levelHint: LevelInputHint;
  private continueHint: GameObject;
  private session: Session;

  protected setup({
    inputHintSettings,
    inputManager,
    session,
  }: GameUpdateArgs): void {
    this.session = session;

    inputHintSettings.setSeenLevelHint();

    let defaultVariantType = inputManager.getActiveVariantType();
    if (this.params.canSelectVariant) {
      defaultVariantType = DEFAULT_CHOICE_VALUES[this.params.playerIndex];
    }

    let choices = VARIANT_SELECTOR_CHOICES.slice();

    // For secondary player - remove the item primary player has picked
    if (this.params.canSelectVariant && this.params.playerIndex === 1) {
      const primaryPlayer = this.session.primaryPlayer;
      const primaryPlayerVariantType = primaryPlayer.getInputVariantType();

      choices = choices.filter((choice) => {
        return !choice.value.equals(primaryPlayerVariantType);
      });

      // Adjust default value in case primary player has picked secondary's
      // player default variant type; pick the oppositing variant
      if (defaultVariantType.equals(primaryPlayerVariantType)) {
        defaultVariantType = DEFAULT_CHOICE_VALUES[0];
      }
    }

    this.background = new GameObject();
    this.background.size.copyFrom(this.root.size);
    this.background.painter = new RectPainter(config.COLOR_GRAY);
    this.root.add(this.background);

    let titleText = 'CONTROLS';
    if (this.params.canSelectVariant) {
      const playerNumber = this.params.playerIndex + 1;
      titleText = `PLAYER ${playerNumber}`;
    }

    this.title = new SpriteText(titleText, {
      color: config.COLOR_YELLOW,
    });
    this.title.origin.set(0.5, 0.5);
    this.title.setCenterX(this.root.getSelfCenter().x);
    this.title.position.setY(64);
    this.root.add(this.title);

    this.selector = new SelectorMenuItem(choices, {
      color: config.COLOR_WHITE,
      containerWidth: 340,
    });
    this.selector.origin.set(0.5, 0.5);
    this.selector.setCenterX(this.root.getSelfCenter().x);
    this.selector.position.setY(144);
    this.selector.changed.addListener(this.handleSelectorChanged);

    if (this.params.canSelectVariant) {
      this.selector.setValue(defaultVariantType);
      this.root.add(this.selector);
    }

    this.levelHint = new LevelInputHint(defaultVariantType);
    this.levelHint.position.setY(200);
    this.root.add(this.levelHint);

    const continueDisplayedCode = inputManager.getDisplayedControlCode(
      inputManager.getActiveVariantType(),
      LevelControlsInputContext.Continue[0],
    );
    const actionWord = this.params.canSelectVariant ? 'SELECT' : 'CONTINUE';
    this.continueHint = new SceneInputHint(
      `${continueDisplayedCode} TO ${actionWord}`,
    );
    this.root.add(this.continueHint);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { inputManager } = updateArgs;

    const inputVariant = inputManager.getActiveVariant();

    if (inputVariant.isDownAny(LevelControlsInputContext.Continue)) {
      this.finish();
      return;
    }

    super.update(updateArgs);

    // Usually it is handled by menu, but here we are using it outside menu
    if (this.params.canSelectVariant) {
      this.selector.updateFocused(updateArgs);
    }
  }

  private handleSelectorChanged = (
    choice: SelectorMenuItemChoice<InputVariantType>,
  ): void => {
    const selectedInputVariantType = choice.value;
    this.levelHint.setVariantType(selectedInputVariantType);
  };

  private finish(): void {
    if (this.params.canSelectVariant) {
      // Once player is done selecting, set his input variant
      const selectedInputVariantType = this.selector.getValue();

      const playerSession = this.session.getPlayer(this.params.playerIndex);
      playerSession.setInputVariantType(selectedInputVariantType);

      // If player is not alone - configure next player
      if (this.session.isMultiplayer() && this.params.playerIndex === 0) {
        const params: LevelControlsLocationParams = {
          canSelectVariant: true,
          mapConfig: this.params.mapConfig,
          playerIndex: 1,
        };
        this.navigator.replace(GameSceneType.LevelControls, params);
        return;
      }
    }

    // Map config is forwarded from level load scene
    const params: LevelPlayLocationParams = {
      mapConfig: this.params.mapConfig,
    };
    this.navigator.replace(GameSceneType.LevelPlay, params);
  }
}
