export class FileSaver {
  public saveJSON(json: string, fileName = 'file.json'): void {
    const jsonEncoded = window.encodeURIComponent(json);

    const dataStr = `data:text/json;charset=utf-8,${jsonEncoded}`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataStr);
    linkElement.setAttribute('download', fileName);
    linkElement.click();
  }
}
