export class ArrayUtils {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static flatten(array: any[]): any[] {
    let result = [];

    array.forEach((item) => {
      if (Array.isArray(item)) {
        result = result.concat(item);
      } else {
        result.push(item);
      }
    });

    return result;
  }
}
