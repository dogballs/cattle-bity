export class PathUtils {
  public static join(...paths: string[]): string {
    return paths.map(this.trim).join('/');
  }

  public static trim(path: string): string {
    return path.replace(/\/+$/, '').replace(/^\/+/, '');
  }
}
