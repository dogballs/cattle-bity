import { GameObject, RectPainter, Subject } from '../../core';
import { Menu, TextMenuItem, SpriteText } from '../../gameObjects';
import * as config from '../../config';

export interface ConfirmModalOptions {
  containerWidth?: number;
  containerHeight?: number;
  message?: string;
  acceptText?: string;
  declineText?: string;
}

const DEFAULT_OPTIONS: ConfirmModalOptions = {
  containerWidth: 512,
  containerHeight: 256,
  message: 'ARE YOU SURE?',
  acceptText: 'YES',
  declineText: 'NO',
};

export class ConfirmModal extends GameObject {
  public painter = new RectPainter(config.COLOR_BACKDROP);
  public accepted = new Subject();
  public declined = new Subject();
  private options: ConfirmModalOptions;
  private container: GameObject;
  private text: SpriteText;
  private acceptItem: TextMenuItem;
  private declineItem: TextMenuItem;
  private menu: Menu;

  constructor(options: ConfirmModalOptions = {}) {
    super();

    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  public resetSelection(): void {
    this.menu.reset();
  }

  protected setup(): void {
    this.container = new GameObject(
      this.options.containerWidth,
      this.options.containerHeight,
    );
    this.container.painter = new RectPainter(
      config.COLOR_GRAY,
      config.COLOR_WHITE,
    );
    this.container.updateMatrix();
    this.container.setCenter(this.getSelfCenter());
    this.add(this.container);

    this.text = new SpriteText(this.options.message, {
      color: config.COLOR_WHITE,
    });
    this.text.setCenterX(this.container.getSelfCenter().x);
    this.text.origin.setX(0.5);
    this.text.position.setY(16);
    this.container.add(this.text);

    this.acceptItem = new TextMenuItem(this.options.acceptText);
    this.acceptItem.selected.addListener(this.handleAcceptSelected);

    this.declineItem = new TextMenuItem(this.options.declineText);
    this.declineItem.selected.addListener(this.handleDeclineSelected);

    const menuItems = [this.acceptItem, this.declineItem];

    this.menu = new Menu();
    this.menu.position.set(16, 128);
    this.menu.setItems(menuItems);
    this.container.add(this.menu);
  }

  private handleAcceptSelected = (): void => {
    this.accepted.notify(null);
  };

  private handleDeclineSelected = (): void => {
    this.declined.notify(null);
  };
}
