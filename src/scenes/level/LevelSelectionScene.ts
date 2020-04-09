import { Scene } from '../../core';
import { GameUpdateArgs, Session } from '../../game';
import { Curtain, LevelSelector } from '../../gameObjects';
import { MapLoader } from '../../map';

import { GameSceneType } from '../GameSceneType';

export class LevelSelectionScene extends Scene {
  private curtain: Curtain;
  private selector: LevelSelector;
  private session: Session;
  private mapLoader: MapLoader;

  protected setup({ mapLoader, session }: GameUpdateArgs): void {
    this.session = session;
    this.mapLoader = mapLoader;

    this.curtain = new Curtain(this.root.size.width, this.root.size.height);

    this.selector = new LevelSelector(mapLoader.getItemsCount());

    // TODO: order is important, z-index
    this.root.add(this.curtain);

    this.selector.setCenter(this.root.getSelfCenter());
    this.selector.selected.addListener(this.handleLevelSelected);
    this.root.add(this.selector);

    this.curtain.close();
  }

  protected update(updateArgs: GameUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  private handleLevelSelected = (levelNumber: number): void => {
    const startLevelNumber = levelNumber;
    const endLevelNumber = this.mapLoader.getItemsCount();

    this.session.start(startLevelNumber, endLevelNumber);
    this.navigator.replace(GameSceneType.LevelLoad);
  };
}
