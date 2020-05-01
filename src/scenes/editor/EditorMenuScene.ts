import { FileOpener, FileSaver } from '../../core';
import { GameUpdateArgs, Session } from '../../game';
import {
  AlertModal,
  ConfirmModal,
  DividerMenuItem,
  SceneMenu,
  SceneMenuTitle,
  TextMenuItem,
} from '../../gameObjects';
import { InputHintSettings } from '../../input';
import {
  MapConfig,
  MapFileReader,
  MapLoader,
  MemoryMapListReader,
} from '../../map';

import { GameScene } from '../GameScene';
import { GameSceneType } from '../GameSceneType';

import { EditorLoadState, EditorLocationParams } from './params';

enum MenuState {
  Navigation,
  Alert,
  Confrimation,
}

export class EditorMenuScene extends GameScene<EditorLocationParams> {
  private title: SceneMenuTitle;
  private menu: SceneMenu;
  private newItem: TextMenuItem;
  private loadItem: TextMenuItem;
  private saveItem: TextMenuItem;
  private playtestItem: TextMenuItem;
  private mapItem: TextMenuItem;
  private enemyItem: TextMenuItem;
  private exitItem: TextMenuItem;
  private alertModal: AlertModal;
  private confirmModal: ConfirmModal;
  private mapConfig: MapConfig = null;
  private menuState = MenuState.Navigation;
  private loadState = EditorLoadState.None;
  private session: Session;
  private inputHintSettings: InputHintSettings;
  private mapLoader: MapLoader;

  protected setup({
    inputHintSettings,
    mapLoader,
    session,
  }: GameUpdateArgs): void {
    this.inputHintSettings = inputHintSettings;
    this.session = session;
    this.mapLoader = mapLoader;

    // In case we are coming back from other editor scene
    if (this.params.mapConfig !== undefined) {
      this.mapConfig = this.params.mapConfig;
      this.loadState = this.params.loadState ?? EditorLoadState.Draft;
    }

    // If coming from playtest, go back to state which has map remembered
    if (this.session.isPlaytest() && this.mapConfig === null) {
      this.session.resetExceptIntro();
      this.mapLoader.restoreDefaultReader();
      this.navigator.back();
      return;
    }

    this.title = new SceneMenuTitle(this.getTitleText());
    this.root.add(this.title);

    this.newItem = new TextMenuItem('NEW');
    this.newItem.selected.addListener(this.handleRequestedConfirmation);

    this.loadItem = new TextMenuItem('LOAD');
    this.loadItem.selected.addListener(this.handleRequestedConfirmation);

    this.saveItem = new TextMenuItem('SAVE');
    this.saveItem.selected.addListener(this.handleSaveSelected);
    this.saveItem.setFocusable(false);

    this.playtestItem = new TextMenuItem('PLAYTEST');
    this.playtestItem.selected.addListener(this.handlePlaytestSelected);
    this.playtestItem.setFocusable(false);

    this.mapItem = new TextMenuItem('EDIT → MAP');
    this.mapItem.selected.addListener(this.handleMapSelected);
    this.mapItem.setFocusable(false);

    this.enemyItem = new TextMenuItem('EDIT → ENEMIES');
    this.enemyItem.selected.addListener(this.handleEnemySelected);
    this.enemyItem.setFocusable(false);

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
      this.playtestItem,
      new DividerMenuItem(),
      this.exitItem,
    ];

    this.menu = new SceneMenu();
    this.menu.setItems(menuItems);
    this.root.add(this.menu);

    this.updateMenu();

    this.alertModal = new AlertModal({
      containerWidth: 768,
      message: 'INVALID MAP CONFIG',
    });
    this.alertModal.size.copyFrom(this.root.size);
    this.alertModal.setVisible(false);
    this.alertModal.accepted.addListener(this.handleAlertAccepted);
    this.root.add(this.alertModal);

