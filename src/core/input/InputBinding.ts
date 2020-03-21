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
}
