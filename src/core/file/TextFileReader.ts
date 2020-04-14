import { Logger } from '../Logger';
import { Subject } from '../Subject';

export class TextFileReader<T = string> {
  public loaded = new Subject<T>();
  public error = new Subject<Error>();
  protected log = new Logger(TextFileReader.name);

  public read(file: globalThis.File): void {
    const fileReader = new globalThis.FileReader();

    fileReader.addEventListener('load', this.handleLoad);
    fileReader.addEventListener('error', this.handleError);

    fileReader.readAsText(file);
  }

  protected onLoad(ev): void {
    const text = ev.target.result as T;
    this.loaded.notify(text);
  }

  protected throwError(err): void {
    this.log.error('Error:', err);
    this.error.notify(err);
  }

  private handleLoad = (ev): void => {
    this.onLoad(ev);
  };

  private handleError = (): void => {
    this.throwError(new Error('Failed to read'));
  };
}
