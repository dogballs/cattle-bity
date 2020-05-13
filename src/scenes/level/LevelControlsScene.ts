import { GameObject, RectPainter } from '../../core';
import { GameUpdateArgs, Session } from '../../game';
import {
  LevelInputHint,
  SceneInputHint,
  SelectorMenuItem,
  SelectorMenuItemChoice,
  SpriteText,
} from '../../gameObjects';
import {
  InputDeviceType,
  InputVariant,
  LevelControlsInputContext,
} from '../../input';
import * as config from '../../config';

import { GameScene } from '../GameScene';
import { GameSceneType } from '../GameSceneType';

import { LevelControlsLocationParams, LevelPlayLocationParams } from './params';

export class LevelControlsScene extends GameScene<LevelControlsLocationParams> {
  private background: GameObject;
  private title: SpriteText;
  private selector: SelectorMenuItem<InputVariant>;
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

    // Keyboard is always available
    let variantChoices: SelectorMenuItemChoice<InputVariant>[] = [
      { value: InputVariant.PrimaryKeyboard0, text: 'KEYBOARD - BINDING 1' },
      {
        value: InputVariant.SecondaryKeyboard0,
        text: 'KEYBOARD - BINDING 2',
      },
      { value: InputVariant.TertiaryKeyboard0, text: 'KEYBOARD - BINDING 3' },
    ];

    const gamepadDevice0 = inputManager.getDevice(InputDeviceType.Gamepad, 0);
    if (gamepadDevice0.isConnected()) {
      variantChoices.push({
        value: InputVariant.PrimaryGamepad0,
        text: 'GAMEPAD 1 - BINDING 1',
      });
      variantChoices.push({
        value: InputVariant.SecondaryGamepad0,
        text: 'GAMEPAD 1 - BINDING 2',
      });
    }

    const gamepadDevice1 = inputManager.getDevice(InputDeviceType.Gamepad, 1);
    if (gamepadDevice1.isConnected()) {
      variantChoices.push({
        value: InputVariant.PrimaryGamepad1,
        text: 'GAMEPAD 2 - BINDING 1',
      });
      variantChoices.push({
        value: InputVariant.SecondaryGamepad1,
        text: 'GAMEPAD 2 - BINDING 2',
      });
    }

    // By default it is single-player and we pick active device and binding.
    let defaultVariant = new InputVariant(
      inputManager.getActiveBindingType(),
      0,
    );

    // If player can actually select from his options.
    // For multiplayer suggest primary player - keyboard #2, and for secondary
    // player - keyboard #3. Will be queried by player index.
    if (this.params.canSelectVariant) {
      if (this.session.isMultiplayer()) {
        if (this.params.playerIndex === 0) {
          defaultVariant = InputVariant.SecondaryKeyboard0;
        } else {
          defaultVariant = InputVariant.TertiaryKeyboard0;
        }
      } else {
        defaultVariant = InputVariant.PrimaryKeyboard0;
      }
    }

    // For secondary player - remove the item primary player has picked
    if (this.params.canSelectVariant && this.params.playerIndex === 1) {
      const primaryPlayerVariant = this.session.primaryPlayer.getInputVariant();

      variantChoices = variantChoices.filter((choice) => {
        const choiceVariant = choice.value;

        // If primary player has picked gamepad - remove all variants using
        // same gamepad device for secondary player
        const primaryDeviceType = primaryPlayerVariant.bindingType.deviceType;
        const choiceDeviceType = choiceVariant.bindingType.deviceType;
        const isSameGamepadDevice =
          primaryDeviceType === InputDeviceType.Gamepad &&
          choiceDeviceType === InputDeviceType.Gamepad &&
          primaryPlayerVariant.deviceIndex === choiceVariant.deviceIndex;
        if (isSameGamepadDevice) {
          return false;
        }

        const isSameVariant = choiceVariant === primaryPlayerVariant;
        if (isSameVariant) {
          return false;
        }

        return true;
      });

      // Adjust default value in case primary player has picked secondary's
      // player default variant type; pick the oppositing variant
      if (defaultVariant === primaryPlayerVariant) {
        defaultVariant = InputVariant.SecondaryKeyboard0;
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

    this.selector = new SelectorMenuItem(variantChoices, {
      color: config.COLOR_WHITE,
      containerWidth: 700,
    });
    this.selector.origin.set(0.5, 0.5);
    this.selector.setCenterX(this.root.getSelfCenter().x);
    this.selector.position.setY(144);
    this.selector.changed.addListener(this.handleSelectorChanged);

    if (this.params.canSelectVariant) {
      this.selector.setValue(defaultVariant);
      this.root.add(this.selector);
    }

    this.levelHint = new LevelInputHint(defaultVariant.bindingType);
    this.levelHint.position.setY(200);
    this.root.add(this.levelHint);

    const continueDisplayedCode = inputManager.getDisplayedControlCode(
      inputManager.getActiveBindingType(),
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

    const inputMethod = inputManager.getActiveMethod();

    if (inputMethod.isDownAny(LevelControlsInputContext.Continue)) {
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
    choice: SelectorMenuItemChoice<InputVariant>,
  ): void => {
    const selectedInputVariant = choice.value;
    this.levelHint.setBindingType(selectedInputVariant.bindingType);
  };

  private finish(): void {
    if (this.params.canSelectVariant) {
      // Once player is done selecting, set his input variant
      const selectedInputVariant = this.selector.getValue();

      const playerSession = this.session.getPlayer(this.params.playerIndex);
      playerSession.setInputVariant(selectedInputVariant);

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
