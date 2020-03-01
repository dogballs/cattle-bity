import { MapConfig } from './MapConfig';
import { MapConfigSchema } from './MapConfigSchema';

interface MapManifestListItem {
  file: string;
}

export interface MapManifest {
  list: MapManifestListItem[];
}

export class MapLoader {
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

    const { value, error } = MapConfigSchema.validate(data);

    console.log({ value, error });

    if (error !== undefined) {
      throw error;
    }

    return value;
  }

  public getItemsCount(): number {
    return this.manifest.list.length;
  }
}
