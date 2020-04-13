import { BoxCollider, Collision, GameObject } from '../core';
import { GameUpdateArgs, Tag } from '../game';
import { TankBulletWallDamage } from '../tank';
import * as config from '../config';

import { TerrainTile } from './TerrainTile';

export class TerrainTileDestroyer extends GameObject {
  public readonly collider: BoxCollider;
  public readonly damage: number;

  constructor(argDamage: number) {
    const damage = Math.min(argDamage, TankBulletWallDamage.High);

    const width = config.TILE_SIZE_LARGE;
    const depth = config.TILE_SIZE_SMALL * damage;

    super(width, depth);

    this.damage = damage;
    this.collider = new BoxCollider(this, true);
  }

  protected setup({ collisionSystem }: GameUpdateArgs): void {
    collisionSystem.register(this.collider);
  }

  protected collide(collision: Collision): void {
    const { contacts } = collision;

    const tileContacts = contacts.filter((contact) => {
      return contact.collider.object.tags.includes(Tag.Wall);
    });

    // If for some reason there is no tiles left for contact, remove the
    // destroyer, because it has nothing to destroy
    if (tileContacts.length === 0) {
      this.destroy();
      return;
    }

    tileContacts.forEach((contact) => {
      const tile = contact.collider.object as TerrainTile;

      const isBrickWall = tile.tags.includes(Tag.Brick);
      const isSteelWall = tile.tags.includes(Tag.Steel);

      // TODO: this check should be a part of bullet attributes model
      const canDestroySteelWall = this.damage === TankBulletWallDamage.High;

      if (isBrickWall || (isSteelWall && canDestroySteelWall)) {
        tile.destroy();
        this.destroy();
      }
    });
  }

  private destroy(): void {
    this.removeSelf();
    this.collider.unregister();
  }
}
