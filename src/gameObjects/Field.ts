import { GameObject } from '../core';
import * as config from '../config';

import { Base } from './Base';

export class Field extends GameObject {
  public readonly base = new Base();

  constructor() {
    super(config.FIELD_SIZE, config.FIELD_SIZE);
  }

  protected setup(): void {
    this.base.position.set(352, 736);
    this.add(this.base);
  }
}
