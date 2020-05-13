import { DebugCollisionMenu } from '../../debug';
import { GameUpdateArgs } from '../../game';
import { EditorBorder, EditorField, EditorMap } from '../../gameObjects';
import { EditorMapInputContext } from '../../input';
import { MapConfig } from '../../map';
import * as config from '../../config';

import { GameScene } from '../GameScene';
import { GameSceneType } from '../GameSceneType';

import { EditorLocationParams } from './params';

export class EditorMapScene extends GameScene<EditorLocationParams> {
  private field: EditorField;
  private map: EditorMap;
  private mapConfig: MapConfig;
  private debugCollisionMenu: DebugCollisionMenu;

  protected setup(updateArgs: GameUpdateArgs): void {
    const { collisionSystem } = updateArgs;

    this.debugCollisionMenu = new DebugCollisionMenu(
      collisionSystem,
      this.root,
      { top: 400 },
    );
    if (config.IS_DEV) {
      this.debugCollisionMenu.attach();
      this.debugCollisionMenu.show();
    }

    this.root.add(new EditorBorder());

    this.mapConfig = this.params.mapConfig;

    this.map = new EditorMap(this.mapConfig);
    this.map.position.set(
      config.BORDER_LEFT_WIDTH,
      config.BORDER_TOP_BOTTOM_HEIGHT,
    );
    this.root.add(this.map);

    this.field = new EditorField();
    this.field.position.set(
      config.BORDER_LEFT_WIDTH,
      config.BORDER_TOP_BOTTOM_HEIGHT,
    );
    this.root.add(this.field);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { collisionSystem, inputManager } = updateArgs;

    const inputMethod = inputManager.getActiveMethod();

    if (inputMethod.isDownAny(EditorMapInputContext.Menu)) {
      this.navigator.replace(GameSceneType.EditorMenu, this.params);
      return;
    }

    super.update(updateArgs);

    // Update all transforms before checking collisions
    this.root.updateWorldMatrix(false, true);

    collisionSystem.update();

    if (config.IS_DEV) {
      this.debugCollisionMenu.update();
    }

    collisionSystem.collide();
  }
}
