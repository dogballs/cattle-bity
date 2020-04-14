import * as config from '../../../config';

import { SpriteTextOptions } from '../../text';

import { TextMenuItem } from './TextMenuItem';

const DEFAULT_OPTIONS: SpriteTextOptions = {
  color: config.COLOR_GRAY,
};

export class DividerMenuItem extends TextMenuItem {
  constructor(argOptions: SpriteTextOptions = {}) {
    const options = Object.assign({}, DEFAULT_OPTIONS, argOptions);

    super('-', options);

    this.focusable = false;
  }
}
