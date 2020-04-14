import { Subject } from '../Subject';

export interface FileOpenerOptions {
  multiple?: boolean;
}

const DEFAULT_OPTIONS: FileOpenerOptions = {
  multiple: false,
};

export class FileOpener {
  public opened = new Subject<globalThis.FileList>();
  private options: FileOpenerOptions;
  private fileElement: HTMLInputElement;

  constructor(options: FileOpenerOptions = {}) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);

    this.fileElement = document.createElement('input');
    this.fileElement.addEventListener('change', this.handleFileChange);
    this.fileElement.setAttribute('type', 'file');
    this.fileElement.setAttribute('multiple', this.options.multiple.toString());
  }

  public openDialog(): void {
    this.fileElement.click();
  }

  private handleFileChange = (): void => {
    const { files } = this.fileElement;

    if (files.length === 0) {
      return;
    }

    this.opened.notify(files);
  };
}
