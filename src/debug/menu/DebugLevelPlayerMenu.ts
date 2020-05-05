import { Subject } from '../../core';

import { DebugMenu, DebugMenuOptions } from '../DebugMenu';

export class DebugLevelPlayerMenu extends DebugMenu {
  public deathRequest = new Subject<number>();
  public upgradeRequest = new Subject<number>();
  public moveSpeedUpRequest = new Subject<{
    playerIndex: number;
    speed: number;
  }>();

  constructor(options: DebugMenuOptions = {}) {
    super('Level Player', options);

    this.appendButton('#1 Upgrade', () => this.requestUpgrade(0));
    this.appendButton('#1 Die', () => this.requestDeath(0));
    this.appendButton('#1 Speed +500', () => this.requestMoveSpeedUp(0));
    this.appendButton('#2 Upgrade', () => this.requestUpgrade(1));
    this.appendButton('#2 Die', () => this.requestDeath(1));
    this.appendButton('#2 Speed +500', () => this.requestMoveSpeedUp(1));
  }

  private requestDeath = (playerIndex: number): void => {
    this.deathRequest.notify(playerIndex);
  };

  private requestMoveSpeedUp = (playerIndex: number): void => {
    this.moveSpeedUpRequest.notify({ playerIndex, speed: 500 });
  };

  private requestUpgrade = (playerIndex: number): void => {
    this.upgradeRequest.notify(playerIndex);
  };
}
