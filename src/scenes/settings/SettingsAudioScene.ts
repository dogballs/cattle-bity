import { Scene } from '../../core';
import { AudioManager, GameUpdateArgs } from '../../game';
import { Menu, SpriteText, TextMenuItem } from '../../gameObjects';
import * as config from '../../config';

export class SettingsAudioScene extends Scene {
  private title: SpriteText;
  private muteItem: TextMenuItem;
  private backItem: TextMenuItem;
  private menu: Menu;
  private audioManager: AudioManager;

  protected setup({ audioManager }: GameUpdateArgs): void {
    this.audioManager = audioManager;

    this.title = new SpriteText('SETTINGS → AUDIO', {
      color: config.COLOR_YELLOW,
    });
    this.title.position.set(112, 96);
    this.root.add(this.title);

    this.muteItem = new TextMenuItem(this.getMuteText());
    this.muteItem.selected.addListener(this.handleMuteSelected);

    this.backItem = new TextMenuItem('BACK');
    this.backItem.selected.addListener(this.handleBackSelected);

    const menuItems = [this.muteItem, this.backItem];

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
