/* eslint-disable @typescript-eslint/no-explicit-any */

export enum LogLevel {
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  None = 5,
}

export class Logger {
  public static Level = LogLevel;

  public readonly tag: string;
  public level: LogLevel;

  constructor(tag = '', level: LogLevel = LogLevel.Error) {
    this.tag = tag ? `[${tag}]` : '';
    this.level = level;
  }

  public setLevel(level: LogLevel): this {
    this.level = level;

    return this;
  }

  public debug(...args: any[]): void {
    // TODO: check for prod build
    if (this.level > LogLevel.Debug) {
      return;
    }
    console.log(...this.composeArgs(...args));
  }

  public info(...args: any[]): void {
    if (this.level > LogLevel.Info) {
      return;
    }
    console.log(...this.composeArgs(...args));
  }

  public warn = (...args: any[]): void => {
    if (this.level > LogLevel.Warn) {
      return;
    }
    console.warn(...this.composeArgs(...args));
  };

  public error = (...args: any[]): void => {
    if (this.level > LogLevel.Error) {
      return;
    }
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
    const args = [];

    if (typeof message === 'string') {
      const taggedMessage = `${this.tag} ${message}`;
      args.push(taggedMessage);
    } else {
      args.push(this.tag, message);
    }

    args.push(...optionalParams);

    return args;
  }
}
