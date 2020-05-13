import {
  GamepadInputDevice,
  InputBinding,
  InputDevice,
  InputMethod,
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
import { InputBindingType } from './InputBindingType';
import { InputButtonCodePresenter } from './InputButtonCodePresenter';
import { InputControl } from './InputControl';
import { InputDeviceType } from './InputDeviceType';
import { InputVariant } from './InputVariant';

export class InputManager {
  private deviceMap = new Map<InputDeviceType, InputDevice[]>();
  private bindings = new Map<InputBindingType, InputBinding>();
  private presenters = new Map<InputDeviceType, InputButtonCodePresenter>();
  private storage: GameStorage;
  // Active device is always the one last interacted with. Use it only for
  // single-player interactions. It might be helpful when user for example
  // was playing on keyboard and then started pressing buttons on gamepad -
  // in this case active device will switch from keyboard to gamepad
  // seamlessly.
  // For multi-player you should query player-specific devices.
  private activeDeviceType: InputDeviceType = null;

  constructor(storage: GameStorage) {
    this.storage = storage;

    // Order by priority, first is default.
    // Assume that keyboard is only one, and that there might be multiple
    // gamepads.
    this.deviceMap.set(InputDeviceType.Keyboard, [new KeyboardInputDevice()]);
    this.deviceMap.set(InputDeviceType.Gamepad, [
      new GamepadInputDevice(0),
      new GamepadInputDevice(1),
    ]);

    if (this.deviceMap.size > 0) {
      this.activeDeviceType = Array.from(this.deviceMap.keys())[0];
    }

    // Three keyboards are used to cover single-player and multi-player
    // (2 players) so if user plays alone he could have one binding, but
    // when he plays with somebody, he could have another binding without a
    // need to reconfigure his "alone" binding, and the second player gets
    // the third binding. It does not relate to gamepads, because they are
    // separate devices with their own buttons, but keyboard is shared.

    // Order by priority, first is default
    this.bindings.set(
      InputBindingType.PrimaryKeyboard,
      new PrimaryKeyboardInputBinding(),
    );
    this.bindings.set(
      InputBindingType.SecondaryKeyboard,
      new SecondaryKeyboardInputBinding(),
    );
    this.bindings.set(
      InputBindingType.TertiaryKeyboard,
      new TertiaryKeyboardInputBinding(),
    );
    this.bindings.set(
      InputBindingType.PrimaryGamepad,
      new PrimaryGamepadInputBinding(),
    );
    this.bindings.set(
      InputBindingType.SecondaryGamepad,
      new SecondaryGamepadInputBinding(),
    );

    this.presenters.set(
      InputDeviceType.Keyboard,
      new KeyboardButtonCodePresenter(),
    );
    this.presenters.set(
      InputDeviceType.Gamepad,
      new GamepadButtonCodePresenter(),
    );
  }

  public getBinding(bindingType: InputBindingType): InputBinding {
    if (!this.bindings.has(bindingType)) {
      throw new Error(`Binding "${bindingType.serialize()}" not registered`);
    }

    const binding = this.bindings.get(bindingType);

    return binding;
  }

  public getDevice(deviceType: InputDeviceType, deviceIndex = 0): InputDevice {
    if (!this.deviceMap.has(deviceType)) {
      throw new Error(`Device type "${deviceType}" not registered`);
    }

    const devices = this.deviceMap.get(deviceType);

    const device = devices[deviceIndex];

    if (device === undefined) {
      throw new Error(
        `Device "${deviceType}" index "${deviceIndex}" not registered`,
      );
    }

    return device;
  }

  public getPresenter(deviceType: InputDeviceType): InputButtonCodePresenter {
    const presenter = this.presenters.get(deviceType);

    return presenter;
  }

  public getMethodByVariant(variant: InputVariant): InputMethod {
    const device = this.getDevice(
      variant.bindingType.deviceType,
      variant.deviceIndex,
    );
    const binding = this.getBinding(variant.bindingType);

    // TODO: reuse class
    const method = new InputMethod(device, binding);

    return method;
  }

  public getActiveMethod(): InputMethod {
    const activeDevice = this.getActiveDevice();
    const activeBinding = this.getActiveBinding();

    // TODO: reuse class
    const method = new InputMethod(activeDevice, activeBinding);

    return method;
  }

  public getActiveDevice(): InputDevice {
    return this.getDevice(this.activeDeviceType);
  }

  // Find first binding that suits active device
  public getActiveBinding(): InputBinding {
    let foundBinding = null;

    this.bindings.forEach((binding, bindingType) => {
      // Null check tells if binding was already selected in prev iterations
      if (
        foundBinding === null &&
        bindingType.deviceType === this.activeDeviceType
      ) {
        foundBinding = binding;
      }
    });

    if (foundBinding === null) {
      throw new Error(
        `No binding registered for active device "${this.activeDeviceType}"`,
      );
    }

    return foundBinding;
  }

  // Find first binding type that suits active device
  public getActiveBindingType(): InputBindingType {
    let foundBindingType = null;

    this.bindings.forEach((binding, bindingType) => {
      // Null check tells if binding was already selected in prev iterations
      if (
        foundBindingType === null &&
        bindingType.deviceType === this.activeDeviceType
      ) {
        foundBindingType = bindingType;
      }
    });

    if (foundBindingType === null) {
      throw new Error(
        `No binding registered for active device "${this.activeDeviceType}"`,
      );
    }

    return foundBindingType;
  }

  public listen(): void {
    this.deviceMap.forEach((devices) => {
      for (const device of devices) {
        device.listen();
      }
    });
  }

  public unlisten(): void {
    this.deviceMap.forEach((devices) => {
      for (const device of devices) {
        device.unlisten();
      }
    });
  }

  public update(): void {
    const activeDevice = this.getActiveDevice();

    this.deviceMap.forEach((devices, deviceType) => {
      for (const device of devices) {
        device.update();

        // Check each device if it has any events. If it does and it is not an
        // active device - activate a new one.
        const downCodes = device.getDownCodes();
        const hasActivity = downCodes.length > 0;

        const isSameDeviceActive = activeDevice === device;

        if (hasActivity && !isSameDeviceActive) {
          this.activeDeviceType = deviceType;
        }
      }
    });
  }

  public loadAllBindings(): void {
    this.bindings.forEach((binding, bindingType) => {
      const key = this.getBindingStorageKey(bindingType);
      const json = this.storage.get(key);

      binding.fromJSON(json);
    });
  }

  public saveBinding(bindingType: InputBindingType): void {
    const binding = this.getBinding(bindingType);
    const key = this.getBindingStorageKey(bindingType);
    const json = binding.toJSON();

    this.storage.set(key, json);
    this.storage.save();
  }

  public getDisplayedControlCode(
    bindingType: InputBindingType,
    control: InputControl,
  ): string {
    const binding = this.getBinding(bindingType);
    const presenter = this.getPresenter(bindingType.deviceType);

    const code = binding.get(control);
    const displayedCode = presenter.asString(code);

    return displayedCode;
  }

  private getBindingStorageKey(bindingType: InputBindingType): string {
    const prefix = config.STORAGE_KEY_SETTINGS_INPUT_BINDINGS_PREFIX;

    const key = `${prefix}.${bindingType.serialize()}`;

    return key;
  }
}
