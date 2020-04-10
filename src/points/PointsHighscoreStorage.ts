import { Storage } from '../core';
import * as config from '../config';

export class PointsHighscoreStorage {
  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  public getPrimaryPoints(): number {
    const json = this.storage.get(config.STORAGE_KEY_HIGHSCORE_PRIMARY);
    const points = Number(json) || 0;

    return points;
  }

  public savePrimaryPoints(points: number): void {
    const json = points.toString();

    this.storage.set(config.STORAGE_KEY_HIGHSCORE_PRIMARY, json);
    this.storage.save();
  }
}
