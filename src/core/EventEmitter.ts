// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Listener = (...args: any[]) => any;

export class EventEmitter {
  private map: Map<string, Listener[]> = new Map();

  public on(name: string, listenerToAdd: Listener): this {
    const listeners = this.map.get(name) || [];

    const nextListeners = listeners.concat([listenerToAdd]);

    this.map.set(name, nextListeners);

    return this;
  }

  public off(name: string, listenerToRemove: Listener): this {
    const listeners = this.map.get(name);
    if (!listeners) {
      return this;
    }

    const nextListeners = listeners.filter((listener) => {
      return listener !== listenerToRemove;
    });

    this.map.set(name, nextListeners);

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected emit(name: string, ...args: any[]): this {
    const listeners = this.map.get(name);
    if (!listeners) {
      return this;
    }

    listeners.forEach((listener) => {
      // TODO: handle error inside listener
      listener(...args);
    });

    return this;
  }
}
