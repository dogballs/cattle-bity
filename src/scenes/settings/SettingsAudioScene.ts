import { AudioManager, GameUpdateArgs } from '../../game';
import { SceneMenu, SceneMenuTitle, TextMenuItem } from '../../gameObjects';

import { GameScene } from '../GameScene';

export class SettingsAudioScene extends GameScene {
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

  private handleMuteSelected = (): void => {
    const isGlobalMuted = this.audioManager.isGlobalMuted();
    const nextIsGlobalMuted = !isGlobalMuted;

    this.audioManager.setGlobalMuted(nextIsGlobalMuted);
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
