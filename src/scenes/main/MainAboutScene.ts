import { Scene } from '../../core';
import { GameUpdateArgs } from '../../game';
import {
  MenuDescription,
  SceneMenuTitle,
  SceneMenu,
  TextMenuItem,
} from '../../gameObjects';
import * as config from '../../config';

export class MainAboutScene extends Scene {
  private title: SceneMenuTitle;
  private description: MenuDescription;
  private menu: SceneMenu;
  private githubItem: TextMenuItem;
  private backItem: TextMenuItem;

  protected setup(): void {
    this.title = new SceneMenuTitle('ABOUT');
    this.root.add(this.title);

    this.description = new MenuDescription(
      'SELF-EDUCATIONAL CLONE OF\nBATTLE CITY BY NAMCO (1985)',
    );
    this.description.position.set(16, 180);
    this.root.add(this.description);

    this.githubItem = new TextMenuItem('GITHUB');
    this.githubItem.selected.addListener(this.handleGithubSelected);

    this.backItem = new TextMenuItem('BACK');
    this.backItem.selected.addListener(this.handleBackSelected);

    const menuItems = [this.githubItem, this.backItem];

    this.menu = new SceneMenu();
    this.menu.position.addY(164);
    this.menu.setItems(menuItems);
    this.root.add(this.menu);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    this.root.traverseDescedants((child) => {
      child.invokeUpdate(updateArgs);
    });
  }

  private handleGithubSelected = (): void => {
    this.openURL(config.GITHUB_URL);
  };

  private handleBackSelected = (): void => {
    this.navigator.back();
  };

  private openURL(url: string): void {
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('target', '_blank');
    linkElement.click();
  }
}
