import { GameObject, KeyboardKey, RectRenderer } from '../core';
import { Menu, Title } from '../gameObjects';
import * as config from '../config';

import { Scene, SceneUpdateArgs } from './Scene';

const SLIDE_SPEED = 4;

enum State {
  Sliding,
  Ready,
}

export class MenuScene extends Scene {
  private group: GameObject;
  private menu: Menu;
  private state: State = State.Sliding;

  public setup(): void {
    this.root.renderer = new RectRenderer(config.BACKGROUND_COLOR);

    this.group = new GameObject(this.root.size.width, this.root.size.height);
    this.group.position.setY(this.root.size.height);

    const title = new Title();
    title.setCenter(this.root.getChildrenCenter());
    title.position.setY(160);
    this.group.add(title);

    this.menu = new Menu();
    this.menu.setCenter(this.root.getChildrenCenter());
    this.menu.position.setY(512);
    this.menu.selected.addListener(this.handleMenuSelected);
    this.group.add(this.menu);

    this.root.add(this.group);
  }

  public update(updateArgs: SceneUpdateArgs): void {
    const { input } = updateArgs;

    if (this.state === State.Sliding) {
      this.group.position.y -= SLIDE_SPEED;

      const hasReachedTop = this.group.position.y <= 0;
      const isSkipped = input.isDown(KeyboardKey.Space);
      const isReady = hasReachedTop || isSkipped;

      if (isReady) {
        this.group.position.y = 0;
        this.state = State.Ready;
        this.menu.showSelector();
      } else {
        this.group.update(updateArgs);
      }
      return;
    }

    this.root.traverse((child) => {
      child.update(updateArgs);
    });
  }

  private handleMenuSelected = (selectedIndex): void => {
    console.log({ selectedIndex });
  };
}
