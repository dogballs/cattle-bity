export class Dimensions {
  public width: number;
  public height: number;

  constructor(width = 0, height = 0) {
    this.width = width;
    this.height = height;
  }

  public set(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}
