import {
  GameObject,
  GameObjectUpdateArgs,
  KeyboardKey,
  RectRenderer,
} from '../core';
import { Menu, Title } from '../gameObjects';
import * as config from '../config';

const SLIDE_SPEED = 4;

enum State {
  Sliding,
  Ready,
}

export class MenuScene extends GameObject {
  private group: GameObject;
  private menu: Menu;
  private state: State = State.Sliding;

  public setup(): void {
    this.renderer = new RectRenderer(config.BACKGROUND_COLOR);

    this.group = new GameObject(this.size.width, this.size.height);
    this.group.position.setY(this.size.height);

    const title = new Title();
    title.setCenter(this.getChildrenCenter());
    title.position.setY(160);
    this.group.add(title);

    this.menu = new Menu();
    this.menu.setCenter(this.getChildrenCenter());
    this.menu.position.setY(512);
    this.menu.selected.addListener(this.handleMenuSelected);
    this.group.add(this.menu);

    this.add(this.group);
  }

  public update(updateArgs: GameObjectUpdateArgs): void {
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
        this.traverseDescedants((child) => {
          child.invokeUpdate(updateArgs);
        });
      }
      return;
    }

    this.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  private handleMenuSelected = (selectedIndex): void => {
    console.log({ selectedIndex });
  };
}
