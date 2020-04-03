import { Scene } from '../../core';
import { GameObjectUpdateArgs } from '../../game';
import { Menu, SpriteText, TextMenuItem } from '../../gameObjects';
import * as config from '../../config';

import { GameSceneType } from '../GameSceneType';

export class SettingsMenuScene extends Scene {
  private title: SpriteText;
  private keybindingItem: TextMenuItem;
  private backItem: TextMenuItem;
  private menu: Menu;

  protected setup(): void {
    this.title = new SpriteText('SETTINGS', { color: config.COLOR_YELLOW });
    this.title.position.set(112, 96);
    this.root.add(this.title);

    this.keybindingItem = new TextMenuItem('KEY BINDINGS');
    this.keybindingItem.selected.addListener(this.handleKeybindingSelected);

    this.backItem = new TextMenuItem('BACK');
    this.backItem.selected.addListener(this.handleBackSelected);

    const menuItems = [this.keybindingItem, this.backItem];

    this.menu = new Menu();
    this.menu.setItems(menuItems);
    this.menu.position.set(16, 192);
    this.root.add(this.menu);
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  private handleKeybindingSelected = (): void => {
    this.navigator.push(GameSceneType.SettingsKeybinding);
  };

  private handleBackSelected = (): void => {
    this.navigator.back();
  };
}
