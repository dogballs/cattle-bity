import { Subject } from '../../core';
import { LevelWorld } from '../../level';
import { PowerupGrid, PowerupType } from '../../powerup';
import * as config from '../../config';

import { DebugGrid } from '../DebugGrid';
import { DebugMenu, DebugMenuOptions } from '../DebugMenu';

export class DebugLevelPowerupMenu extends DebugMenu {
  public spawnRequest = new Subject<PowerupType>();
  private levelWorld: LevelWorld;
  private powerupGrid: PowerupGrid;
  private debugGrid: DebugGrid;

  constructor(
    levelWorld: LevelWorld,
    powerupGrid: PowerupGrid,
    options: DebugMenuOptions = {},
  ) {
    super('Level Powerup', options);

    this.levelWorld = levelWorld;
    this.powerupGrid = powerupGrid;

    this.debugGrid = new DebugGrid(
      config.FIELD_SIZE,
      config.FIELD_SIZE,
      config.TILE_SIZE_MEDIUM,
    );

    this.appendButton('Show grid', this.handleGridShow);
    this.appendButton('Hide grid', this.handleGridHide);
    this.appendButton('Update grid', this.handleGridUpdate);
    this.appendButton('Spawn', this.handleSpawn);
    this.appendButton('Spawn: freeze', this.handleSpawnFreeze);
  }

  public showGrid(): void {
    this.levelWorld.field.add(this.debugGrid);
    this.updateDebugGrid();
  }

  public updateDebugGrid(): void {
    this.debugGrid.removeAllCellHighlights();

    const blockedCellIndexes = this.powerupGrid.getBlockedCellIndexes();
    blockedCellIndexes.forEach((cellIndex) => {
      this.debugGrid.highlightCell(cellIndex);
    });
  }

  private handleGridShow = (): void => {
    this.showGrid();
  };

  private handleGridUpdate = (): void => {
    this.updateDebugGrid();
  };

  private handleGridHide = (): void => {
    this.debugGrid.removeSelf();
  };

  private handleSpawn = (): void => {
    this.spawnRequest.notify(null);
  };

  private handleSpawnFreeze = (): void => {
    this.spawnRequest.notify(PowerupType.Freeze);
  };
}
