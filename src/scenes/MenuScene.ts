import { GameObject, RectRenderer } from '../core';
import { GameObjectUpdateArgs } from '../game';
import { Menu, MenuHeading } from '../gameObjects';
import { InputControl } from '../input';
import * as config from '../config';

import { Scene } from './Scene';
import { SceneType } from './SceneType';

const SLIDE_SPEED = 4;

enum State {
  Sliding,
  Ready,
}

export class MenuScene extends Scene {
  private heading = new MenuHeading();
  private group = new GameObject();
  private menu = new Menu();
  private state: State = State.Sliding;

  protected setup(): void {
    this.root.renderer = new RectRenderer(config.COLOR_BLACK);

    this.group.size.copy(this.root.size);
    this.group.position.setY(this.root.size.height);

    this.heading.pivot.setX(0.5);
    this.heading.setCenter(this.root.getChildrenCenter());
    this.heading.position.setY(160);
    this.group.add(this.heading);

    this.menu.setCenter(this.root.getChildrenCenter());
    this.menu.position.setY(512);
    this.menu.selected.addListener(this.handleMenuSelected);
    this.group.add(this.menu);

    this.root.add(this.group);
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    const { input } = updateArgs;

    if (this.state === State.Sliding) {
      this.group.position.y -= SLIDE_SPEED;

      const hasReachedTop = this.group.position.y <= 0;
      const isSkipped = input.isDownAny([
        InputControl.Select,
        InputControl.Start,
      ]);
      const isReady = hasReachedTop || isSkipped;

      if (isReady) {
        this.group.position.y = 0;
        this.state = State.Ready;
        this.menu.showSelector();
      } else {
        this.root.traverseDescedants((child) => {
          child.invokeUpdate(updateArgs);
        });
      }
      return;
    }

    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  private handleMenuSelected = (selectedIndex): void => {
    if (selectedIndex === 0) {
      this.transition(SceneType.LevelSelection);
    }
  };
}
