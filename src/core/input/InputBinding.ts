export class InputBinding {
  private default = new Map<number, number>();
  private custom = new Map<number, number>();

  public setDefault(control: number, code: number): void {
    this.default.set(control, code);
  }

  public setCustom(control: number, code: number): void {
    this.custom.set(control, code);
  }

  public get(control: number): number {
    if (this.custom.has(control)) {
      return this.custom.get(control);
    }
    return this.default.get(control);
  }

  public resetAllToDefault(): void {
    this.custom.clear();
  }

  public toJSON(): string {
    const pairs = [];

    // Save only custom bindings
    this.custom.forEach((code, control) => {
      pairs.push([control, code]);
    });

    const json = JSON.stringify(pairs);

    return json;
  }

  public fromJSON(json: string): void {
    let pairs = [];

    try {
      pairs = JSON.parse(json);
    } catch (err) {
      // Ignore parse error
    }

    if (!Array.isArray(pairs)) {
      return;
    }

    pairs.forEach((pair) => {
      if (!Array.isArray(pair)) {
        return;
      }

      const [control, code] = pair;

      this.custom.set(control, code);
    });
  }
}
