import { Scene } from '../../core';
import { GameUpdateArgs } from '../../game';
import { Curtain, LevelTitle } from '../../gameObjects';
import { MapConfig } from '../../map';

import { GameSceneType } from '../GameSceneType';

export class LevelLoadScene extends Scene {
  private curtain: Curtain;
  private title: LevelTitle;

  protected setup({ mapLoader, session }: GameUpdateArgs): void {
    const levelNumber = session.getLevelNumber();

    this.curtain = new Curtain(
      this.root.size.width,
      this.root.size.height,
      false,
    );
    this.root.add(this.curtain);

    this.title = new LevelTitle(levelNumber);
    this.title.setCenter(this.root.getSelfCenter());
    this.title.origin.set(0.5, 0.5);
    this.root.add(this.title);

    mapLoader.loaded.addListenerOnce(this.handleMapLoaded);
    mapLoader.loadAsync(levelNumber);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  private handleMapLoaded = (mapConfig: MapConfig): void => {
    this.navigator.replace(GameSceneType.LevelPlay, {
      mapConfig,
    });
  };
}
