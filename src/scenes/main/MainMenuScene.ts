import { GameObject } from '../../core';
import { GameUpdateArgs, Session } from '../../game';
import { MainHeading, Menu, SpriteText, TextMenuItem } from '../../gameObjects';
import { MenuInputContext } from '../../input';
import { PointsHighscoreManager } from '../../points';
import * as config from '../../config';

import { GameScene } from '../GameScene';
import { GameSceneType } from '../GameSceneType';

const SLIDE_SPEED = 240;

enum State {
  Sliding,
  Ready,
}

export class MainMenuScene extends GameScene {
  private group: GameObject;
  private heading: MainHeading;
  private primaryPoints: SpriteText;
  private commonHighscore: SpriteText;
  private menu: Menu;
  private singlePlayerItem: TextMenuItem;
  private modesItem: TextMenuItem;
  private editorItem: TextMenuItem;
  private settingsItem: TextMenuItem;
  private aboutItem: TextMenuItem;
  private state: State = State.Ready;
  private session: Session;
  private pointsHighscoreManager: PointsHighscoreManager;

  protected setup({
    mapLoader,
    pointsHighscoreManager,
    session,
  }: GameUpdateArgs): void {
    this.session = session;
    this.pointsHighscoreManager = pointsHighscoreManager;

    // Restore source for maps to default
    mapLoader.restoreDefaultReader();

    this.group = new GameObject();
    this.group.size.copyFrom(this.root.size);

    this.primaryPoints = new SpriteText(this.getPrimaryPointsText(), {
      color: config.COLOR_WHITE,
    });
    this.primaryPoints.position.set(92, 64);
    this.group.add(this.primaryPoints);

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

    this.modesItem = new TextMenuItem('MODES');
    this.modesItem.selected.addListener(this.handleModesSelected);

    this.editorItem = new TextMenuItem('CONSTRUCTION');
    this.editorItem.selected.addListener(this.handleEditorSelected);

    this.settingsItem = new TextMenuItem('SETTINGS');
    this.settingsItem.selected.addListener(this.handleSettingsSelected);

    this.aboutItem = new TextMenuItem('ABOUT');
    this.aboutItem.selected.addListener(this.handleAboutSelected);

    const menuItems = [
      this.singlePlayerItem,
      this.modesItem,
      this.editorItem,
      this.settingsItem,
      this.aboutItem,
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
      let nextPosition = this.group.position.y - SLIDE_SPEED * deltaTime;
      if (nextPosition <= 0) {
        nextPosition = 0;
      }

      const isSkipped = input.isDownAny(MenuInputContext.Skip);
      if (isSkipped) {
        nextPosition = 0;
      }

      const hasReachedTop = nextPosition === 0;

      this.group.dirtyPaintBox();
      this.group.position.setY(nextPosition);
      this.group.updateMatrix(true);

      if (hasReachedTop) {
        this.state = State.Ready;
        this.menu.showCursor();
        this.session.setSeenIntro(true);
      } else {
        super.update(updateArgs);
      }
      return;
    }

    super.update(updateArgs);
  }

  private getPrimaryPointsText(): string {
    const points = this.session.primaryPlayer.getLastPoints();

    const pointsNumberText = points > 0 ? points.toString() : '00';
    const pointsText = pointsNumberText.padStart(6, ' ');

    const text = `Ⅰ-${pointsText}`;

    return text;
  }

  private getCommonHighscoreText(): string {
    const points = this.pointsHighscoreManager.getOverallMaxPoints();
    const pointsText = points.toString().padStart(6, ' ');

    const text = `HI-${pointsText}`;

    return text;
  }

  private handleSinglePlayerSelected = (): void => {
    this.navigator.replace(GameSceneType.LevelSelection);
  };

  private handleModesSelected = (): void => {
    this.navigator.push(GameSceneType.ModesMenu);
  };

  private handleEditorSelected = (): void => {
    this.navigator.push(GameSceneType.EditorMenu);
  };

  private handleSettingsSelected = (): void => {
    this.navigator.push(GameSceneType.SettingsMenu);
  };

  private handleAboutSelected = (): void => {
    this.navigator.push(GameSceneType.MainAbout);
  };
}
