export class LocalStorage {
  private namespace: string;
  private cache = {};

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  public set(key: string, value: string): void {
    this.cache[key] = value;
  }

  public get(key: string): string {
    return this.cache[key];
  }

  public load(): void {
    const json = window.localStorage.getItem(this.namespace);

    let data;
    try {
      data = JSON.parse(json);
    } catch (err) {
      // Ignore error
    }

    // In case there is something else stored in that namespace
    if (typeof data !== 'object') {
      data = {};
    }

    this.cache = data;
  }

  public persist(): void {
    const json = JSON.stringify(this.cache);

    window.localStorage.setItem(this.namespace, json);
  }
}
