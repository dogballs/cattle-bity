import { InputDeviceType } from './InputDeviceType';

export class InputBindingType {
  static instances: InputBindingType[] = [];

  public bindingIndex: number;
  public deviceType: InputDeviceType;

  constructor(bindingIndex: number, deviceType: InputDeviceType) {
    this.bindingIndex = bindingIndex;
    this.deviceType = deviceType;

    // Avoid creating multiple instance with the same properties
    for (const instance of InputBindingType.instances) {
      if (instance.equals(this)) {
        return instance;
      }
    }

    InputBindingType.instances.push(this);
  }

  public equals(other: InputBindingType): boolean {
    return (
      this.bindingIndex === other.bindingIndex &&
      this.deviceType === other.deviceType
    );
  }

  // It should be backwards-compatible because it will be used as a key
  // for storage.
  public serialize(): string {
    const bindingIndexPart = this.serializeBindingIndex();
    const deviceTypePart = this.serializeDeviceType();

    const serialized = `${bindingIndexPart}_${deviceTypePart}`;

    return serialized;
  }

  private serializeBindingIndex(): string {
    switch (this.bindingIndex) {
      case 0:
        return 'primary';
      case 1:
        return 'secondary';
      case 2:
        return 'tertiary';
    }
    return 'unknown';
  }

  private serializeDeviceType(): string {
    switch (this.deviceType) {
      case InputDeviceType.Keyboard:
        return '0';
      case InputDeviceType.Gamepad:
        return '1';
    }
    return '?';
  }

  public static PrimaryKeyboard = new InputBindingType(
    0,
    InputDeviceType.Keyboard,
  );

  public static PrimaryGamepad = new InputBindingType(
    0,
    InputDeviceType.Gamepad,
  );

  public static SecondaryKeyboard = new InputBindingType(
    1,
    InputDeviceType.Keyboard,
  );

  public static SecondaryGamepad = new InputBindingType(
    1,
    InputDeviceType.Gamepad,
  );

  public static TertiaryKeyboard = new InputBindingType(
    2,
    InputDeviceType.Keyboard,
  );
}
