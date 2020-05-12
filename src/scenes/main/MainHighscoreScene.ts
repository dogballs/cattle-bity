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
    const primaryGamePoints = session.primaryPlayer.getGamePoints();
    const secondaryGamePoints = session.secondaryPlayer.getGamePoints();
    const maxGamePoints = Math.max(primaryGamePoints, secondaryGamePoints);

    const primaryHighscore = pointsHighscoreManager.getPrimaryPoints();
    const secondaryHighscore = pointsHighscoreManager.getSecondaryPoints();
    const maxHighscore = pointsHighscoreManager.getOverallMaxPoints();

    // Reset all previous game session data
    session.reset();

    // Keep last points
    session.primaryPlayer.setLastGamePoints(primaryGamePoints);
    session.secondaryPlayer.setLastGamePoints(secondaryGamePoints);

    // Save player highscore
    if (primaryGamePoints > primaryHighscore) {
      pointsHighscoreManager.savePrimaryPoints(primaryGamePoints);
    }
    if (secondaryGamePoints > secondaryHighscore) {
      pointsHighscoreManager.saveSecondaryPoints(secondaryGamePoints);
    }

    // If user did not reach common highscore, simply skip this page
    if (maxGamePoints <= maxHighscore) {
      this.navigator.clearAndPush(GameSceneType.MainMenu);
      return;
    }

    this.heading = new HighscoreHeading(maxGamePoints);
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
