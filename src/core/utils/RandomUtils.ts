export class RandomUtils {
  public static arrayElement<T>(values: T[]): T {
    const index = this.number(0, values.length);
    return values[index];
  }

  // [min, max) - min inclusive, max exclusive
  public static number(min = 0, max = 100): number {
    // TODO: use custom algorithm
    return min + Math.floor(Math.random() * (max - min));
  }

  public static probability(chancePercent: number): boolean {
    const num = this.number(1, 100);
    const hasChance = num <= chancePercent;

    return hasChance;
  }
}
