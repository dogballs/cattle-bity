import { BoundingBox } from './BoundingBox';
import { Dimensions } from './Dimensions';
import { KeyboardInput } from './KeyboardInput';
import { Material } from './Material';
import { Node } from './Node';
import { Vector } from './Vector';

enum Rotation {
  Up,
  Down,
  Left,
  Right,
}

interface GameObjectUpdateArgs {
  input: KeyboardInput;
}

export class GameObject extends Node {
  public static Rotation = Rotation;

  public dimensions: Dimensions;
  public material: Material;
  public position: Vector;
  public rotation: Rotation;

  constructor(width = 0, height = 0) {
    super();

    this.dimensions = new Dimensions(width, height);
    this.position = new Vector();
    this.rotation = Rotation.Up;
    this.material = null;
  }

  public getComputedDimensions(): Dimensions {
    let { width, height } = this.dimensions;

    if (this.rotation === Rotation.Right || this.rotation === Rotation.Left) {
      width = this.dimensions.height;
      height = this.dimensions.width;
    }

    return new Dimensions(width, height);
  }

  public getWorldBoundingBox(): BoundingBox {
    const worldPosition = this.getWorldPosition();
    const { width, height } = this.getComputedDimensions();

    const centerOffset = new Vector(-width / 2, -height / 2);

    // Top-left point of the object
    const min = worldPosition.clone().add(centerOffset);

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

  public rotate(rotation: Rotation) {
    this.rotation = rotation;
  }

  /**
   * Will be called on each game loop iteration
   * @param {GameObjectUpdateArgs}
   */
  public update(args: GameObjectUpdateArgs): void {
    return undefined;
  }
}
