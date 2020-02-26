import {
  GameObject,
  GameObjectUpdateArgs,
  KeyboardKey,
  RectRenderer,
} from '../core';
import { Menu, MenuHeading } from '../gameObjects';
import * as config from '../config';

const SLIDE_SPEED = 4;

enum State {
  Sliding,
  Ready,
}

export class MenuScene extends GameObject {
  private heading = new MenuHeading();
  private group = new GameObject();
  private menu = new Menu();
  private state: State = State.Sliding;

  protected setup(): void {
    this.renderer = new RectRenderer(config.BACKGROUND_COLOR);

    this.group.size.copy(this.size);
    this.group.position.setY(this.size.height);
    this.group.add(this.heading);

    this.heading.pivot.setX(0.5);
    this.heading.setCenter(this.getChildrenCenter());
    this.heading.position.setY(160);

    this.menu.setCenter(this.getChildrenCenter());
    this.menu.position.setY(512);
    this.menu.selected.addListener(this.handleMenuSelected);
    this.group.add(this.menu);

    this.add(this.group);
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
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
