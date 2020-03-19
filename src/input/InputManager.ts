import {
  GamepadInputDevice,
  Input,
  InputBinding,
  InputDevice,
  KeyboardInputDevice,
} from '../core';
import { GamepadInputBinding, KeyboardInputBinding } from './bindings';

interface InputVariant {
  binding: InputBinding;
  device: InputDevice;
}

export class InputManager {
  private input: Input;

  // Order by priority, first is default
  private variants: InputVariant[] = [
    { binding: KeyboardInputBinding, device: new KeyboardInputDevice() },
    { binding: GamepadInputBinding, device: new GamepadInputDevice() },
  ];

  private currentVariant: InputVariant = null;

  constructor() {
    this.input = new Input();

    if (this.variants.length > 0) {
      this.activateVariant(this.variants[0]);
    }
  }

  public getInput(): Input {
    return this.input;
  }

  public listen(): void {
    for (const variant of this.variants) {
      const { device } = variant;

      device.listen();
    }
  }

  public update(): void {
    for (const variant of this.variants) {
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
    }
  }

  private activateVariant(variant: InputVariant): void {
    this.currentVariant = variant;

    this.input.setDevice(variant.device);
    this.input.setBinding(variant.binding);
  }
}
