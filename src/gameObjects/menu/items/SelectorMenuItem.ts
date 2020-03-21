import { GameObject, Subject } from '../../../core';
import { GameObjectUpdateArgs } from '../../../game';
import { MenuInputContext } from '../../../input';
import * as config from '../../../config';

import { SpriteText } from '../../SpriteText';

import { MenuItem } from '../MenuItem';

// TODO: calculate dynamically
const ARROW_WIDTH = 28;
const ARROW_OFFSET = 16;
const ITEM_HEIGHT = 28;
const CONTAINER_WIDTH = 256;

export interface SelectorMenuItemChoice<T> {
  value: T;
  text: string;
}

export class SelectorMenuItem<T> extends MenuItem {
  public changed = new Subject<SelectorMenuItemChoice<T>>();
  private choices: SelectorMenuItemChoice<T>[] = [];
  private leftArrow = new SpriteText('←', { color: config.COLOR_WHITE });
  private rightArrow = new SpriteText('→', { color: config.COLOR_WHITE });
  private container = new GameObject();
  private selectedIndex = 0;
  private items: SpriteText[] = [];

  constructor(choices: SelectorMenuItemChoice<T>[] = []) {
    super();

    this.choices = choices;
  }

  public updateFocused(updateArgs: GameObjectUpdateArgs): void {
    const { input } = updateArgs;

    if (input.isDownAny(MenuInputContext.HorizontalNext)) {
      this.selectNext();
      this.updateSelected();
      this.emitChange();
    }

    if (input.isDownAny(MenuInputContext.HorizontalPrev)) {
      this.selectPrev();
      this.updateSelected();
      this.emitChange();
    }
  }

  protected setup(): void {
    this.choices.forEach((choice) => {
      const item = new SpriteText(choice.text, {
        color: config.COLOR_WHITE,
      });
      item.origin.setX(0.5);
      item.position.setX(CONTAINER_WIDTH / 2);
      this.container.add(item);
    });

    this.updateSelected();

    this.add(this.leftArrow);

    this.container.position.setX(ARROW_WIDTH + ARROW_OFFSET);
    this.container.size.set(CONTAINER_WIDTH, ITEM_HEIGHT);
    this.add(this.container);

    this.rightArrow.position.setX(
      ARROW_WIDTH + ARROW_OFFSET + CONTAINER_WIDTH + ARROW_OFFSET,
    );
    this.add(this.rightArrow);
  }

  private emitChange(): void {
    const choice = this.choices[this.selectedIndex];

    this.changed.notify(choice);
  }

  private updateSelected(): void {
    this.container.children.forEach((item, index) => {
      if (this.selectedIndex === index) {
        item.visible = true;
      } else {
        item.visible = false;
      }
    });
  }

  private selectPrev(): void {
    let nextIndex = this.selectedIndex - 1;
    if (nextIndex < 0) {
      nextIndex = this.choices.length - 1;
    }
    this.selectedIndex = nextIndex;
  }

  private selectNext(): void {
    let nextIndex = this.selectedIndex + 1;
    if (nextIndex > this.choices.length - 1) {
      nextIndex = 0;
    }
    this.selectedIndex = nextIndex;
  }
}
