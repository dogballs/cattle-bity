import { GameObjectUpdateArgs } from '../game';
import {
  Menu,
  SelectorMenuItem,
  SpriteText,
  TextMenuItem,
} from '../gameObjects';
import * as config from '../config';

import { Scene } from './Scene';
import { SceneType } from './SceneType';

const DEVICE_ITEMS = ['KEYBOARD', 'GAMEPAD'];

export class KeybindingMenuScene extends Scene {
  private title = new SpriteText('SETTINGS → KEY BINDINGS', {
    color: config.COLOR_YELLOW,
  });
  private menu = new Menu();

  protected setup(): void {
    this.title.origin.setX(0.5);
    this.title.setCenter(this.root.getSelfCenter());
    this.title.position.setY(160);
    this.root.add(this.title);

    const menuItems = [
      new SelectorMenuItem(DEVICE_ITEMS),
      new TextMenuItem('BACK', { color: config.COLOR_WHITE }),
    ];

    this.menu.setItems(menuItems);
    this.menu.setCenter(this.root.getSelfCenter());
    this.menu.position.setY(256);
    this.menu.selected.addListener(this.handleMenuSelected);

    this.root.add(this.menu);
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  private handleMenuSelected = (selectedIndex): void => {
    switch (selectedIndex) {
      case 1:
        this.transition(SceneType.SettingsMenu);
        break;
    }
  };
}
