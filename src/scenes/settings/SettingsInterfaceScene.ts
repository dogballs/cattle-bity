import { Scene } from '../../core';
import { AudioManager, GameUpdateArgs } from '../../game';
import { SceneMenu, SceneMenuTitle, TextMenuItem } from '../../gameObjects';
import { InputHintSettings } from '../../input';

export class SettingsInterfaceScene extends Scene {
  private title: SceneMenuTitle;
  private levelControlsHintItem: TextMenuItem;
  private editorControlsHintItem: TextMenuItem;
  private backItem: TextMenuItem;
  private menu: SceneMenu;
  private audioManager: AudioManager;
  private inputHintSettings: InputHintSettings;

  protected setup({ audioManager, inputHintSettings }: GameUpdateArgs): void {
    this.audioManager = audioManager;
    this.inputHintSettings = inputHintSettings;

    this.title = new SceneMenuTitle('SETTINGS → INTERFACE');
    this.root.add(this.title);

    this.levelControlsHintItem = new TextMenuItem(
      this.getLevelControlsHintText(),
    );
    this.levelControlsHintItem.selected.addListener(
      this.handleLevelControlsHintSelected,
    );

    this.editorControlsHintItem = new TextMenuItem(
      this.getEditorControlsHintText(),
    );
    this.editorControlsHintItem.selected.addListener(
      this.handleEditorControlsHintSelected,
    );

    this.backItem = new TextMenuItem('BACK');
    this.backItem.selected.addListener(this.handleBackSelected);

    const menuItems = [
      this.levelControlsHintItem,
      this.editorControlsHintItem,
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

  private handleLevelControlsHintSelected = (): void => {
    const showLevelHint = this.inputHintSettings.getShowLevelHint();
    const nextShowLevelHint = !showLevelHint;

    this.inputHintSettings.setShowLevelHint(nextShowLevelHint);

    this.levelControlsHintItem.setText(this.getLevelControlsHintText());
  };

  private handleEditorControlsHintSelected = (): void => {
    const showEditorHint = this.inputHintSettings.getShowEditorHint();
    const nextShowEditorHint = !showEditorHint;

    this.inputHintSettings.setShowEditorHint(nextShowEditorHint);

    this.editorControlsHintItem.setText(this.getEditorControlsHintText());
  };

  private handleBackSelected = (): void => {
    this.navigator.back();
  };

  private getLevelControlsHintText(): string {
    const isEnabled = this.inputHintSettings.getShowLevelHint();

    let checkmark = ' ';
    if (isEnabled === null) {
      checkmark = '?';
    } else if (isEnabled) {
      checkmark = '+';
    }

    const text = `GAMEPLAY CONTROLS HINT [${checkmark}]`;

    return text;
  }

  private getEditorControlsHintText(): string {
    const isEnabled = this.inputHintSettings.getShowEditorHint();

    let checkmark = ' ';
    if (isEnabled === null) {
      checkmark = '?';
    } else if (isEnabled) {
      checkmark = '+';
    }

    const text = `CONSTRUCT. CONTROLS HINT [${checkmark}]`;

    return text;
  }
}
