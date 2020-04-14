import { RectPainter, Scene, Timer } from '../../core';
import { GameUpdateArgs, Session } from '../../game';
import { LevelTitle, ScoreTable } from '../../gameObjects';
import * as config from '../../config';

import { GameSceneType } from '../GameSceneType';

const POST_DELAY = 3;

enum State {
  Idle,
  Counting,
  Post,
}

export class LevelScoreScene extends Scene {
  private session: Session;
  private levelTitle: LevelTitle;
  private scoreTable: ScoreTable;
  private postTimer = new Timer();
  private state = State.Idle;

  protected setup({ session }: GameUpdateArgs): void {
    this.session = session;

    this.root.painter = new RectPainter(config.COLOR_BLACK);

    this.levelTitle = new LevelTitle(this.session.getLevelNumber(), {
      color: config.COLOR_WHITE,
    });
    this.levelTitle.origin.set(0.5, 0);
    this.levelTitle.setCenter(this.root.getSelfCenter());
    this.levelTitle.position.setY(128);
    this.root.add(this.levelTitle);

    const pointsRecord = this.session.primaryPlayer.getLevelPointsRecord();

    this.scoreTable = new ScoreTable(pointsRecord);
    this.scoreTable.setCenter(this.root.getSelfCenter());
    this.scoreTable.done.addListener(this.handleDone);
    this.root.add(this.scoreTable);

    this.postTimer.done.addListener(this.handlePost);

    this.state = State.Counting;
    this.scoreTable.start();
  }

  protected update(updateArgs: GameUpdateArgs): void {
    if (this.state === State.Post) {
      this.postTimer.update(updateArgs.deltaTime);
      return;
    }

    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  private handleDone = (): void => {
    this.state = State.Post;
    this.postTimer.reset(POST_DELAY);
  };

  private handlePost = (): void => {
    if (this.session.isGameOver()) {
      this.navigator.replace(GameSceneType.MainGameOver);
      return;
    }
    if (this.session.isLastLevel()) {
      this.navigator.replace(GameSceneType.MainVictory);
      return;
    }
    this.session.activateNextLevel();
    this.navigator.replace(GameSceneType.LevelLoad);
  };
}
