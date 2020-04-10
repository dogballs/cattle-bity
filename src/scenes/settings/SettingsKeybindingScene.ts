import { InputBinding, InputDevice, Scene } from '../../core';
import { GameUpdateArgs } from '../../game';
import {
  DividerMenuItem,
  InputButtonCaptureModal,
  Menu,
  SelectorMenuItem,
  SelectorMenuItemChoice,
  SpriteText,
  TextMenuItem,
} from '../../gameObjects';
import {
  InputButtonCodePresenter,
  InputControl,
  InputControlPresenter,
  InputManager,
  InputDeviceType,
} from '../../input';
import * as config from '../../config';

const DEVICE_SELECTOR_CHOICES: SelectorMenuItemChoice<InputDeviceType>[] = [
  { value: InputDeviceType.Keyboard, text: 'KEYBOARD' },
  { value: InputDeviceType.Gamepad, text: 'GAMEPAD' },
];

const CONFIGURABLE_INPUT_CONTROLS = [
  InputControl.Up,
  InputControl.Down,
  InputControl.Left,
  InputControl.Right,
  InputControl.PrimaryAction,
  InputControl.SecondaryAction,
  InputControl.Select,
];

enum State {
  Navigation,
  WaitingInput,
}

export class SettingsKeybindingScene extends Scene {
  private state = State.Navigation;
  private selectedDeviceType: InputDeviceType;
  private inputManager: InputManager;
  private selectedControl: InputControl = null;

  private title = new SpriteText('SETTINGS → KEY BINDINGS', {
    color: config.COLOR_YELLOW,
  });
  private modal: InputButtonCaptureModal;
  private deviceSelectorItem: SelectorMenuItem<InputDeviceType>;
  private topDividerItem: DividerMenuItem;
  private botDividerItem: DividerMenuItem;
  private bindingItems: TextMenuItem[];
  private resetItem: TextMenuItem;
  private backItem: TextMenuItem;
  private menu: Menu;

  protected setup(updateArgs: GameUpdateArgs): void {
    this.inputManager = updateArgs.inputManager;

    this.title.position.set(112, 96);
    this.root.add(this.title);

    this.deviceSelectorItem = new SelectorMenuItem(DEVICE_SELECTOR_CHOICES);
    this.deviceSelectorItem.changed.addListener(this.handleDeviceChanged);

    this.topDividerItem = new DividerMenuItem({ color: config.COLOR_GRAY });
    this.botDividerItem = new DividerMenuItem({ color: config.COLOR_GRAY });

    this.bindingItems = CONFIGURABLE_INPUT_CONTROLS.map((control) => {
      const item = new TextMenuItem('', { color: config.COLOR_WHITE });
      item.selected.addListener(() => {
        this.openModal(control);
      });
      return item;
    });

    this.resetItem = new TextMenuItem('RESET', { color: config.COLOR_WHITE });
    this.resetItem.selected.addListener(this.handleResetSelected);

    this.backItem = new TextMenuItem('BACK', { color: config.COLOR_WHITE });
    this.backItem.selected.addListener(this.handleBackSelected);

    const menuItems = [
      this.deviceSelectorItem,
      // this.topDividerItem,
      ...this.bindingItems,
      this.botDividerItem,
      this.resetItem,
      this.backItem,
    ];

    this.menu = new Menu();
    this.menu.setItems(menuItems);
    this.menu.position.set(16, 192);
    this.root.add(this.menu);

    this.modal = new InputButtonCaptureModal(
      this.root.size.width,
      this.root.size.height,
    );
    this.modal.visible = false;
    this.root.add(this.modal);

    if (DEVICE_SELECTOR_CHOICES.length > 0) {
      this.selectedDeviceType = DEVICE_SELECTOR_CHOICES[0].value;
      this.updateMenu();
    }
  }

  protected update(updateArgs: GameUpdateArgs): void {
    // Capture user input from currently selected device
    if (this.state === State.WaitingInput) {
      const device = this.getSelectedDevice();
      const codes = device.getDownCodes();

      if (codes.length > 0) {
        const code = codes[0];

        this.updateBinding(this.selectedControl, code);
        this.updateMenu();
        this.closeModal();
      }

      return;
    }

    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  private getSelectedBinding(): InputBinding {
    return this.inputManager.getBinding(this.selectedDeviceType);
  }
  private getSelectedDevice(): InputDevice {
    return this.inputManager.getDevice(this.selectedDeviceType);
  }

  private getSelectedPresenter(): InputButtonCodePresenter {
    return this.inputManager.getPresenter(this.selectedDeviceType);
  }

  private openModal(control: InputControl): void {
    this.selectedControl = control;
    this.state = State.WaitingInput;
    this.modal.visible = true;
  }

  private closeModal(): void {
    this.selectedControl = null;
    this.state = State.Navigation;
    this.modal.visible = false;
  }

  private updateMenu(): void {
    const binding = this.getSelectedBinding();
    const presenter = this.getSelectedPresenter();

    let maxDisplayedControlLength = 0;
    CONFIGURABLE_INPUT_CONTROLS.forEach((control) => {
      const displayedControl = InputControlPresenter.asString(control);
      if (displayedControl.length > maxDisplayedControlLength) {
        maxDisplayedControlLength = displayedControl.length;
      }
    });

    CONFIGURABLE_INPUT_CONTROLS.forEach((control, index) => {
      const item = this.bindingItems[index];

      const displayedControl = InputControlPresenter.asString(control).padEnd(
        maxDisplayedControlLength,
        ' ',
      );

      const code = binding.get(control);
      const displayedCode = presenter.asString(code);

      const text = `${displayedControl} - ${displayedCode}`;

      item.setText(text);
    });
  }

  private updateBinding(control: InputControl, newCode: number): void {
    const binding = this.getSelectedBinding();

    const currentCode = binding.get(control);

    // Check if same key is already taken by another control.
    // If so, we are going to swap values to avoid an issues of having
    // same keys for same controls
    const conflictControl = binding.getControl(newCode);
    if (conflictControl !== null) {
      binding.setCustom(conflictControl, currentCode);
    }

    binding.setCustom(control, newCode);

    this.inputManager.saveBinding(this.selectedDeviceType);
  }

  private handleDeviceChanged = (
    choice: SelectorMenuItemChoice<InputDeviceType>,
  ): void => {
    this.selectedDeviceType = choice.value;
    this.updateMenu();
  };

  private handleResetSelected = (): void => {
    const binding = this.getSelectedBinding();
    binding.resetAllToDefault();
    this.inputManager.saveBinding(this.selectedDeviceType);
    this.updateMenu();
  };

  private handleBackSelected = (): void => {
    this.navigator.back();
  };
}
