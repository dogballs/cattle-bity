import {
  GamepadInputDevice,
  Input,
  InputBinding,
  InputDevice,
  KeyboardInputDevice,
  Storage,
} from '../core';
import * as config from '../config';

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
  private currentVariant: InputVariant = null;
  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;

    this.input = new Input();

    // Order by priority, first is default
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
      return null;
    }

    const { binding } = this.variants.get(type);

    return binding;
  }

  public getDevice(type: InputDeviceType): InputDevice {
    if (!this.variants.has(type)) {
      return null;
    }

    const { device } = this.variants.get(type);

    return device;
  }

  public getPresenter(type: InputDeviceType): InputButtonCodePresenter {
    if (!this.variants.has(type)) {
      return null;
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

  public unlisten(): void {
    this.variants.forEach((variant) => {
      const { device } = variant;

      device.unlisten();
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

  public loadAllBindings(): void {
    this.variants.forEach((variant, type) => {
      const { binding } = variant;

      const key = this.getBindingStorageKey(type);

      const json = this.storage.get(key);

      binding.fromJSON(json);
    });
  }

  public saveBinding(type: InputDeviceType): void {
    const binding = this.getBinding(type);

    const key = this.getBindingStorageKey(type);
    const json = binding.toJSON();

    this.storage.set(key, json);
    this.storage.save();
  }

  private getBindingStorageKey(type: InputDeviceType): string {
    return `${config.STORAGE_KEY_BINDINGS}_${type.toString()}`;
  }

  private activateVariant(variant: InputVariant): void {
    this.currentVariant = variant;

    this.input.setDevice(variant.device);
    this.input.setBinding(variant.binding);
  }
}
