import { GameUpdateArgs } from '../../game';
import { HighscoreHeading } from '../../gameObjects';

import { GameScene } from '../GameScene';
import { GameSceneType } from '../GameSceneType';

export class MainHighscoreScene extends GameScene {
  private heading: HighscoreHeading;

  protected setup({
    audioLoader,
    pointsHighscoreManager,
    session,
  }: GameUpdateArgs): void {
    const primaryTotalPoints = session.primaryPlayer.getTotalPoints();
    const secondaryTotalPoints = session.secondaryPlayer.getTotalPoints();
    const maxSessionPoints = Math.max(primaryTotalPoints, secondaryTotalPoints);

    const primaryHighscore = pointsHighscoreManager.getPrimaryPoints();
    const secondaryHighscore = pointsHighscoreManager.getSecondaryPoints();
    const maxHighscore = pointsHighscoreManager.getOverallMaxPoints();

    // Reset all previous game session data
    session.reset();

    // Keep last points
    session.primaryPlayer.setLastPoints(primaryTotalPoints);
    session.secondaryPlayer.setLastPoints(secondaryTotalPoints);

    // Save player highscore
    if (primaryTotalPoints > primaryHighscore) {
      pointsHighscoreManager.savePrimaryPoints(primaryTotalPoints);
    }
    if (secondaryTotalPoints > secondaryHighscore) {
      pointsHighscoreManager.saveSecondaryPoints(secondaryTotalPoints);
    }

    // If user did not reach common highscore, simply skip this page
    if (maxSessionPoints <= maxHighscore) {
      this.navigator.clearAndPush(GameSceneType.MainMenu);
      return;
    }

    this.heading = new HighscoreHeading(maxSessionPoints);
    this.heading.origin.set(0.5, 0.5);
    this.heading.setCenter(this.root.getSelfCenter());
    this.heading.position.addY(-96);
    this.root.add(this.heading);

    const highscoreSound = audioLoader.load('highscore');
    highscoreSound.ended.addListener(this.handleEnded);
    highscoreSound.play();
  }

  private handleEnded = (): void => {
    this.navigator.clearAndPush(GameSceneType.MainMenu);
  };
}
