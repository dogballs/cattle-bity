/* eslint-disable @typescript-eslint/no-explicit-any */

export class Logger {
  public readonly tag: string;

  constructor(tag = '') {
    this.tag = tag ? `[${tag}]` : '';
  }

  public info(...args: any[]): void {
    console.log(...this.composeArgs(...args));
  }

  public debug(...args: any[]): void {
    // TODO: check for prod build
    console.log(...this.composeArgs(...args));
  }

  public warn = (...args: any[]): void => {
    console.warn(...this.composeArgs(...args));
  };

  public error = (...args: any[]): void => {
    console.error(...this.composeArgs(...args));
  };

  public time = (mark: string): void => {
    console.time(`${this.tag} ${mark}`);
  };

  public timeEnd = (mark: string): void => {
    console.timeEnd(`${this.tag} ${mark}`);
  };

  /**
   * First argument to console.log-like methods supports formatting like %s.
   * Check if it is a string and append custom tag to it.
   */
  private composeArgs(message?: any, ...optionalParams: any[]): any[] {
    let taggedMessage = this.tag;
    if (typeof message === 'string') {
      taggedMessage = `${this.tag} ${message}`;
    }

    const args = [taggedMessage, ...optionalParams];

    return args;
  }
}
