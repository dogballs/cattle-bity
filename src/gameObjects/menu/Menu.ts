import { GameObject, Subject } from '../../core';
import { GameObjectUpdateArgs } from '../../game';
import { MenuInputContext } from '../../input';

import { MenuCursor } from './MenuCursor';
import { MenuItem } from './MenuItem';

export interface MenuOptions {
  initialIndex?: number;
  itemHeight?: number;
}

const DEFAULT_OPTIONS = {
  initialIndex: 0,
  itemHeight: 60,
};

const CURSOR_OFFSET = 96;
const ITEM_OFFSET = 16;

export class Menu extends GameObject {
  public selected = new Subject<number>();
  private menuItems: MenuItem[] = [];
  private options: MenuOptions;
  private cursor: MenuCursor = new MenuCursor();
  private focusedIndex: number;

  constructor(options: MenuOptions = {}) {
    super();

    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.focusedIndex = this.options.initialIndex;
  }

  public setItems(menuItems: MenuItem[]): void {
    this.menuItems = menuItems;
    this.size.set(480, menuItems.length * this.options.itemHeight);

    this.removeAllChildren();
    this.focusedIndex = 0;

    this.menuItems.forEach((menuItem, index) => {
      menuItem.position.set(
        CURSOR_OFFSET,
        index * this.options.itemHeight + ITEM_OFFSET,
      );
      this.add(menuItem);
    });

    this.add(this.cursor);

    this.updateCursor();
  }

  public hideCursor(): void {
    this.cursor.visible = false;
  }

  public showCursor(): void {
    this.cursor.visible = true;
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    const { input } = updateArgs;

    if (input.isDownAny(MenuInputContext.VerticalPrev)) {
      this.focusPrev();
      this.updateCursor();
    }

    if (input.isDownAny(MenuInputContext.VerticalNext)) {
      this.focusNext();
      this.updateCursor();
    }

    if (input.isDownAny(MenuInputContext.Select)) {
      this.selected.notify(this.focusedIndex);
    }

    this.menuItems.forEach((menuItem, index) => {
      if (index === this.focusedIndex) {
        menuItem.updateFocused(updateArgs);
      } else {
        menuItem.updateUnfocused(updateArgs);
      }
    });
  }

  private updateCursor(): void {
    this.cursor.position.setY(this.cursor.size.height * this.focusedIndex);
  }

  private focusPrev(): void {
    let nextIndex = this.focusedIndex - 1;
    if (nextIndex < 0) {
      nextIndex = this.menuItems.length - 1;
    }
    this.focusedIndex = nextIndex;
  }

  private focusNext(): void {
    let nextIndex = this.focusedIndex + 1;
    if (nextIndex > this.menuItems.length - 1) {
      nextIndex = 0;
    }
    this.focusedIndex = nextIndex;
  }
}
