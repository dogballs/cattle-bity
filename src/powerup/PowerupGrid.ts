import { RandomUtils, Rect, Vector } from '../core';
import * as config from '../config';

// Grid for calculating zones where powerup can spawn. It should not spawn
// in player-unreachable and gameplay conflicting areas, which are:
// - tank spawns
// - player base
// - water and steel tiles
// These areas should be denied on level start. While playing, player can
// destroy steel tiles, grid should be update accordingly, so powerup could
// spawn in freed areas.
// Note, that this grid does not check if player pathing is available to reach
// spawned powerup. It is up to level designer to not create unreachable areas.
//
// Powerup size is large (64x64)
// For grid we are using medium size (32x32), because the least powerup-blocking
// tile size is medium (steel, water).
// Powerup can't spawn if all four medium tiles are blocked, but if any of them
// are free, user will be able to pick it up.
//
// Rows    - y axis
// Columns - x axis
//
// Use can use DebugGrid to visualize denied tiles.

export class PowerupGrid {
  private rowCount: number;
  private colCount: number;
  private tileSize: number;
  private grid: boolean[][] = [];
  private backupGrid: boolean[][] = null;

  constructor() {
    this.tileSize = config.TILE_SIZE_MEDIUM;
    this.rowCount = config.FIELD_SIZE / this.tileSize;
    this.colCount = config.FIELD_SIZE / this.tileSize;

    for (let rowIndex = 0; rowIndex < this.colCount; rowIndex += 1) {
      this.grid[rowIndex] = [];

      for (let colIndex = 0; colIndex < this.rowCount; colIndex += 1) {
        this.grid[rowIndex][colIndex] = true;
      }
    }
  }

  public blockCell(rowIndex: number, colIndex: number): void {
    this.toggleCell(rowIndex, colIndex, false);
  }

  public freeCell(rowIndex: number, colIndex: number): void {
    this.toggleCell(rowIndex, colIndex, true);
  }

  public blockRect(rect: Rect): void {
    this.toggleRect(rect, false);
  }

  public freeRect(rect: Rect): void {
    this.toggleRect(rect, true);
  }

  public toggleCell(rowIndex: number, colIndex: number, isFree: boolean): void {
    this.grid[rowIndex][colIndex] = isFree;
  }

  public toggleRect(rect: Rect, isFree: boolean): void {
    // Find indexes of cells which should be disabled
    const minIndex = new Vector(
      Math.max(0, Math.floor(rect.x / this.tileSize)),
      Math.max(0, Math.floor(rect.y / this.tileSize)),
    );
    const maxIndex = new Vector(
      Math.min(this.rowCount, Math.ceil((rect.x + rect.width) / this.tileSize)),
      Math.min(
        this.colCount,
        Math.ceil((rect.y + rect.height) / this.tileSize),
      ),
    );

    for (let rowIndex = minIndex.y; rowIndex < maxIndex.y; rowIndex += 1) {
      for (let colIndex = minIndex.x; colIndex < maxIndex.x; colIndex += 1) {
        this.toggleCell(rowIndex, colIndex, isFree);
      }
    }
  }

  public getBlockedCellIndexes(): Vector[] {
    const blockedCells = [];

    for (let rowIndex = 0; rowIndex < this.rowCount; rowIndex += 1) {
      for (let colIndex = 0; colIndex < this.colCount; colIndex += 1) {
        const isFree = this.grid[rowIndex][colIndex];
        if (!isFree) {
          blockedCells.push(new Vector(colIndex, rowIndex));
        }
      }
    }

    return blockedCells;
  }

  // Find all possible spawn positions for powerups. Considering that
  // their size is "large" and cell size is "medium", we are iterating
  // with overlap.
  public getFreeLargeCellIndexes(): Vector[] {
    const freeLargeCells = [];

    for (let rowIndex = 0; rowIndex < this.rowCount - 1; rowIndex += 1) {
      for (let colIndex = 0; colIndex < this.colCount - 1; colIndex += 1) {
        const isFree11 = this.grid[rowIndex][colIndex];
        const isFree12 = this.grid[rowIndex][colIndex + 1];
        const isFree21 = this.grid[rowIndex + 1][colIndex];
        const isFree22 = this.grid[rowIndex + 1][colIndex + 1];

        const isBlocked = !isFree11 && !isFree12 && !isFree21 && !isFree22;
        if (isBlocked) {
          continue;
        }

        freeLargeCells.push(new Vector(colIndex, rowIndex));
      }
    }

    return freeLargeCells;
  }

  public getRandomPosition(): Vector {
    const freeLargeCells = this.getFreeLargeCellIndexes();

    // In case all cells are blocked you need to decide what to do with powerup
    if (freeLargeCells.length === 0) {
      return null;
    }

    const index = RandomUtils.arrayElement(freeLargeCells);

    const position = index.multScalar(this.tileSize);

    return position;
  }

  public backup(): void {
    this.backupGrid = [];

    for (let rowIndex = 0; rowIndex < this.rowCount; rowIndex += 1) {
      this.backupGrid[rowIndex] = this.grid[rowIndex].slice();
    }
  }

  public restore(): void {
    if (this.backupGrid === null) {
      return;
    }

    for (let rowIndex = 0; rowIndex < this.rowCount; rowIndex += 1) {
      this.grid[rowIndex] = this.backupGrid[rowIndex].slice();
    }

    this.backupGrid = null;
  }
}
