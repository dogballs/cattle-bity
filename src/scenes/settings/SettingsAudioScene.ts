import { Scene } from '../../core';
import { AudioManager, GameUpdateArgs } from '../../game';
import { SceneMenu, SceneMenuTitle, TextMenuItem } from '../../gameObjects';

export class SettingsAudioScene extends Scene {
  private title: SceneMenuTitle;
  private muteItem: TextMenuItem;
  private backItem: TextMenuItem;
  private menu: SceneMenu;
  private audioManager: AudioManager;

  protected setup({ audioManager }: GameUpdateArgs): void {
    this.audioManager = audioManager;

    this.title = new SceneMenuTitle('SETTINGS → AUDIO');
    this.root.add(this.title);

    this.muteItem = new TextMenuItem(this.getMuteText());
    this.muteItem.selected.addListener(this.handleMuteSelected);

    this.backItem = new TextMenuItem('BACK');
    this.backItem.selected.addListener(this.handleBackSelected);

    const menuItems = [this.muteItem, this.backItem];

    this.menu = new SceneMenu();
    this.menu.setItems(menuItems);
    this.root.add(this.menu);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  private handleMuteSelected = (): void => {
    if (this.audioManager.isGlobalMuted()) {
      this.audioManager.globalUnmute();
    } else {
      this.audioManager.globalMute();
    }

    this.audioManager.saveSettings();

    this.muteItem.setText(this.getMuteText());
  };

  private handleBackSelected = (): void => {
    this.navigator.back();
  };

  private getMuteText(): string {
    const isMuted = this.audioManager.isGlobalMuted();
    const checkmark = isMuted ? '+' : ' ';
    const text = `MUTE [${checkmark}]`;

    return text;
  }
}
