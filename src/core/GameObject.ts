import { BoundingBox } from './BoundingBox';
import { GameState } from './GameState';
import { KeyboardInput } from './KeyboardInput';
import { Node } from './Node';
import { Rotation } from './Rotation';
import { Size } from './Size';
import { State } from './State';
import { Vector } from './Vector';

import { Renderer } from './renderers';

export interface GameObjectUpdateArgs {
  input?: KeyboardInput;
  gameState?: State<GameState>;
}

export class GameObject extends Node {
  public collider = false;
  public ignorePause = false;
  public visible = true;
  public size: Size;
  public renderer: Renderer = null;
  public position: Vector = new Vector();
  public rotation: Rotation = Rotation.Up;
  public tags: string[] = [];

  constructor(width = 0, height = 0) {
    super();

    this.size = new Size(width, height);
  }

  public getComputedSize(): Size {
    let { width, height } = this.size;

    if (this.rotation === Rotation.Right || this.rotation === Rotation.Left) {
      width = this.size.height;
      height = this.size.width;
    }

    return new Size(width, height);
  }

  public getBoundingBox(): BoundingBox {
    const { width, height } = this.getComputedSize();

    // Top-left point of the object
    const min = this.position.clone();

    // Bottom-right point of the object
    const max = min.clone().add(new Vector(width, height));

    return new BoundingBox(min, max);
  }

  public getWorldBoundingBox(): BoundingBox {
    const worldPosition = this.getWorldPosition();
    const { width, height } = this.getComputedSize();

    // Top-left point of the object
    // const min = worldPosition.clone().add(centerOffset);
    const min = worldPosition.clone();

    // Bottom-right point of the object
    const max = min.clone().add(new Vector(width, height));

    return new BoundingBox(min, max);
  }

  public getWorldPosition(): Vector {
    const worldPosition = this.position.clone();

    this.traverseAncestors((parent) => {
      worldPosition.add(parent.position);
    });

    return worldPosition;
  }

  public setWorldPosition(worldPosition: Vector): this {
    const localPosition = worldPosition.clone();

    this.traverseAncestors((parent) => {
      localPosition.sub(parent.position);
    });

    this.position.copyFrom(localPosition);

    return this;
  }

  public getCenter(): Vector {
    return this.getBoundingBox().getCenter();
  }

  public setCenter(v: Vector): this {
    const size = this.getComputedSize();

    this.position.copyFrom(v.sub(size.toVector().divideScalar(2)));

    return this;
  }

  public setCenterFrom(gameObject: GameObject): this {
    this.setCenter(gameObject.getCenter());

    return this;
  }

  public getChildrenCenter(): Vector {
    return this.size.toVector().divideScalar(2);
  }

  public rotate(rotation: Rotation): this {
    this.rotation = rotation;

    return this;
  }

  public getChildrenWithTag(argTags: string | string[]): GameObject[] {
    const objects = [];

    const tags = Array.isArray(argTags) ? argTags : [argTags];

    // TODO: These loops look like shit
    this.traverse((object) => {
      const hasAllTags = tags.every((tag) => {
        return object.tags.includes(tag);
      });

      if (hasAllTags) {
        objects.push(object);
      }
    });

    return objects;
  }

  public hasChildrenWithTag(tag: string): boolean {
    let has = false;

    this.traverse((object) => {
      if (object.tags.includes(tag)) {
        has = true;
      }
    });

    return has;
  }

  /**
   * Will be called on each game loop iteration
   * @param {GameObjectUpdateArgs}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(args: GameObjectUpdateArgs): void {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public collide(target: GameObject): void {
    return undefined;
  }
}
