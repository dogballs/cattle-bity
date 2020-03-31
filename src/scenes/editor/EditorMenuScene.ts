import { Scene } from '../../core';
import { GameObjectUpdateArgs } from '../../game';
import {
  DividerMenuItem,
  Menu,
  SpriteText,
  TextMenuItem,
} from '../../gameObjects';
import * as config from '../../config';

import { GameSceneType } from '../GameSceneType';

export class EditorMenuScene extends Scene {
  private title: SpriteText;
  private menu: Menu;

  protected setup(): void {
    this.title = new SpriteText('CONSTRUCTION', { color: config.COLOR_YELLOW });
    this.title.position.set(112, 96);
    this.root.add(this.title);

    const menuItems = [
      new TextMenuItem('RESUME', { color: config.COLOR_WHITE }),
      new TextMenuItem('NEXT → ENEMIES', { color: config.COLOR_WHITE }),
      new DividerMenuItem({ color: config.COLOR_GRAY }),
      new TextMenuItem('MAIN MENU', { color: config.COLOR_WHITE }),
    ];

    this.menu = new Menu();
    this.menu.setItems(menuItems);
    this.menu.position.set(16, 192);
    this.menu.selected.addListener(this.handleMenuSelected);
    this.root.add(this.menu);
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  private handleMenuSelected = (selectedIndex: number): void => {
    switch (selectedIndex) {
      case 0:
        this.navigator.back();
        break;
      case 3:
        this.navigator.replace(GameSceneType.MenuMain);
        break;
    }
  };
}
