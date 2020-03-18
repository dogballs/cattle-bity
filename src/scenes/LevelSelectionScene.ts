import { GameObjectUpdateArgs, Session } from '../game';
import { Curtain, LevelSelector } from '../gameObjects';

import { Scene } from './Scene';
import { SceneType } from './SceneType';

export class LevelSelectionScene extends Scene {
  private curtain: Curtain;
  private selector: LevelSelector;
  private session: Session;

  protected setup({ mapLoader, session }: GameObjectUpdateArgs): void {
    this.session = session;

    this.curtain = new Curtain(this.root.size.width, this.root.size.height);

    this.selector = new LevelSelector(mapLoader.getItemsCount());

    // TODO: order is important, z-index
    this.root.add(this.curtain);

    this.selector.setCenter(this.root.getSelfCenter());
    this.selector.selected.addListener(this.handleLevelSelected);
    this.root.add(this.selector);

    this.curtain.close();
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  private handleLevelSelected = (levelNumber: number): void => {
    this.session.start(levelNumber);
    this.transition(SceneType.Level);
  };
}
