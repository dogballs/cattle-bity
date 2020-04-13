import {
  BoundingBox,
  CollisionSystem,
  GameObject,
  RectPainter,
} from '../../core';

import { DebugMenu, DebugMenuOptions } from '../DebugMenu';

export class DebugCollisionMenu extends DebugMenu {
  private collisionSystem: CollisionSystem;
  private itemsContainer: GameObject;
  private items: GameObject[] = [];
  private root: GameObject;

  constructor(
    collisionSystem: CollisionSystem,
    root: GameObject,
    options: DebugMenuOptions = {},
  ) {
    super('Collision', options);

    this.collisionSystem = collisionSystem;
    this.root = root;

    this.itemsContainer = new GameObject();

    this.appendButton('Show', this.handleShow);
    this.appendButton('Hide', this.handleHide);
    this.appendButton('Update', this.handleUpdate);
  }

  public show(): void {
    this.root.add(this.itemsContainer);
  }

  public hide(): void {
    this.root.remove(this.itemsContainer);
  }

  public update(): void {
    this.items.forEach((item) => {
      item.removeSelf();
    });
    this.items = [];

    const collisions = this.collisionSystem.getCollisions();

    collisions.forEach((collision) => {
      const selfItem = this.createItem(collision.box, 'green');
      this.items.push(selfItem);
      this.itemsContainer.add(selfItem);

      collision.contacts.forEach((contact) => {
        const otherItem = this.createItem(contact.box, 'yellow');
        this.items.push(otherItem);
        this.itemsContainer.add(otherItem);
      });
    });
  }

  private handleShow = (): void => {
    this.show();
  };

  private handleHide = (): void => {
    this.hide();
  };

  private handleUpdate = (): void => {
    this.update();
  };

  private createItem(box: BoundingBox, color: string): GameObject {
    const rect = box.toRect();
    const item = new GameObject(rect.width, rect.height);
    item.position.set(rect.x, rect.y);
    item.zIndex = 20;
    item.painter = new RectPainter(null, color);
    return item;
  }
}
