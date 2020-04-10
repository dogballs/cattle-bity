import { Scene } from '../../core';
import { GameUpdateArgs } from '../../game';
import { Menu, SpriteText, TextMenuItem } from '../../gameObjects';
import * as config from '../../config';

import { GameSceneType } from '../GameSceneType';

export class SettingsMenuScene extends Scene {
  private title: SpriteText;
  private keybindingItem: TextMenuItem;
  private audioItem: TextMenuItem;
  private backItem: TextMenuItem;
  private menu: Menu;

  protected setup(): void {
    this.title = new SpriteText('SETTINGS', { color: config.COLOR_YELLOW });
    this.title.position.set(112, 96);
    this.root.add(this.title);

    this.keybindingItem = new TextMenuItem('KEY BINDINGS');
    this.keybindingItem.selected.addListener(this.handleKeybindingSelected);

    this.audioItem = new TextMenuItem('AUDIO');
    this.audioItem.selected.addListener(this.handleAudioSelected);

    this.backItem = new TextMenuItem('BACK');
    this.backItem.selected.addListener(this.handleBackSelected);

    const menuItems = [this.keybindingItem, this.audioItem, this.backItem];

    this.menu = new Menu();
    this.menu.setItems(menuItems);
    this.menu.position.set(16, 192);
    this.root.add(this.menu);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  private handleKeybindingSelected = (): void => {
    this.navigator.push(GameSceneType.SettingsKeybinding);
  };

  private handleAudioSelected = (): void => {
    this.navigator.push(GameSceneType.SettingsAudio);
  };

  private handleBackSelected = (): void => {
    this.navigator.back();
  };
}
