import {
  Alignment,
  GameObject,
  GameObjectUpdateArgs,
  KeyboardKey,
  SpriteFont,
  SpriteFontConfig,
  SpriteTextRenderer,
  Subject,
  Text,
  TextureLoader,
} from '../core';
import { SpriteFontConfigSchema } from '../font';
import { ConfigParser } from '../ConfigParser';

import { MenuSelector } from './MenuSelector';

import * as fontJSON from '../../data/fonts/sprite-font.json';

const MENU_ITEMS = ['1 PLAYER', '2 PLAYERS', 'CONSTRUCTION'];
const MENU_ITEM_HEIGHT = 52;

export class Menu extends GameObject {
  public selected = new Subject<number>();
  private readonly selector: MenuSelector;
  private selectedIndex = 0;

  constructor() {
    super(480, MENU_ITEM_HEIGHT * MENU_ITEMS.length);

    const fontConfig = ConfigParser.parse<SpriteFontConfig>(
      fontJSON,
      SpriteFontConfigSchema,
    );
    const texture = TextureLoader.load('data/fonts/sprite-font.png');
    const font = new SpriteFont(fontConfig, texture);

    MENU_ITEMS.forEach((menuItemText, index) => {
      const text = new Text(menuItemText, font, {
        scale: 4,
      });
      const textRenderer = new SpriteTextRenderer(text);
      textRenderer.alignment = Alignment.MiddleLeft;

      const menuItem = new GameObject(text.getWidth(), MENU_ITEM_HEIGHT);
      menuItem.renderer = textRenderer;
      menuItem.position.set(96, index * MENU_ITEM_HEIGHT);

      this.add(menuItem);
    });

    this.selector = new MenuSelector(MENU_ITEM_HEIGHT);
    this.add(this.selector);
  }

  public update(updateArgs: GameObjectUpdateArgs): void {
    const { input } = updateArgs;

    if (input.isDown(KeyboardKey.S)) {
      this.selectNext();
      this.updateSelector();
    } else if (input.isDown(KeyboardKey.W)) {
      this.selectPrev();
      this.updateSelector();
    }

    if (input.isDown(KeyboardKey.Space)) {
      this.selected.notify(this.selectedIndex);
    }
  }

  private updateSelector(): void {
    this.selector.position.setY(this.selector.size.height * this.selectedIndex);
  }

  private selectPrev(): void {
    let nextIndex = this.selectedIndex - 1;
    if (nextIndex < 0) {
      nextIndex = MENU_ITEMS.length - 1;
    }
    this.selectedIndex = nextIndex;
  }

  private selectNext(): void {
    let nextIndex = this.selectedIndex + 1;
    if (nextIndex > MENU_ITEMS.length - 1) {
      nextIndex = 0;
    }
    this.selectedIndex = nextIndex;
  }
}
