import {
  GamepadInputDevice,
  InputBinding,
  InputDevice,
  InputVariant,
  KeyboardInputDevice,
} from '../core';
import { GameStorage } from '../game';
import * as config from '../config';

import {
  PrimaryGamepadInputBinding,
  PrimaryKeyboardInputBinding,
  SecondaryGamepadInputBinding,
  SecondaryKeyboardInputBinding,
  TertiaryKeyboardInputBinding,
} from './bindings';
import {
  GamepadButtonCodePresenter,
  KeyboardButtonCodePresenter,
} from './presenters';
import { InputButtonCodePresenter } from './InputButtonCodePresenter';
import { InputControl } from './InputControl';
import { InputDeviceType } from './InputDeviceType';
import { InputVariantType } from './InputVariantType';

export class InputManager {
  private variants = new Map<InputVariantType, InputVariant>();
  private devices = new Map<InputDeviceType, InputDevice>();
  private presenters = new Map<InputDeviceType, InputButtonCodePresenter>();
  private storage: GameStorage;
  // Active variant is always listening to input. Use it only for
  // single-player interactions. It might be helpful when user for example
  // was playing on keyboard and then started pressing buttons on gamepad -
  // in this case active variant will swiptch from keyboard to gamepad
  // seamlessly.
  // For multi-player you should query player-specific variants.
  private activeVariantType: InputVariantType = null;

  constructor(storage: GameStorage) {
    this.storage = storage;

    const keyboardInputDevice = new KeyboardInputDevice();
    const gamepadInputDevice = new GamepadInputDevice();

    this.devices.set(InputDeviceType.Keyboard, keyboardInputDevice);
    this.devices.set(InputDeviceType.Gamepad, gamepadInputDevice);

    // Three keyboards are used to cover single-player and multi-player
    // (2 players) so if user plays alone he could have one binding, but
    // when he plays with somebody, he could have another binding without a
    // need to reconfigure his "alone" binding, and the second player gets
    // the third binding. It does not relate to gamepads, because they are
    // separate devices with their own buttons, but keyboard is shared.
    const primaryKeyboardInputBinding = new PrimaryKeyboardInputBinding();
    const secondaryKeyboardInputBinding = new SecondaryKeyboardInputBinding();
    const tertiaryKeyboardInputBinding = new TertiaryKeyboardInputBinding();
    const primaryGamepadInputBinding = new PrimaryGamepadInputBinding();
    const secondaryGamepadInputBinding = new SecondaryGamepadInputBinding();

    // Order by priority, first is default
    this.variants.set(
      InputVariantType.PrimaryKeyboard(),
      new InputVariant(keyboardInputDevice, primaryKeyboardInputBinding),
    );
    this.variants.set(
      InputVariantType.SecondaryKeyboard(),
      new InputVariant(keyboardInputDevice, secondaryKeyboardInputBinding),
    );
    this.variants.set(
      InputVariantType.TertiaryKeyboard(),
      new InputVariant(keyboardInputDevice, tertiaryKeyboardInputBinding),
    );
    this.variants.set(
      InputVariantType.PrimaryGamepad(),
      new InputVariant(gamepadInputDevice, primaryGamepadInputBinding),
    );
    this.variants.set(
      InputVariantType.SecondaryGamepad(),
      new InputVariant(gamepadInputDevice, secondaryGamepadInputBinding),
    );

    this.presenters.set(
      InputDeviceType.Keyboard,
      new KeyboardButtonCodePresenter(),
    );
    this.presenters.set(
      InputDeviceType.Gamepad,
      new GamepadButtonCodePresenter(),
    );

    if (this.variants.size > 0) {
      const firstVariantType = Array.from(this.variants.keys())[0];
      this.activeVariantType = firstVariantType;
    }
  }

  public getVariant(variantTypeToFind: InputVariantType): InputVariant {
    let foundVariant = null;

    this.variants.forEach((variant, variantType) => {
      if (variantType.equals(variantTypeToFind)) {
        foundVariant = variant;
      }
    });

    return foundVariant;
  }

  public getBinding(variantType: InputVariantType): InputBinding {
    const variant = this.getVariant(variantType);
    if (!variant) {
      return null;
    }

    const binding = variant.getBinding();

    return binding;
  }

  public getDevice(variantType: InputVariantType): InputDevice {
    const variant = this.getVariant(variantType);
    if (!variant) {
      return null;
    }

    const device = variant.getDevice();

    return device;
  }

  public getPresenter(variantType: InputVariantType): InputButtonCodePresenter {
    const variant = this.getVariant(variantType);
    if (!variant) {
      return null;
    }

    const presenter = this.presenters.get(variantType.deviceType);

    return presenter;
  }

  public getActiveVariant(): InputVariant {
    return this.getVariant(this.activeVariantType);
  }

  public getActiveVariantType(): InputVariantType {
    return this.activeVariantType;
  }

  public getActiveBinding(): InputBinding {
    const binding = this.getActiveVariant().getBinding();
    return binding;
  }

  public getActivePresenter(): InputButtonCodePresenter {
    const variantType = this.activeVariantType;
    const presenter = this.presenters.get(variantType.deviceType);
    return presenter;
  }

  public listen(): void {
    this.variants.forEach((variant) => {
      variant.getDevice().listen();
    });
  }

  public unlisten(): void {
    this.variants.forEach((variant) => {
      variant.getDevice().unlisten();
    });
  }

  public update(): void {
    const activeDevice = this.getActiveVariant().getDevice();

    let newActiveDevice = null;

    this.devices.forEach((device) => {
      device.update();

      // Check each device if it has any events. If it does and it is not an
      // active device - activate a new one.
      const downCodes = device.getDownCodes();
      const hasActivity = downCodes.length > 0;

      const isSameDeviceActive = activeDevice === device;

      if (hasActivity && !isSameDeviceActive) {
        newActiveDevice = device;
      }
    });

    if (newActiveDevice !== null) {
      // Activate the first variant which has matching device
      this.variants.forEach((variant, variantType) => {
        if (variant.getDevice() === newActiveDevice) {
          this.activeVariantType = variantType;
          newActiveDevice = null;
          return;
        }
      });
    }
  }

  public loadAllBindings(): void {
    this.variants.forEach((variant, variantType) => {
      const binding = variant.getBinding();

      const key = this.getBindingStorageKey(variantType);
      const json = this.storage.get(key);

      binding.fromJSON(json);
    });
  }

  public saveVariantBinding(variantType: InputVariantType): void {
    const binding = this.getBinding(variantType);
    const key = this.getBindingStorageKey(variantType);
    const json = binding.toJSON();

    this.storage.set(key, json);
    this.storage.save();
  }

  public getDisplayedControlCode(
    variantType: InputVariantType,
    control: InputControl,
  ): string {
    const binding = this.getBinding(variantType);
    const presenter = this.getPresenter(variantType);

    const code = binding.get(control);
    const displayedCode = presenter.asString(code);

    return displayedCode;
  }

  private getBindingStorageKey(variantType: InputVariantType): string {
    const prefix = config.STORAGE_KEY_SETTINGS_INPUT_BINDINGS_PREFIX;

    const key = `${prefix}.${variantType.serialize()}`;

    return key;
  }
}
