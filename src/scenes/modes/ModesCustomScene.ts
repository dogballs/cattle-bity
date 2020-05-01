import { FileOpener } from '../../core';
import { GameUpdateArgs } from '../../game';
import {
  DividerMenuItem,
  MenuDescription,
  SceneMenu,
  SceneMenuTitle,
  TextMenuItem,
} from '../../gameObjects';
import { FileMapListReader, MapLoader } from '../../map';

import { GameScene } from '../GameScene';
import { GameSceneType } from '../GameSceneType';

export class ModesCustomScene extends GameScene {
  private title: SceneMenuTitle;
  private description: MenuDescription;
  private loadItem: TextMenuItem;
  private playItem: TextMenuItem;
  private backItem: TextMenuItem;
  private menu: SceneMenu;
  private mapLoader: MapLoader;
  private fileMapListReader: FileMapListReader = null;

  protected setup({ mapLoader }: GameUpdateArgs): void {
    this.mapLoader = mapLoader;

    this.title = new SceneMenuTitle('MODES → CUSTOM MAPS');
    this.root.add(this.title);

    this.description = new MenuDescription(
      'LOAD YOUR OWN LIST OF MAPS \nFROM CONSTRUCTION JSON FILES',
    );
    this.description.position.set(16, 180);
    this.root.add(this.description);

    this.loadItem = new TextMenuItem('LOAD');
    this.loadItem.selected.addListener(this.handleLoadSelected);

    this.playItem = new TextMenuItem('PLAY');
    this.playItem.selected.addListener(this.handlePlaySelected);
    this.playItem.setFocusable(false);

    this.backItem = new TextMenuItem('BACK');
    this.backItem.selected.addListener(this.handleBackSelected);

    const divider = new DividerMenuItem();

    const menuItems = [this.loadItem, this.playItem, divider, this.backItem];

    this.menu = new SceneMenu();
    this.menu.position.addY(164);
    this.menu.setItems(menuItems);
    this.root.add(this.menu);
  }

  private updateMenu(): void {
    this.playItem.setFocusable(this.canPlay());
  }

  private canPlay(): boolean {
    return this.fileMapListReader !== null;
  }

  private handleLoadSelected = (): void => {
    const fileOpener = new FileOpener();
    fileOpener.opened.addListener((files) => {
      this.fileMapListReader = new FileMapListReader(files);
      this.updateMenu();
    });
    fileOpener.openDialog();
  };

  private handlePlaySelected = (): void => {
    this.mapLoader.setListReader(this.fileMapListReader);
    this.navigator.replace(GameSceneType.LevelSelection);
  };

  private handleBackSelected = (): void => {
    this.mapLoader.restoreDefaultReader();
    this.navigator.back();
  };
}
