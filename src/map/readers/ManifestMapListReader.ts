import { MapConfig } from '../MapConfig';
import { MapManifest } from '../MapManifest';
import { MapListReader } from '../MapListReader';

// Used to load out-of-the-box maps.
// Reads map list from JSON manifest. Maps are loaded over HTTP.
export class ManifestMapListReader extends MapListReader {
  private readonly manifest: MapManifest;

  constructor(manifest: MapManifest) {
    super();

    this.manifest = manifest;
  }

  public async readAsync(levelNumber: number): Promise<void> {
    const index = levelNumber - 1;
    const item = this.manifest.list[index];
    if (item === undefined) {
      this.error.notify(new Error(`Level "${levelNumber} not found`));
      return;
    }

    try {
      const response = await fetch(item.file);
      const data = await response.json();

      const config = new MapConfig();

      config.fromDto(data);

      this.loaded.notify(config);
    } catch (err) {
      this.error.notify(err);
    }
  }

  public getCount(): number {
    return this.manifest.list.length;
  }
}
