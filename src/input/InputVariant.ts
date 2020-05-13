import { InputBindingType } from './InputBindingType';

export class InputVariant {
  static instances: InputVariant[] = [];

  public bindingType: InputBindingType;
  public deviceIndex: number;

  constructor(bindingType: InputBindingType, deviceIndex: number) {
    this.bindingType = bindingType;
    this.deviceIndex = deviceIndex;

    // Avoid creating multiple instance with the same properties
    for (const instance of InputVariant.instances) {
      if (instance.equals(this)) {
        return instance;
      }
    }

    InputVariant.instances.push(this);
  }

  public equals(other: InputVariant): boolean {
    return (
      this.bindingType === other.bindingType &&
      this.deviceIndex === other.deviceIndex
    );
  }

  public static PrimaryKeyboard0 = new InputVariant(
    InputBindingType.PrimaryKeyboard,
    0,
  );
  public static SecondaryKeyboard0 = new InputVariant(
    InputBindingType.SecondaryKeyboard,
    0,
  );
  public static TertiaryKeyboard0 = new InputVariant(
    InputBindingType.TertiaryKeyboard,
    0,
  );
  public static PrimaryGamepad0 = new InputVariant(
    InputBindingType.PrimaryGamepad,
    0,
  );
  public static PrimaryGamepad1 = new InputVariant(
    InputBindingType.PrimaryGamepad,
    1,
  );
  public static SecondaryGamepad0 = new InputVariant(
    InputBindingType.SecondaryGamepad,
    0,
  );
  public static SecondaryGamepad1 = new InputVariant(
    InputBindingType.SecondaryGamepad,
    1,
  );
}
