export class State<T> {
  public value: T;
  public previousValue: T;

  constructor(initialValue: T) {
    this.value = initialValue;
    this.previousValue = null;
  }

  public set(newValue: T): this {
    this.previousValue = this.value;
    this.value = newValue;

    return this;
  }

  public tick(): this {
    this.previousValue = this.value;
    this.value = this.value;

    return this;
  }

  public is(value): boolean {
    return this.value === value;
  }

  public hasChangedTo(toValue: T): boolean {
    return this.value !== this.previousValue && this.value === toValue;
  }

  public hasChangedFromTo(fromValue: T, toValue: T): boolean {
    return this.previousValue === fromValue && this.value === toValue;
  }
}
