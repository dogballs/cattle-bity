import { BoundingBox } from './BoundingBox';
import { GameState } from './GameState';
import { Node } from './Node';
import { Rotation } from './Rotation';
import { Size } from './Size';
import { State } from './State';
import { Vector } from './Vector';

import { Input } from './input';
import {
  AudioLoader,
  RectFontLoader,
  SpriteFontLoader,
  SpriteLoader,
  TextureLoader,
} from './loaders';
import { Renderer } from './renderers';

export interface GameObjectUpdateArgs {
  input?: Input;
  gameState?: State<GameState>;
  audioLoader?: AudioLoader;
  rectFontLoader?: RectFontLoader;
  spriteFontLoader?: SpriteFontLoader;
  spriteLoader?: SpriteLoader;
  textureLoader?: TextureLoader;
}

export class GameObject extends Node {
  public collider = false;
  public ignorePause = false;
  public visible = true;
  public size: Size;
  public renderer: Renderer = null;
  // TODO: move pivot, position and rotation to transform object and
  // base it on scene graph
  public pivot = new Vector(0, 0);
  public position = new Vector(0, 0);
  // TODO: use rotation in scalar
  public rotation: Rotation = Rotation.Up;

  public tags: string[] = [];

  private needsSetup = true;

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
    const size = this.getComputedSize();

    const worldPivotOffset = this.getPivotOffset();
    this.traverseAncestors((parent) => {
      worldPivotOffset.add(parent.getPivotOffset());
    });

    // Top-left point of the object
    const min = worldPosition.clone().sub(worldPivotOffset);

    // Bottom-right point of the object
    const max = min.clone().add(size.toVector());

    return new BoundingBox(min, max);
  }

  public getPivotOffset(): Vector {
    const size = this.getComputedSize();
    const offset = this.pivot.clone().mult(size.toVector());

    return offset;
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

  public invokeSetup(args: GameObjectUpdateArgs): void {
    if (this.needsSetup === false) {
      return;
    }

    this.needsSetup = false;
    this.setup(args);
  }

  public invokeUpdate(args: GameObjectUpdateArgs): void {
    if (this.needsSetup === true) {
      this.needsSetup = false;
      this.setup(args);
    }

    this.update(args);
  }

  public invokeCollide(target: GameObject): void {
    // Can't collide if not setup yet
    if (this.needsSetup === true) {
      return;
    }

    this.collide(target);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected setup(args: GameObjectUpdateArgs): void {
    return undefined;
  }

  /**
   * Will be called on each game loop iteration
   * @param {GameObjectUpdateArgs}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected update(args: GameObjectUpdateArgs): void {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected collide(target: GameObject): void {
    return undefined;
  }
}
