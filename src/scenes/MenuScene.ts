import { RectRenderer } from '../core';
import { Menu, Title } from '../gameObjects';
import * as config from '../config';

import { Scene, SceneUpdateArgs } from './Scene';

export class MenuScene extends Scene {
  public setup(): void {
    this.root.renderer = new RectRenderer(config.BACKGROUND_COLOR);

    const title = new Title();
    title.setCenter(this.root.getChildrenCenter());
    title.position.setY(160);
    this.root.add(title);

    const menu = new Menu();
    menu.setCenter(this.root.getChildrenCenter());
    menu.position.setY(512);
    menu.selected.addListener(this.handleMenuSelected);
    this.root.add(menu);
  }

  public update({ input, gameState }: SceneUpdateArgs): void {
    this.root.traverse((child) => {
      child.update({ input, gameState });
    });
  }

  private handleMenuSelected = (selectedIndex): void => {
    console.log({ selectedIndex });
  };
}