    this.confirmModal = new ConfirmModal({
      containerWidth: 768,
      message: 'CHANGES WILL BE LOST.\nARE YOU SURE?',
    });
    this.confirmModal.size.copyFrom(this.root.size);
    this.confirmModal.updateMatrix();
    this.confirmModal.setVisible(false);
    this.confirmModal.accepted.addListener(this.handleConfirmAccepted);
    this.confirmModal.declined.addListener(this.handleConfirmDeclined);
    this.root.add(this.confirmModal);
  }

  protected update(updateArgs: GameUpdateArgs): void {
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

    this.saveItem.setFocusable(this.isLoaded());
    this.mapItem.setFocusable(this.isLoaded());
    this.enemyItem.setFocusable(this.isLoaded());
    this.playtestItem.setFocusable(this.isLoaded());
  }

  private createLocationParams(): EditorLocationParams {
    return {
      mapConfig: this.mapConfig,
      loadState: this.loadState,
    };
  }

  private getTitleText(): string {
    const baseText = 'CONSTRUCTION';
    if (this.loadState === EditorLoadState.File) {
      return `${baseText} [FILE]`;
    }
    if (this.loadState === EditorLoadState.Draft) {
      return `${baseText} [DRAFT]`;
    }
    return baseText;
  }

  private isLoaded(): boolean {
    return this.loadState !== EditorLoadState.None;
  }

  private handleNewSelected = (): void => {
    this.mapConfig = new MapConfig();
    this.loadState = EditorLoadState.Draft;

    this.updateMenu();
  };

  private handleLoadSelected = (): void => {
    const fileOpener = new FileOpener();
    const mapFileReader = new MapFileReader();

    fileOpener.opened.addListener((files) => {
      const file = files[0];

      mapFileReader.read(file);
    });

    mapFileReader.loaded.addListener(this.handleFileLoaded);
    mapFileReader.error.addListener(this.handleFileLoadError);

    fileOpener.openDialog();
  };

  private handleFileLoaded = (mapConfig: MapConfig): void => {
    this.mapConfig = mapConfig;
    this.loadState = EditorLoadState.File;

    this.updateMenu();
  };

  private handleFileLoadError = (): void => {
    this.showAlert();
  };

  private handleSaveSelected = (): void => {
    const json = this.mapConfig.toJSON();
    const fileName = 'map.json';

    const fileSaver = new FileSaver();

    fileSaver.saveJSON(json, fileName);
  };

  private handlePlaytestSelected = (): void => {
    // Navigate to itself, but with remembered params. When coming back from
    // playtest we will end up here with remembered state.
    this.navigator.push(GameSceneType.EditorMenu, this.createLocationParams());

    const memoryMapListReader = new MemoryMapListReader([this.mapConfig]);
    this.mapLoader.setListReader(memoryMapListReader);

    this.session.setPlaytest();

    this.navigator.push(GameSceneType.LevelLoad);
  };

  private handleMapSelected = (): void => {
    if (this.inputHintSettings.shouldShowEditorHint()) {
      this.navigator.push(
        GameSceneType.EditorHint,
        this.createLocationParams(),
      );
    } else {
      this.navigator.push(GameSceneType.EditorMap, this.createLocationParams());
    }
  };

  private handleEnemySelected = (): void => {
    this.navigator.push(GameSceneType.EditorEnemy, this.createLocationParams());
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
    this.confirmModal.setVisible(true);
    this.menuState = MenuState.Confrimation;
  }

  private hideConfirmation(): void {
    if (this.menuState !== MenuState.Confrimation) {
      return;
    }

    this.confirmModal.resetSelection();
    this.confirmModal.setVisible(false);
    this.menuState = MenuState.Navigation;
    this.root.setNeedsPaint();
  }

  private handleConfirmAccepted = (): void => {
    if (this.newItem.isFocused) {
      this.handleNewSelected();
      this.hideConfirmation();
    }
    if (this.loadItem.isFocused) {
      this.handleLoadSelected();
      this.hideConfirmation();
    }
    if (this.exitItem.isFocused) {
      this.handleExitSelected();
    }
  };

  private handleConfirmDeclined = (): void => {
    this.hideConfirmation();
  };

  private showAlert(): void {
    this.alertModal.setVisible(true);
    this.menuState = MenuState.Alert;
  }

  private hideAlert(): void {
    this.alertModal.setVisible(false);
    this.menuState = MenuState.Navigation;
  }

  private handleAlertAccepted = (): void => {
    this.hideAlert();
  };
}
