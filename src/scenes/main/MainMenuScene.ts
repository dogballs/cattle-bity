import { GameObject, Scene } from '../../core';
import { GameUpdateArgs, Session } from '../../game';
import { MainHeading, Menu, SpriteText, TextMenuItem } from '../../gameObjects';
import { MenuInputContext } from '../../input';
import * as config from '../../config';

import { GameSceneType } from '../GameSceneType';

const SLIDE_SPEED = 240;

enum State {
  Sliding,
  Ready,
}

export class MainMenuScene extends Scene {
  private group: GameObject;
  private heading: MainHeading;
  private primaryHighscore: SpriteText;
  private commonHighscore: SpriteText;
  private menu: Menu;
  private singlePlayerItem: TextMenuItem;
  private editorItem: TextMenuItem;
  private settingsItem: TextMenuItem;
  private state: State = State.Ready;
  private session: Session;

  protected setup({ session, storage }: GameUpdateArgs): void {
    this.session = session;

    // Load highscore from storage
    const highscore = Number(storage.get(config.STORAGE_KEY_HIGHSCORE)) || 0;
    this.session.setHighscore(highscore);

    this.group = new GameObject();
    this.group.size.copyFrom(this.root.size);

    this.primaryHighscore = new SpriteText(this.getPrimaryHighscoreText(), {
      color: config.COLOR_WHITE,
    });
    this.primaryHighscore.position.set(92, 64);
    this.group.add(this.primaryHighscore);

    this.commonHighscore = new SpriteText(this.getCommonHighscoreText(), {
      color: config.COLOR_WHITE,
    });
    this.commonHighscore.position.set(380, 64);
    this.group.add(this.commonHighscore);

    this.heading = new MainHeading();
    this.heading.origin.setX(0.5);
    this.heading.setCenter(this.root.getSelfCenter());
    this.heading.position.setY(160);
    this.group.add(this.heading);

    this.singlePlayerItem = new TextMenuItem('1 PLAYER');
    this.singlePlayerItem.selected.addListener(this.handleSinglePlayerSelected);

    this.editorItem = new TextMenuItem('CONSTRUCTION');
    this.editorItem.selected.addListener(this.handleEditorSelected);

    this.settingsItem = new TextMenuItem('SETTINGS');
    this.settingsItem.selected.addListener(this.handleSettingsSelected);

    const menuItems = [
      this.singlePlayerItem,
      this.editorItem,
      this.settingsItem,
    ];

    this.menu = new Menu();
    this.menu.setItems(menuItems);
    this.menu.setCenter(this.root.getSelfCenter());
    this.menu.position.setY(512);
    this.group.add(this.menu);

    if (!this.session.haveSeenIntro()) {
      this.state = State.Sliding;
      this.group.position.setY(this.root.size.height);
      this.menu.hideCursor();
    }

    this.root.add(this.group);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { deltaTime, input } = updateArgs;

    if (this.state === State.Sliding) {
      this.group.position.y -= SLIDE_SPEED * deltaTime;

      const hasReachedTop = this.group.position.y <= 0;
      const isSkipped = input.isDownAny(MenuInputContext.Skip);
      const isReady = hasReachedTop || isSkipped;

      if (isReady) {
        this.group.position.y = 0;
        this.state = State.Ready;
        this.menu.showCursor();
        this.session.setSeenIntro(true);
      } else {
        this.root.traverseDescedants((child) => {
          child.invokeUpdate(updateArgs);
        });
      }
      return;
    }

    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  private getPrimaryHighscoreText(): string {
    const points = this.session.getHighscore();

    const pointsNumberText = points > 0 ? points.toString() : '00';
    const pointsText = pointsNumberText.padStart(6, ' ');

    const text = `Ⅰ-${pointsText}`;

    return text;
  }

  private getCommonHighscoreText(): string {
    let points = this.session.getHighscore();
    if (points === 0) {
      points = config.DEFAULT_HIGHSCORE;
    }

    const pointsText = points.toString().padStart(6, ' ');

    const text = `HI-${pointsText}`;

    return text;
  }

  private handleSinglePlayerSelected = (): void => {
    this.navigator.replace(GameSceneType.LevelSelection);
  };

  private handleEditorSelected = (): void => {
    this.navigator.push(GameSceneType.EditorMenu);
  };

  private handleSettingsSelected = (): void => {
    this.navigator.push(GameSceneType.SettingsMenu);
  };
}
