import * as config from '../config';

export interface DebugMenuOptions {
  top?: number;
  left?: number;
  right?: number;
}

const DEFAULT_OPTIONS = {
  top: 0,
  left: null,
  right: 0,
};

export class DebugMenu {
  protected options: DebugMenuOptions;
  protected container: HTMLElement;

  constructor(titleText = 'Untitled', options: DebugMenuOptions = {}) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);

    this.container = document.createElement('div');
    this.container.setAttribute(
      'style',
      `background: white;
      position: absolute;
      left: ${this.getOffsetStyle(this.options.left)};
      right: ${this.getOffsetStyle(this.options.right)};
      top: ${this.getOffsetStyle(this.options.top)};
      padding: 10px;
      display: flex;
      flex-direction: column`,
    );

    const title = document.createElement('div');
    title.textContent = titleText;
    this.container.appendChild(title);
  }

  public attach(): void {
    if (config.IS_PROD) {
      return;
    }

    document.body.appendChild(this.container);
  }

  public detach(): void {
    document.body.removeChild(this.container);
  }

  protected appendButton(text: string, handler: () => void): HTMLButtonElement {
    const button = this.createButton(text, handler);
    this.container.appendChild(button);
    return button;
  }

  protected createButton(text: string, handler: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', handler);
    return button;
  }

  private getOffsetStyle(value): string {
    if (value === null) {
      return 'initial';
    }
    return `${value}px`;
  }
}
