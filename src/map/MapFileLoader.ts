import { Logger, Subject } from '../core';

import { MapConfig } from './MapConfig';

export class MapFileLoader {
  public loaded = new Subject<MapConfig>();
  public error = new Subject<Error>();
  protected log = new Logger(MapFileLoader.name);
  private fileElement: HTMLInputElement;
  private fileReader: FileReader;

  constructor() {
    this.fileElement = document.createElement('input');
    this.fileElement.addEventListener('change', this.handleFileChange);
    this.fileElement.setAttribute('type', 'file');
  }

  public loadFromFile(): void {
    this.fileElement.click();
  }

  private handleFileChange = (): void => {
    const { files } = this.fileElement;

    if (files.length === 0) {
      return;
    }

    const file = files[0];

    const fileReader = new FileReader();
    fileReader.addEventListener('load', (ev) => {
      const json = ev.target.result as string;

      const mapConfig = new MapConfig();

      try {
        mapConfig.fromJSON(json);
        this.loaded.notify(mapConfig);
      } catch (err) {
        this.log.error('Failed to parse', err);
        this.error.notify(err);
      }
    });

    fileReader.addEventListener('error', (ev) => {
      this.log.error('Failed to read', ev);
      this.error.notify(new Error('Failed to read'));
    });

    fileReader.readAsText(file);
  };
}
