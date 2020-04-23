import { Scene } from '../../core';
import { GameUpdateArgs } from '../../game';
import { HighscoreHeading } from '../../gameObjects';

import { GameSceneType } from '../GameSceneType';

export class MainHighscoreScene extends Scene {
  private heading: HighscoreHeading;

  protected setup({ audioLoader, gameStorage, session }: GameUpdateArgs): void {
    const totalPoints = session.getMaxPoints();
    const highscore = session.getMaxHighscore();

    // Reset all previous game session data
    session.reset();

    // If user did not reach highscore, simply skip this page
    if (totalPoints <= highscore) {
      this.navigator.clearAndPush(GameSceneType.MainMenu);
      return;
    }

    // Save highscore
    gameStorage.savePrimaryPoints(totalPoints);

    this.heading = new HighscoreHeading(totalPoints);
    this.heading.origin.set(0.5, 0.5);
    this.heading.setCenter(this.root.getSelfCenter());
    this.heading.position.addY(-96);
    this.root.add(this.heading);

    const highscoreSound = audioLoader.load('highscore');
    highscoreSound.ended.addListener(this.handleEnded);
    highscoreSound.play();
  }

  protected update(updateArgs: GameUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  private handleEnded = (): void => {
    this.navigator.clearAndPush(GameSceneType.MainMenu);
  };
}
