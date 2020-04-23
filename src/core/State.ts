export class State<T> {
  public value: T;
  public previousValue: T;

  constructor(initialValue: T) {
    this.value = initialValue;
    this.previousValue = null;
  }

  public get(): T {
    return this.value;
  }

  public set(newValue: T): this {
    this.previousValue = this.value;
    this.value = newValue;

    return this;
  }

  public update(): this {
    this.previousValue = this.value;
    this.value = this.value;

    return this;
  }

  public is(value): boolean {
    return this.value === value;
  }

  public not(value): boolean {
    return this.value !== value;
  }
  public hasChanged(): boolean {
    return this.value !== this.previousValue;
  }

  public hasChangedTo(toValue: T): boolean {
    return this.value !== this.previousValue && this.value === toValue;
  }

  public hasChangedFrom(fromValue: T): boolean {
    return this.previousValue === fromValue;
  }

  public hasChangedFromTo(fromValue: T, toValue: T): boolean {
    return this.previousValue === fromValue && this.value === toValue;
  }
}
