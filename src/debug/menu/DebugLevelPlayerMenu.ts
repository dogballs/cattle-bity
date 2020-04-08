import { Subject } from '../../core';

import { DebugMenu, DebugMenuOptions } from '../DebugMenu';

export class DebugLevelPlayerMenu extends DebugMenu {
  public upgradeRequest = new Subject();

  constructor(options: DebugMenuOptions = {}) {
    super('Level Player', options);

    this.appendButton('Upgrade', this.handleUpgrade);
  }

  private handleUpgrade = (): void => {
    this.upgradeRequest.notify(null);
  };
}
