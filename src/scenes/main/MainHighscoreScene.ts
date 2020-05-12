import { AudioManager, GameUpdateArgs } from '../../game';
import { HighscoreHeading } from '../../gameObjects';
import { MenuInputContext } from '../../input';

import { GameScene } from '../GameScene';
import { GameSceneType } from '../GameSceneType';

export class MainHighscoreScene extends GameScene {
  private heading: HighscoreHeading;
  private audioManager: AudioManager;

  protected setup({
    audioManager,
    audioLoader,
    pointsHighscoreManager,
    session,
  }: GameUpdateArgs): void {
    this.audioManager = audioManager;

    const primaryGamePoints = session.primaryPlayer.getGamePoints();
    const secondaryGamePoints = session.secondaryPlayer.getGamePoints();
    const maxGamePoints = Math.max(primaryGamePoints, secondaryGamePoints);

    const primaryHighscore = pointsHighscoreManager.getPrimaryPoints();
    const secondaryHighscore = pointsHighscoreManager.getSecondaryPoints();
    const maxHighscore = pointsHighscoreManager.getOverallMaxPoints();

    const wasMultiplayer = session.isMultiplayer();

    // Reset all previous game session data
    session.reset();

    // Keep last game points
    session.primaryPlayer.setLastGamePoints(primaryGamePoints);
    if (wasMultiplayer) {
      session.secondaryPlayer.setLastGamePoints(secondaryGamePoints);
    }

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
    highscoreSound.ended.addListener(this.handleAudioEnded);
    highscoreSound.play();
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { inputManager } = updateArgs;

    const inputVariant = inputManager.getActiveVariant();

    if (inputVariant.isDownAny(MenuInputContext.Skip)) {
      this.finish();
      return;
    }

    super.update(updateArgs);
  }

  private handleAudioEnded = (): void => {
    this.finish();
  };

  private finish(): void {
    this.audioManager.stopAll();
    this.navigator.clearAndPush(GameSceneType.MainMenu);
  }
}
