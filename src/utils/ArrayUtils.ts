export class ArrayUtils {
  public static random<T>(values: T[]): T {
    return values[Math.floor(Math.random() * values.length)];
  }
}
