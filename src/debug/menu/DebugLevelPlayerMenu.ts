import { Subject } from '../../core';

import { DebugMenu, DebugMenuOptions } from '../DebugMenu';

export class DebugLevelPlayerMenu extends DebugMenu {
  public deathRequest = new Subject();
  public upgradeRequest = new Subject();
  public moveSpeedUpRequest = new Subject<number>();

  constructor(options: DebugMenuOptions = {}) {
    super('Level Player', options);

    this.appendButton('Upgrade', this.handleUpgrade);
    this.appendButton('Die', this.handleDeath);
    this.appendButton('Speed +500', this.handleMoveSpeedUp);
  }

  private handleDeath = (): void => {
    this.deathRequest.notify(null);
  };

  private handleMoveSpeedUp = (): void => {
    this.moveSpeedUpRequest.notify(500);
  };

  private handleUpgrade = (): void => {
    this.upgradeRequest.notify(null);
  };
}
