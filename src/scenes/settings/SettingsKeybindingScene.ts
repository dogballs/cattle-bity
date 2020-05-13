import { InputBinding, InputDevice } from '../../core';
import { GameUpdateArgs } from '../../game';
import {
  DividerMenuItem,
  InputButtonCaptureModal,
  SceneMenu,
  SceneMenuTitle,
  SelectorMenuItem,
  SelectorMenuItemChoice,
  TextMenuItem,
} from '../../gameObjects';
import {
  InputBindingType,
  InputButtonCodePresenter,
  InputControl,
  InputControlPresenter,
  InputManager,
} from '../../input';
import * as config from '../../config';

import { GameScene } from '../GameScene';

const BINDING_SELECTOR_CHOICES: SelectorMenuItemChoice<InputBindingType>[] = [
  { value: InputBindingType.PrimaryKeyboard, text: 'KEYBOARD 1' },
  { value: InputBindingType.SecondaryKeyboard, text: 'KEYBOARD 2' },
  { value: InputBindingType.TertiaryKeyboard, text: 'KEYBOARD 3' },
  { value: InputBindingType.PrimaryGamepad, text: 'GAMEPAD 1' },
  { value: InputBindingType.SecondaryGamepad, text: 'GAMEPAD 2' },
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

export class SettingsKeybindingScene extends GameScene {
  private state = State.Navigation;
  private selectedBindingType: InputBindingType;
  private inputManager: InputManager;
  private selectedControl: InputControl = null;

  private title: SceneMenuTitle;
  private modal: InputButtonCaptureModal;
  private deviceSelectorItem: SelectorMenuItem<InputBindingType>;
  private topDividerItem: DividerMenuItem;
  private botDividerItem: DividerMenuItem;
  private bindingItems: TextMenuItem[];
  private resetItem: TextMenuItem;
  private backItem: TextMenuItem;
  private menu: SceneMenu;

  protected setup(updateArgs: GameUpdateArgs): void {
    this.inputManager = updateArgs.inputManager;

    this.title = new SceneMenuTitle('SETTINGS → KEY BINDINGS');
    this.title.position.set(112, 96);
    this.root.add(this.title);

    this.deviceSelectorItem = new SelectorMenuItem(BINDING_SELECTOR_CHOICES, {
      containerWidth: 340,
    });
    this.deviceSelectorItem.changed.addListener(this.handleDeviceChanged);

    this.topDividerItem = new DividerMenuItem({ color: config.COLOR_GRAY });
    this.botDividerItem = new DividerMenuItem({ color: config.COLOR_GRAY });

    this.bindingItems = CONFIGURABLE_INPUT_CONTROLS.map((control) => {
      const item = new TextMenuItem('', { color: config.COLOR_WHITE });
      item.selected.addListener(() => {
        this.handleBindingSelected(control);
      });
      return item;
    });

    this.resetItem = new TextMenuItem('RESET', { color: config.COLOR_WHITE });
    this.resetItem.selected.addListener(this.handleResetSelected);

    this.backItem = new TextMenuItem('BACK', { color: config.COLOR_WHITE });
    this.backItem.selected.addListener(this.handleBackSelected);

    const menuItems = [
      this.deviceSelectorItem,
      ...this.bindingItems,
      this.botDividerItem,
      this.resetItem,
      this.backItem,
    ];

    this.menu = new SceneMenu();
    this.menu.setItems(menuItems);
    this.root.add(this.menu);

    this.modal = new InputButtonCaptureModal(
      this.root.size.width,
      this.root.size.height,
    );
    this.modal.setVisible(false);
    this.root.add(this.modal);

    if (BINDING_SELECTOR_CHOICES.length > 0) {
      this.selectedBindingType = BINDING_SELECTOR_CHOICES[0].value;
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

    super.update(updateArgs);
  }

  private getSelectedBinding(): InputBinding {
    return this.inputManager.getBinding(this.selectedBindingType);
  }

  private getSelectedDevice(): InputDevice {
    return this.inputManager.getDevice(this.selectedBindingType.deviceType);
  }

  private getSelectedPresenter(): InputButtonCodePresenter {
    return this.inputManager.getPresenter(this.selectedBindingType.deviceType);
  }

  private openModal(control: InputControl): void {
    this.selectedControl = control;
    this.state = State.WaitingInput;
    this.modal.setVisible(true);
  }

  private closeModal(): void {
    this.selectedControl = null;
    this.state = State.Navigation;
    this.modal.setVisible(false);
    this.root.dirtyPaintBox();
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

    this.inputManager.saveBinding(this.selectedBindingType);
  }

  private handleBindingSelected = (control: number): void => {
    const activeDevice = this.inputManager.getActiveDevice();
    const selectedDevice = this.inputManager.getDevice(
      this.selectedBindingType.deviceType,
    );

    // In case user wants to rebind device which is not currently active,
    // don't allow user to do so, otherwise user will be stuck in the modal.
    // Here we realy that each device has unique instance in input manager.
    if (activeDevice !== selectedDevice) {
      return;
    }

    this.openModal(control);
  };

  private handleDeviceChanged = (
    choice: SelectorMenuItemChoice<InputBindingType>,
  ): void => {
    this.selectedBindingType = choice.value;
    this.updateMenu();
  };

  private handleResetSelected = (): void => {
    const binding = this.getSelectedBinding();
    binding.resetAllToDefault();
    this.inputManager.saveBinding(this.selectedBindingType);
    this.updateMenu();
  };

  private handleBackSelected = (): void => {
    this.navigator.back();
  };
}
