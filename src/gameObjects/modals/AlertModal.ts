import { GameObject, RectPainter, Subject } from '../../core';
import { Menu, TextMenuItem, SpriteText } from '../../gameObjects';
import * as config from '../../config';

export interface AlertModalOptions {
  containerWidth?: number;
  containerHeight?: number;
  message?: string;
  acceptText?: string;
}

const DEFAULT_OPTIONS: AlertModalOptions = {
  containerWidth: 512,
  containerHeight: 200,
  message: '',
  acceptText: 'OK',
};

export class AlertModal extends GameObject {
  public painter = new RectPainter(config.COLOR_BACKDROP);
  public accepted = new Subject();
  public zIndex = config.MODAL_Z_INDEX;
  private options: AlertModalOptions;
  private container: GameObject;
  private text: SpriteText = null;
  private acceptItem: TextMenuItem;
  private declineItem: TextMenuItem;
  private menu: Menu;

  constructor(options: AlertModalOptions = {}) {
    super();

    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
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

    const menuItems = [this.acceptItem];

    this.menu = new Menu();
    this.menu.setZIndex(this.zIndex + 1);
    this.menu.position.set(16, 128);
    this.menu.setItems(menuItems);
    this.container.add(this.menu);
  }

  public setText(message: string): void {
    // Setup has not been called yet
    if (this.text === null) {
      this.options.message = message;
      return;
    }

    this.text.setText(message);
  }

  private handleAcceptSelected = (): void => {
    this.accepted.notify(null);
  };
}
