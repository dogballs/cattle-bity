import { Scene } from '../../core';
import { GameUpdateArgs, Session } from '../../game';
import { Curtain, InputHint, LevelSelector } from '../../gameObjects';
import { LevelSelectionInputContext } from '../../input';
import { MapLoader } from '../../map';

import { GameSceneType } from '../GameSceneType';

export class LevelSelectionScene extends Scene {
  private curtain: Curtain;
  private selector: LevelSelector;
  private continueHint: InputHint;
  private session: Session;
  private mapLoader: MapLoader;

  protected setup({ inputManager, mapLoader, session }: GameUpdateArgs): void {
    this.session = session;
    this.mapLoader = mapLoader;

    this.curtain = new Curtain(this.root.size.width, this.root.size.height);
    this.root.add(this.curtain);

    this.selector = new LevelSelector(mapLoader.getItemsCount());
    this.selector.setCenter(this.root.getSelfCenter());
    this.selector.selected.addListener(this.handleLevelSelected);
    this.root.add(this.selector);

    const displayedCode = inputManager.getPresentedControlCode(
      LevelSelectionInputContext.Select[0],
    );

    this.continueHint = new InputHint(`${displayedCode} TO SELECT`);
    this.root.add(this.continueHint);

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
