import { GameUpdateArgs, Session } from '../../game';
import { Curtain, SceneInputHint, LevelSelector } from '../../gameObjects';
import { LevelSelectionInputContext } from '../../input';
import { MapLoader } from '../../map';

import { GameScene } from '../GameScene';
import { GameSceneType } from '../GameSceneType';

export class LevelSelectionScene extends GameScene {
  private curtain: Curtain;
  private selector: LevelSelector;
  private continueHint: SceneInputHint;
  private session: Session;
  private mapLoader: MapLoader;

  protected setup({ inputManager, mapLoader, session }: GameUpdateArgs): void {
    this.session = session;
    this.mapLoader = mapLoader;

    this.curtain = new Curtain(this.root.size.width, this.root.size.height);
    this.root.add(this.curtain);

    this.selector = new LevelSelector(
      this.mapLoader.getItemsCount(),
      this.session.isPlaytest(),
    );
    this.selector.setCenter(this.root.getSelfCenter());
    this.selector.selected.addListener(this.handleLevelSelected);
    this.root.add(this.selector);

    const continueDisplayCode = inputManager.getDisplayedControlCode(
      inputManager.getActiveBindingType(),
      LevelSelectionInputContext.Select[0],
    );
    this.continueHint = new SceneInputHint(`${continueDisplayCode} TO SELECT`);
    this.root.add(this.continueHint);

    this.curtain.close();
  }

  private handleLevelSelected = (levelNumber: number): void => {
    const startLevelNumber = levelNumber;
    const endLevelNumber = this.mapLoader.getItemsCount();

    this.session.start(startLevelNumber, endLevelNumber);
    this.navigator.replace(GameSceneType.LevelLoad);
  };
}
