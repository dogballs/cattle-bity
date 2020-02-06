import { Animation, Rotation, Sprite } from '../core';

export abstract class TankAnimationMap {
  public abstract [Rotation.Up]: Animation<Sprite>;
  public abstract [Rotation.Down]: Animation<Sprite>;
  public abstract [Rotation.Left]: Animation<Sprite>;
  public abstract [Rotation.Right]: Animation<Sprite>;
}
