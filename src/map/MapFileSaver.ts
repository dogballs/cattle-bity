import { MapConfig } from './MapConfig';

export class MapFileSaver {
  public saveToFile(mapConfig: MapConfig): void {
    const json = mapConfig.toJSON();
    const jsonEncoded = window.encodeURIComponent(json);

    const dataStr = `data:text/json;charset=utf-8,${jsonEncoded}`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataStr);
    linkElement.setAttribute('download', 'map.json');
    linkElement.click();
  }
}
