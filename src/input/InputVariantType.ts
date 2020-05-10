import { InputDeviceType } from './InputDeviceType';

export class InputVariantType {
  public variantIndex: number;
  public deviceType: InputDeviceType;

  constructor(variantIndex: number, deviceType: InputDeviceType) {
    this.variantIndex = variantIndex;
    this.deviceType = deviceType;
  }

  public equals(other: InputVariantType): boolean {
    return (
      this.variantIndex === other.variantIndex &&
      this.deviceType === other.deviceType
    );
  }

  // It should be backwards-compatible because it will be used as a key
  // for storage.
  public serialize(): string {
    const variantIndexPart = this.serializeVariantIndex();
    const deviceTypePart = this.serializeDeviceType();

    const serialized = `${variantIndexPart}_${deviceTypePart}`;

    return serialized;
  }

  private serializeVariantIndex(): string {
    switch (this.variantIndex) {
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

  public static PrimaryKeyboard(): InputVariantType {
    return new InputVariantType(0, InputDeviceType.Keyboard);
  }
  public static PrimaryGamepad(): InputVariantType {
    return new InputVariantType(0, InputDeviceType.Gamepad);
  }
  public static SecondaryKeyboard(): InputVariantType {
    return new InputVariantType(1, InputDeviceType.Keyboard);
  }
  public static SecondaryGamepad(): InputVariantType {
    return new InputVariantType(1, InputDeviceType.Gamepad);
  }
  public static TertiaryKeyboard(): InputVariantType {
    return new InputVariantType(2, InputDeviceType.Keyboard);
  }
}
