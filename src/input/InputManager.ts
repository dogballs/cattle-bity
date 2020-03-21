import {
  GamepadInputDevice,
  Input,
  InputBinding,
  InputDevice,
  KeyboardInputDevice,
} from '../core';
import { GamepadInputBinding, KeyboardInputBinding } from './bindings';
import {
  GamepadButtonCodePresenter,
  KeyboardButtonCodePresenter,
} from './presenters';

import { InputButtonCodePresenter } from './InputButtonCodePresenter';
import { InputDeviceType } from './InputDeviceType';

interface InputVariant {
  binding: InputBinding;
  device: InputDevice;
  presenter: InputButtonCodePresenter;
}

export class InputManager {
  private input: Input;

  private variants = new Map<InputDeviceType, InputVariant>();

  // Order by priority, first is default
  // private variants: InputVariant[] = [
  //   { binding: new KeyboardInputBinding(), device: new KeyboardInputDevice() },
  //   { binding: new GamepadInputBinding(), device: new GamepadInputDevice() },
  // ];

  private currentVariant: InputVariant = null;

  constructor() {
    this.input = new Input();

    this.variants.set(InputDeviceType.Keyboard, {
      binding: new KeyboardInputBinding(),
      device: new KeyboardInputDevice(),
      presenter: new KeyboardButtonCodePresenter(),
    });
    this.variants.set(InputDeviceType.Gamepad, {
      binding: new GamepadInputBinding(),
      device: new GamepadInputDevice(),
      presenter: new GamepadButtonCodePresenter(),
    });

    if (this.variants.size > 0) {
      this.activateVariant(this.variants.values().next().value);
    }
  }

  public getBinding(type: InputDeviceType): InputBinding {
    if (!this.variants.has(type)) {
      return undefined;
    }

    const { binding } = this.variants.get(type);

    return binding;
  }

  public getDevice(type: InputDeviceType): InputDevice {
    if (!this.variants.has(type)) {
      return undefined;
    }

    const { device } = this.variants.get(type);

    return device;
  }

  public getPresenter(type: InputDeviceType): InputButtonCodePresenter {
    if (!this.variants.has(type)) {
      return undefined;
    }

    const { presenter } = this.variants.get(type);

    return presenter;
  }

  public getInput(): Input {
    return this.input;
  }

  public listen(): void {
    this.variants.forEach((variant) => {
      const { device } = variant;

      device.listen();
    });
  }

  public update(): void {
    this.variants.forEach((variant) => {
      const { device } = variant;

      // Check each device if it has any events. If it does and it is not a
      // current variant - activate a new one.
      device.update();

      const downCodes = device.getDownCodes();
      const hasActivity = downCodes.length > 0;
      const isCurrentVariant = variant === this.currentVariant;

      if (hasActivity && !isCurrentVariant) {
        this.activateVariant(variant);
        return;
      }
    });
  }

  private activateVariant(variant: InputVariant): void {
    this.currentVariant = variant;

    this.input.setDevice(variant.device);
    this.input.setBinding(variant.binding);
  }
}
