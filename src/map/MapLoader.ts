import { Subject } from '../core';

import { MapConfig } from './MapConfig';
import { MapListReader } from './MapListReader';

// Container for map list readers used in the game. Readers can be switched
// in runtime, so maps can be loaded from different sources.
// If user picks default single player, we load maps from manifest over HTTP.
// If user wants custom maps from his file system, we use file reader.

export class MapLoader {
  public loaded = new Subject<MapConfig>();
  public error = new Subject<Error>();
  private defaultReader: MapListReader;
  private activeReader: MapListReader = null;

  constructor(defaultReader: MapListReader) {
    this.defaultReader = defaultReader;

    this.setListReader(defaultReader);
  }

  public setListReader(nextReader: MapListReader): void {
    // Clean up previous reader
    if (this.activeReader !== null) {
      this.activeReader.loaded.removeListener(this.handleReaderLoaded);
      this.activeReader.error.removeListener(this.handleReaderError);
    }

    this.activeReader = nextReader;
    this.activeReader.loaded.addListener(this.handleReaderLoaded);
    this.activeReader.error.addListener(this.handleReaderError);
  }

  public restoreDefaultReader(): void {
    this.setListReader(this.defaultReader);
  }

  public loadAsync(levelNumber: number): void {
    this.activeReader.readAsync(levelNumber);
  }

  public getItemsCount(): number {
    return this.activeReader.getCount();
  }

  private handleReaderLoaded = (mapConfig): void => {
    this.loaded.notify(mapConfig);
  };

  private handleReaderError = (err): void => {
    this.error.notify(err);
  };
}
