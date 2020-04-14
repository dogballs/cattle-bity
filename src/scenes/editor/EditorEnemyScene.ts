import { Scene } from '../../core';
import { GameUpdateArgs } from '../../game';
import {
  DividerMenuItem,
  EditorEnemyPreview,
  SceneMenu,
  SceneMenuTitle,
  SelectorMenuItem,
  SelectorMenuItemChoice,
  TextMenuItem,
} from '../../gameObjects';
import { MapConfig } from '../../map';
import { TankType } from '../../tank';
import * as config from '../../config';

import { GameSceneType } from '../GameSceneType';

import { EditorLocationParams } from './params';

const ENEMY_TYPES = [
  TankType.EnemyA(),
  TankType.EnemyB(),
  TankType.EnemyC(),
  TankType.EnemyD(),
  TankType.EnemyA().setHasDrop(true),
  TankType.EnemyB().setHasDrop(true),
  TankType.EnemyC().setHasDrop(true),
  TankType.EnemyD().setHasDrop(true),
];

const PER_PAGE = 5;
const TOTAL_PAGES = config.ENEMY_MAX_TOTAL_COUNT / PER_PAGE;

export class EditorEnemyScene extends Scene<EditorLocationParams> {
  private mapConfig: MapConfig;
  private title: SceneMenuTitle;
  private menu: SceneMenu;
  private preview: EditorEnemyPreview;
  private selectorsItems: SelectorMenuItem<number>[] = [];
  private nextItem: TextMenuItem;
  private prevItem: TextMenuItem;
  private backItem: TextMenuItem;
  private pageIndex = 0;

  protected setup(): void {
    this.mapConfig = this.params.mapConfig;
    // Prefill enemies with default ones
    if (this.mapConfig.isEnemySpawnListEmpty()) {
      this.mapConfig.fillEnemySpawnList(TankType.EnemyA());
    }

    this.title = new SceneMenuTitle(this.getTitleText());
    this.root.add(this.title);

    this.preview = new EditorEnemyPreview(ENEMY_TYPES);
    this.preview.position.set(600, 230);
    this.root.add(this.preview);

    const selectorChoices = ENEMY_TYPES.map((type, index) => {
      const tierText = type.tier.toString().toUpperCase();
      let text = `TIER ${tierText}`;
      if (type.hasDrop) {
        text += ' +';
      }

      const choice = {
        value: index,
        text,
      };
      return choice;
    });

    for (let i = 0; i < PER_PAGE; i += 1) {
      const selectorItem = new SelectorMenuItem(selectorChoices, {
        containerWidth: 264,
        itemOriginX: 0,
      });
      selectorItem.changed.addListener((choice) => {
        this.handleSelectorChanged(choice, i);
      });
      selectorItem.focused.addListener(() => {
        this.handleSelectorFocused(i);
      });
      selectorItem.unfocused.addListener(this.handleSelectorUnfocused);
      this.selectorsItems[i] = selectorItem;
    }

    this.nextItem = new TextMenuItem(this.getNextText());
    this.nextItem.selected.addListener(this.handleNextSelected);

    this.prevItem = new TextMenuItem(this.getPrevText());
    this.prevItem.selected.addListener(this.handlePrevSelected);

    this.backItem = new TextMenuItem('BACK');
    this.backItem.selected.addListener(this.handleBackSelected);

    const menuItems = [
      ...this.selectorsItems,
      new DividerMenuItem(),
      this.nextItem,
      this.prevItem,
      new DividerMenuItem(),
      this.backItem,
    ];

    this.menu = new SceneMenu();
    this.menu.setItems(menuItems);
    this.root.add(this.menu);

    this.updateMenu();
  }

  protected update(updateArgs: GameUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  private getTypeValue(typeToFind: TankType): number {
    // Index of type is used as a value in selector
    const value = ENEMY_TYPES.findIndex((type) => {
      return type.equals(typeToFind);
    });
    return value;
  }

  private updateMenu(): void {
    this.title.setText(this.getTitleText());

    this.prevItem.setText(this.getPrevText());
    this.prevItem.focusable = this.hasPrevPage();

    this.nextItem.setText(this.getNextText());
    this.nextItem.focusable = this.hasNextPage();

    const pageRange = this.getPageRange(this.pageIndex);

    const allEnemyTypes = this.mapConfig.getEnemySpawnList();
    const pageEnemyTypes = allEnemyTypes.slice(pageRange[0], pageRange[1] + 1);

    this.selectorsItems.forEach((selectorItem, index) => {
      const pageEnemyType = pageEnemyTypes[index];
      const value = this.getTypeValue(pageEnemyType);

      selectorItem.setValue(value);
    });
  }

  private getTitleText(): string {
    const pageText = this.getPageRangeText(this.pageIndex);
    const text = `CONSTRUCTION → ENEMY ${pageText}`;
    return text;
  }

  private getPrevText(): string {
    if (!this.hasPrevPage()) {
      return `PREV`;
    }

    const pageText = this.getPageRangeText(this.pageIndex - 1);
    const text = `PREV → ENEMY ${pageText}`;
    return text;
  }

  private getNextText(): string {
    if (!this.hasNextPage()) {
      return `NEXT`;
    }

    const pageText = this.getPageRangeText(this.pageIndex + 1);
    const text = `NEXT → ENEMY ${pageText}`;
    return text;
  }

  private getPageRangeText(pageIndex: number): string {
    const pageRange = this.getPageRange(pageIndex);
    const [pageStartIndex, pageEndIndex] = pageRange;

    const pageStartNumber = pageStartIndex + 1;
    const pageEndNumber = pageEndIndex + 1;

    const pageRangeText = `[${pageStartNumber}-${pageEndNumber}]`;

    return pageRangeText;
  }

  private getPageRange(pageIndex: number): number[] {
    const pageStartIndex = pageIndex * PER_PAGE;
    const pageEndIndex = pageStartIndex + PER_PAGE - 1;

    const pageRange = [pageStartIndex, pageEndIndex];

    return pageRange;
  }

  private hasPrevPage(): boolean {
    return this.pageIndex > 0;
  }

  private hasNextPage(): boolean {
    return this.pageIndex < TOTAL_PAGES - 1;
  }

  private handleSelectorChanged = (
    choice: SelectorMenuItemChoice<number>,
    selectorIndex: number,
  ): void => {
    const enemyIndex = this.pageIndex * PER_PAGE + selectorIndex;
    const enemyType = ENEMY_TYPES[choice.value];

    this.preview.show(enemyType);

    this.mapConfig.setEnemySpawnListItem(enemyIndex, enemyType);
  };

  private handleSelectorFocused = (selectorIndex: number): void => {
    this.preview.visible = true;

    const selectorItem = this.selectorsItems[selectorIndex];

    const value = selectorItem.getValue();
    const enemyType = ENEMY_TYPES[value];

    this.preview.show(enemyType);
  };

  private handleSelectorUnfocused = (): void => {
    this.preview.visible = false;
  };

  private handleNextSelected = (): void => {
    if (!this.hasNextPage()) {
      this.navigator.back();
      return;
    }

    this.pageIndex += 1;
    this.updateMenu();
  };

  private handlePrevSelected = (): void => {
    if (!this.hasPrevPage()) {
      this.navigator.back();
      return;
    }

    this.pageIndex -= 1;
    this.updateMenu();
  };

  private handleBackSelected = (): void => {
    this.navigator.replace(GameSceneType.EditorMenu, this.params);
  };
}
