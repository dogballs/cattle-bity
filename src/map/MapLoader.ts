import { Subject } from '../core';
import { MapConfig } from './MapConfig';

interface MapManifestListItem {
  file: string;
}

export interface MapManifest {
  list: MapManifestListItem[];
}

export class MapLoader {
  public readonly loaded = new Subject<MapConfig>();
  private readonly manifest: MapManifest;

  constructor(manifest: MapManifest) {
    this.manifest = manifest;
  }

  public async loadAsync(levelNumber: number): Promise<MapConfig> {
    const index = levelNumber - 1;
    const item = this.manifest.list[index];
    if (item === undefined) {
      throw new Error(`Level "${levelNumber} not defined`);
    }

    const response = await fetch(item.file);
    const data = await response.json();

    const config = new MapConfig();

    config.fromDto(data);

    this.loaded.notify(config);

    return config;
  }

  public getItemsCount(): number {
    return this.manifest.list.length;
  }
}
