import { SceneMenu, SceneMenuTitle, TextMenuItem } from '../../gameObjects';

import { GameScene } from '../GameScene';
import { GameSceneType } from '../GameSceneType';

export class ModesMenuScene extends GameScene {
  private title: SceneMenuTitle;
  private customItem: TextMenuItem;
  private backItem: TextMenuItem;
  private menu: SceneMenu;

  protected setup(): void {
    this.title = new SceneMenuTitle('MODES');
    this.root.add(this.title);

    this.customItem = new TextMenuItem('CUSTOM MAPS');
    this.customItem.selected.addListener(this.handleCustomSelected);

    this.backItem = new TextMenuItem('BACK');
    this.backItem.selected.addListener(this.handleBackSelected);

    const menuItems = [this.customItem, this.backItem];

    this.menu = new SceneMenu();
    this.menu.setItems(menuItems);
    this.root.add(this.menu);
  }

  private handleCustomSelected = (): void => {
    this.navigator.push(GameSceneType.ModesCustom);
  };

  private handleBackSelected = (): void => {
    this.navigator.back();
  };
}
