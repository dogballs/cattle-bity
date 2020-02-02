// type Listener = (...args: T[]) => any;

export class Subject<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private listeners: ((event?: T) => any)[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public addListener(listenerToAdd: (event?: T) => any): this {
    this.listeners.push(listenerToAdd);

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public removeListener(listenerToRemove: (event?: T) => any): this {
    this.listeners = this.listeners.filter((listener) => {
      return listener !== listenerToRemove;
    });

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public notify(event?: T): this {
    this.listeners.forEach((listener) => {
      // TODO: handle errors
      listener(event);
    });

    return this;
  }
}
