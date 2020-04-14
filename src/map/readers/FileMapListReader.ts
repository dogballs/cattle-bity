import { MapFileReader } from '../MapFileReader';
import { MapListReader } from '../MapListReader';

// Used to load user maps from files system via browser file dialog.
// Use in combination with core/FileOpener.
export class FileMapListReader extends MapListReader {
  private files: globalThis.File[];
  private fileReader: MapFileReader;

  constructor(files: globalThis.FileList) {
    super();

    const fileList = Array.from(files);

    // Sort by filename alphabetically
    fileList.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    this.files = fileList;
  }

  public async readAsync(levelNumber: number): Promise<void> {
    const index = levelNumber - 1;

    const file = this.files[index];
    if (file === undefined) {
      this.error.notify(new Error(`Level "${levelNumber} not found`));
      return;
    }

    const fileReader = new MapFileReader();

    fileReader.loaded.addListenerOnce((mapConfig) => {
      this.loaded.notify(mapConfig);
    });

    fileReader.error.addListenerOnce((err) => {
      this.error.notify(err);
    });

    fileReader.read(file);
  }

  public getCount(): number {
    return this.files.length;
  }
}
