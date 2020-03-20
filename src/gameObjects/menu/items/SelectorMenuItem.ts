import { GameObject } from '../../../core';
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

export class SelectorMenuItem extends GameObject implements MenuItem {
  private itemTexts: string[] = [];

  private leftArrow = new SpriteText('←', { color: config.COLOR_WHITE });
  private rightArrow = new SpriteText('→', { color: config.COLOR_WHITE });
  private container = new GameObject();
  private selectedIndex = 0;
  private items: SpriteText[] = [];

  constructor(itemTexts: string[] = []) {
    super();

    this.itemTexts = itemTexts;
  }

  public updateFocused(updateArgs: GameObjectUpdateArgs): void {
    const { input } = updateArgs;

    if (input.isDownAny(MenuInputContext.HorizontalNext)) {
      this.selectNext();
      this.updateSelected();
    }

    if (input.isDownAny(MenuInputContext.HorizontalPrev)) {
      this.selectPrev();
      this.updateSelected();
    }
  }

  public updateUnfocused(): void {
    // Do nothing
  }

  protected setup(): void {
    this.itemTexts.forEach((itemText) => {
      const item = new SpriteText(itemText, {
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
      nextIndex = this.itemTexts.length - 1;
    }
    this.selectedIndex = nextIndex;
  }

  private selectNext(): void {
    let nextIndex = this.selectedIndex + 1;
    if (nextIndex > this.itemTexts.length - 1) {
      nextIndex = 0;
    }
    this.selectedIndex = nextIndex;
  }
}
