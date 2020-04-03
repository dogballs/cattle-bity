import { Scene } from '../../core';
import { GameObjectUpdateArgs } from '../../game';
import {
  AlertModal,
  ConfirmModal,
  DividerMenuItem,
  Menu,
  SpriteText,
  TextMenuItem,
} from '../../gameObjects';
import { MapConfig, MapFileLoader, MapFileSaver } from '../../map';
import * as config from '../../config';

import { GameSceneType } from '../GameSceneType';

enum MenuState {
  Navigation,
  Alert,
  Confrimation,
}

enum LoadState {
  None,
  Draft,
  File,
}

export class EditorMenuScene extends Scene {
  private title: SpriteText;
  private menu: Menu;
  private newItem: TextMenuItem;
  private loadItem: TextMenuItem;
  private saveItem: TextMenuItem;
  private mapItem: TextMenuItem;
  private enemyItem: TextMenuItem;
  private exitItem: TextMenuItem;
  private alertModal: AlertModal;
  private confirmModal: ConfirmModal;
  private mapConfig: MapConfig = null;
  private mapFileSaver: MapFileSaver;
  private mapFileLoader: MapFileLoader;
  private menuState = MenuState.Navigation;
  private loadState = LoadState.None;

  protected setup(): void {
    this.mapFileSaver = new MapFileSaver();

    this.mapFileLoader = new MapFileLoader();
    this.mapFileLoader.loaded.addListener(this.handleFileLoaded);
    this.mapFileLoader.error.addListener(this.handleFileLoadError);

    this.title = new SpriteText(this.getTitleText(), {
      color: config.COLOR_YELLOW,
    });
    this.title.position.set(112, 96);
    this.root.add(this.title);

    this.newItem = new TextMenuItem('NEW');
    this.newItem.selected.addListener(this.handleRequestedConfirmation);

    this.loadItem = new TextMenuItem('LOAD');
    this.loadItem.selected.addListener(this.handleRequestedConfirmation);

    this.saveItem = new TextMenuItem('SAVE');
    this.saveItem.selected.addListener(this.handleSaveSelected);
    this.saveItem.focusable = false;

    this.mapItem = new TextMenuItem('EDIT → MAP');
    this.mapItem.selected.addListener(this.handleMapSelected);
    this.mapItem.focusable = false;

    this.enemyItem = new TextMenuItem('EDIT → ENEMIES');
    this.enemyItem.selected.addListener(this.handleEnemySelected);
    this.enemyItem.focusable = false;

    this.exitItem = new TextMenuItem('MAIN MENU');
    this.exitItem.selected.addListener(this.handleRequestedConfirmation);

    const menuItems = [
      this.newItem,
      this.loadItem,
      this.saveItem,
      new DividerMenuItem(),
      this.mapItem,
      this.enemyItem,
      new DividerMenuItem(),
      this.exitItem,
    ];

    this.menu = new Menu();
    this.menu.setItems(menuItems);
    this.menu.position.set(16, 192);
    this.root.add(this.menu);

    this.alertModal = new AlertModal({
      containerWidth: 768,
      message: 'INVALID MAP CONFIG',
    });
    this.alertModal.size.copyFrom(this.root.size);
    this.alertModal.visible = false;
    this.alertModal.accepted.addListener(this.handleAlertAccepted);
    this.root.add(this.alertModal);

    this.confirmModal = new ConfirmModal({
      containerWidth: 768,
      message: 'CHANGES WILL BE LOST.\nARE YOU SURE?',
    });
    this.confirmModal.size.copyFrom(this.root.size);
    this.confirmModal.visible = false;
    this.confirmModal.accepted.addListener(this.handleConfirmAccepted);
    this.confirmModal.declined.addListener(this.handleConfirmDeclined);
    this.root.add(this.confirmModal);
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    if (this.menuState === MenuState.Alert) {
      this.alertModal.traverse((node) => {
        node.invokeUpdate(updateArgs);
      });
      return;
    }

    if (this.menuState === MenuState.Confrimation) {
      this.confirmModal.traverse((node) => {
        node.invokeUpdate(updateArgs);
      });
      return;
    }

    this.root.traverseDescedants((child) => {
      if (child === this.alertModal || child.hasParent(this.alertModal)) {
        return;
      }
      if (child === this.confirmModal || child.hasParent(this.confirmModal)) {
        return;
      }

      child.invokeUpdate(updateArgs);
    });
  }

  private updateMenu(): void {
    this.title.setText(this.getTitleText());

    this.saveItem.focusable = this.isLoaded();
    this.mapItem.focusable = this.isLoaded();
    this.enemyItem.focusable = this.isLoaded();
  }

  private getTitleText(): string {
    const baseText = 'CONSTRUCTION';
    if (this.loadState === LoadState.File) {
      return `${baseText} [FILE]`;
    }
    if (this.loadState === LoadState.Draft) {
      return `${baseText} [DRAFT]`;
    }
    return baseText;
  }

  private isLoaded(): boolean {
    return this.loadState !== LoadState.None;
  }

  private handleFileLoaded = (mapConfig: MapConfig): void => {
    this.mapConfig = mapConfig;
    this.loadState = LoadState.File;

    this.updateMenu();
  };

  private handleFileLoadError = (): void => {
    this.showAlert();
  };

  private handleNewSelected = (): void => {
    this.mapConfig = new MapConfig();
    this.loadState = LoadState.Draft;

    this.updateMenu();
  };

  private handleLoadSelected = (): void => {
    this.mapFileLoader.loadFromFile();
  };

  private handleSaveSelected = (): void => {
    this.mapFileSaver.saveToFile(this.mapConfig);
  };

  private handleMapSelected = (): void => {
    this.navigator.push(GameSceneType.EditorMap);
  };

  private handleEnemySelected = (): void => {
    this.navigator.push(GameSceneType.EditorEnemy);
  };

  private handleExitSelected = (): void => {
    this.navigator.clearAndPush(GameSceneType.MainMenu);
  };

  private handleRequestedConfirmation = (): void => {
    if (this.isLoaded()) {
      this.showConfirmation();
    } else {
      this.handleConfirmAccepted();
    }
  };

  private showConfirmation(): void {
    this.confirmModal.visible = true;
    this.menuState = MenuState.Confrimation;
  }

  private hideConfirmation(): void {
    if (this.menuState !== MenuState.Confrimation) {
      return;
    }

    this.confirmModal.resetSelection();
    this.confirmModal.visible = false;
    this.menuState = MenuState.Navigation;
  }

  private handleConfirmAccepted = (): void => {
    if (this.newItem.isFocused) {
      this.handleNewSelected();
    }
    if (this.loadItem.isFocused) {
      this.handleLoadSelected();
    }
    if (this.exitItem.isFocused) {
      this.handleExitSelected();
    }

    this.hideConfirmation();
  };

  private handleConfirmDeclined = (): void => {
    this.hideConfirmation();
  };

  private showAlert(): void {
    this.alertModal.visible = true;
    this.menuState = MenuState.Alert;
  }

  private hideAlert(): void {
    this.alertModal.visible = false;
    this.menuState = MenuState.Navigation;
  }

  private handleAlertAccepted = (): void => {
    this.hideAlert();
  };
}
