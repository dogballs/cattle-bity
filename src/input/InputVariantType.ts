import { InputDeviceType } from './InputDeviceType';

export class InputVariantType {
  public playerIndex: number;
  public deviceType: InputDeviceType;

  constructor(playerIndex: number, deviceType: InputDeviceType) {
    this.playerIndex = playerIndex;
    this.deviceType = deviceType;
  }

  public equals(other: InputVariantType): boolean {
    return (
      this.playerIndex === other.playerIndex &&
      this.deviceType === other.deviceType
    );
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
}
