import { Scene } from '../../core';
import { GameUpdateArgs } from '../../game';
import { SceneMenu, SceneMenuTitle, TextMenuItem } from '../../gameObjects';

import { GameSceneType } from '../GameSceneType';

export class SettingsMenuScene extends Scene {
  private title: SceneMenuTitle;
  private keybindingItem: TextMenuItem;
  private audioItem: TextMenuItem;
  private interfaceItem: TextMenuItem;
  private backItem: TextMenuItem;
  private menu: SceneMenu;

  protected setup(): void {
    this.title = new SceneMenuTitle('SETTINGS');
    this.root.add(this.title);

    this.keybindingItem = new TextMenuItem('KEY BINDINGS');
    this.keybindingItem.selected.addListener(this.handleKeybindingSelected);

    this.audioItem = new TextMenuItem('AUDIO');
    this.audioItem.selected.addListener(this.handleAudioSelected);

    this.interfaceItem = new TextMenuItem('INTERFACE');
    this.interfaceItem.selected.addListener(this.handleInterfaceSelected);

    this.backItem = new TextMenuItem('BACK');
    this.backItem.selected.addListener(this.handleBackSelected);

    const menuItems = [
      this.keybindingItem,
      this.audioItem,
      this.interfaceItem,
      this.backItem,
    ];

    this.menu = new SceneMenu();
    this.menu.setItems(menuItems);
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

  private handleInterfaceSelected = (): void => {
    this.navigator.push(GameSceneType.SettingsInterface);
  };

  private handleBackSelected = (): void => {
    this.navigator.back();
  };
}
