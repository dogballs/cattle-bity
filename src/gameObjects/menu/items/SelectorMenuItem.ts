import { GameObject, RectPainter, Subject } from '../../../core';
import { GameUpdateArgs } from '../../../game';
import { MenuInputContext } from '../../../input';
import * as config from '../../../config';

import { SpriteText } from '../../text';

import { MenuItem } from '../MenuItem';

// TODO: calculate dynamically
const ARROW_WIDTH = 28;
const ARROW_OFFSET = 16;
const ITEM_HEIGHT = 28;

export interface SelectorMenuItemChoice<T> {
  value: T;
  text: string;
}

export interface SelectorMenuItemOptions {
  containerWidth?: number;
  itemOriginX?: number;
}

const DEFAULT_OPTIONS = {
  containerWidth: 256,
  itemOriginX: 0.5,
};

export class SelectorMenuItem<T> extends MenuItem {
  public changed = new Subject<SelectorMenuItemChoice<T>>();
  private choices: SelectorMenuItemChoice<T>[] = [];
  private options: SelectorMenuItemOptions;
  private leftArrow = new SpriteText('←', { color: config.COLOR_WHITE });
  private rightArrow = new SpriteText('→', { color: config.COLOR_WHITE });
  private container: GameObject;
  private selectedIndex = 0;
  private items: SpriteText[] = [];

  constructor(
    choices: SelectorMenuItemChoice<T>[] = [],
    options: SelectorMenuItemOptions = {},
  ) {
    super();

    this.choices = choices;
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  public setValue(value: T): void {
    const choiceIndex = this.choices.findIndex(
      (choice) => choice.value === value,
    );
    if (choiceIndex === -1) {
      return;
    }

    this.selectChoice(choiceIndex);
  }

  public getValue(): T {
    const focusedChoice = this.choices[this.selectedIndex];
    if (focusedChoice === undefined) {
      return null;
    }

    const { value } = focusedChoice;
    return value;
  }

  public updateFocused(updateArgs: GameUpdateArgs): void {
    const { inputManager } = updateArgs;

    const inputVariant = inputManager.getActiveVariant();

    if (inputVariant.isDownAny(MenuInputContext.HorizontalNext)) {
      this.selectNext();
      this.emitChange();
    }

    if (inputVariant.isDownAny(MenuInputContext.HorizontalPrev)) {
      this.selectPrev();
      this.emitChange();
    }
  }

  protected setup(): void {
    this.container = new GameObject(this.options.containerWidth, ITEM_HEIGHT);
    this.container.painter = new RectPainter(config.COLOR_BLACK);
    this.container.position.setX(ARROW_WIDTH + ARROW_OFFSET);
    this.add(this.container);

    this.choices.forEach((choice) => {
      const item = new SpriteText(choice.text, {
        color: config.COLOR_WHITE,
      });
      item.origin.setX(this.options.itemOriginX);
      item.position.setX(
        this.options.containerWidth * this.options.itemOriginX,
      );
      this.container.add(item);
    });

    this.add(this.leftArrow);

    this.rightArrow.position.setX(
      ARROW_WIDTH + ARROW_OFFSET + this.options.containerWidth + ARROW_OFFSET,
    );
    this.add(this.rightArrow);

    this.selectChoice();
  }

  private emitChange(): void {
    const choice = this.choices[this.selectedIndex];

    this.changed.notify(choice);
  }

  private selectPrev(): void {
    let prevIndex = this.selectedIndex - 1;
    if (prevIndex < 0) {
      prevIndex = this.choices.length - 1;
    }

    this.selectChoice(prevIndex);
  }

  private selectNext(): void {
    let nextIndex = this.selectedIndex + 1;
    if (nextIndex > this.choices.length - 1) {
      nextIndex = 0;
    }

    this.selectChoice(nextIndex);
  }

  private selectChoice(nextIndex?: number): void {
    if (nextIndex === undefined) {
      nextIndex = this.selectedIndex;
    }

    if (this.choices[nextIndex] === undefined) {
      this.selectedIndex = -1;
    } else {
      this.selectedIndex = nextIndex;
    }

    if (this.hasBeenSetup()) {
      this.container.dirtyPaintBox();
      this.container.children.forEach((item, index) => {
        if (this.selectedIndex === index) {
          item.setVisible(true);
        } else {
          item.setVisible(false);
        }
      });
    }
  }
}
