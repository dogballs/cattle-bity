import { MapConfig } from '../MapConfig';
import { MapListReader } from '../MapListReader';

// Use to load maps from in-memory map configs.
// Used in editor to playtest the map.
export class MemoryMapListReader extends MapListReader {
  private mapConfigs: MapConfig[];

  constructor(mapConfigs: MapConfig[]) {
    super();

    this.mapConfigs = mapConfigs;
  }

  public readAsync(levelNumber: number): void {
    const index = levelNumber - 1;

    const mapConfig = this.mapConfigs[index];
    if (mapConfig === undefined) {
      this.error.notify(new Error(`Level "${levelNumber} not found`));
      return;
    }

    this.loaded.notify(mapConfig);
  }

  public getCount(): number {
    return this.mapConfigs.length;
  }
}
