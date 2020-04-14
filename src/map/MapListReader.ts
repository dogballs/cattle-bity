import { Subject } from '../core';

import { MapConfig } from './MapConfig';

export abstract class MapListReader {
  public readonly loaded = new Subject<MapConfig>();
  public readonly error = new Subject<Error>();

  abstract readAsync(levelNumber: number): void;
  abstract getCount(): number;
}
