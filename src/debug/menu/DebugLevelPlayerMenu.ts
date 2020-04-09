import { Subject } from '../../core';

import { DebugMenu, DebugMenuOptions } from '../DebugMenu';

export class DebugLevelPlayerMenu extends DebugMenu {
  public deathRequest = new Subject();
  public upgradeRequest = new Subject();

  constructor(options: DebugMenuOptions = {}) {
    super('Level Player', options);

    this.appendButton('Upgrade', this.handleUpgrade);
    this.appendButton('Die', this.handleDeath);
  }

  private handleDeath = (): void => {
    this.deathRequest.notify(null);
  };

  private handleUpgrade = (): void => {
    this.upgradeRequest.notify(null);
  };
}
