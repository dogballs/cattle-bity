import {
  Alignment,
  Animation,
  Collision,
  GameObject,
  SpritePainter,
  State,
  Subject,
  SweptBoxCollider,
  Timer,
} from '../core';
import { GameState, GameUpdateArgs, Rotation, Tag } from '../game';
import {
  TankAnimationFrame,
  TankAttributes,
  TankAttributesFactory,
  TankBehavior,
  TankDeathReason,
  TankSkinAnimation,
  TankType,
} from '../tank';
import * as config from '../config';

import { Bullet } from './Bullet';
import { Shield } from './Shield';

export enum TankState {
  Uninitialized,
  Idle,
  Moving,
}

const SKIN_LAYER_DESCRIPTIONS = [{ opacity: 1 }, { opacity: 0.5 }];
const RAPID_FIRE_DELAY = 0.04;
const SNAP_SIZE = config.TILE_SIZE_MEDIUM;

export class Tank extends GameObject {
  public collider = new SweptBoxCollider(this, true);
  public tags = [Tag.Tank];
  public zIndex = config.PLAYER_TANK_Z_INDEX;
  public type: TankType;
  public behavior: TankBehavior;
  public attributes: TankAttributes;
  public skinAnimation: TankSkinAnimation;
  public bullets: Bullet[] = [];
  public shield: Shield = null;
  public fired = new Subject();
  public died = new Subject<{ reason: TankDeathReason }>();
  public hit = new Subject();
  public state = TankState.Uninitialized;
  public freezeState = new State<boolean>(false);
  protected shieldTimer = new Timer();
  protected animation: Animation<TankAnimationFrame>;
  protected skinLayers: GameObject[] = [];
  private lastFireTimer = new Timer();

  constructor(type: TankType, behavior: TankBehavior) {
    super(64, 64);

    this.pivot.set(0.5, 0.5);

    this.type = type;
    this.behavior = behavior;

    this.attributes = TankAttributesFactory.create(this.type);

    this.shieldTimer.done.addListener(this.handleShieldTimer);
  }

  protected setup(updateArgs: GameUpdateArgs): void {
    const { collisionSystem } = updateArgs;

    collisionSystem.register(this.collider);

    this.behavior.setup(this, updateArgs);

    SKIN_LAYER_DESCRIPTIONS.forEach(() => {
      const layer = new GameObject();
      layer.size.copyFrom(this.size);

      const painter = new SpritePainter();
      painter.alignment = Alignment.MiddleCenter;

      layer.painter = painter;

      this.skinLayers.push(layer);

      this.add(layer);
    });
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { deltaTime, gameState } = updateArgs;

    this.shieldTimer.update(deltaTime);

    const shouldIdle =
      this.freezeState.hasChangedTo(true) ||
      gameState.hasChangedTo(GameState.Paused);

    if (shouldIdle) {
      this.idle();
    }

    const isIdle = this.freezeState.is(true) || gameState.is(GameState.Paused);

    // Only update animation when idle
    if (isIdle) {
      this.updateAnimation(deltaTime);
      return;
    }

    this.behavior.update(this, updateArgs);

    this.lastFireTimer.update(deltaTime);

    this.updateAnimation(deltaTime);

    this.collider.update();
  }

  protected updateAnimation(deltaTime: number): void {
    this.skinAnimation.update(this, deltaTime);
    const frame = this.skinAnimation.getCurrentFrame();

    this.skinLayers.forEach((layer, index) => {
      const description = SKIN_LAYER_DESCRIPTIONS[index];

      const painter = layer.painter as SpritePainter;
      const sprite = frame.getSprite(index);

      painter.opacity = description.opacity;
      painter.sprite = sprite;
    });
  }

  protected collide(collision: Collision): void {
    const blockMoveContacts = [];

    for (const contact of collision.contacts) {
      if (contact.collider.object.tags.includes(Tag.BlockMove)) {
        blockMoveContacts.push(contact);
      }
    }

    // Find closest wall we are colliding with. It solves "tunneling" problem
    // if tank is going too fast it can jump over some small tiles of walls.
    // By using swept box collider and then finding closest points of contact,
    // we make tank interact with the first object on the way.
    // Tank can also hit multiple block at the same time.
    let minDistance = null;

    for (const contact of blockMoveContacts) {
      const prevBox = this.collider.getPrevBox();
      const distance = prevBox.distanceCenterToCenter(contact.box);

      if (minDistance === null || distance < minDistance) {
        minDistance = distance;
      }
    }

    const closestBlockMoveContacts = [];

    for (const contact of blockMoveContacts) {
      const prevBox = this.collider.getPrevBox();
      const distance = prevBox.distanceCenterToCenter(contact.box);

      if (distance === minDistance) {
        closestBlockMoveContacts.push(contact);
      }
    }

    // Most likely it collides with multiple brick when going front and they
    // are positioned in one line near each other. So it will be enough to
    // resolve just one collision of them all.
    if (closestBlockMoveContacts.length > 0) {
      const firstBlockMoveContact = closestBlockMoveContacts[0];

      const selfWorldBox = this.collider.getCurrentBox();
      const otherWorldBox = firstBlockMoveContact.box;

      const rotation = this.getWorldRotation();

      // Tied to axis. Reset opposite axis direction so only primary axis
      // will be resolved. Otherwise it conflicts with #rotate() code which
      // aligns tank to a grid during rotation.
      // Snap to avoid situations when between two walls opposite each other,
      // and tank is colliding with right wall, collider pushes tank back to
      // left wall, and wrong resolution branch is applied. Stick tank to grid.
      if (rotation == Rotation.Up) {
        this.position.addY(otherWorldBox.max.y - selfWorldBox.min.y);
        this.position.snapY(SNAP_SIZE);
      } else if (rotation === Rotation.Down) {
        this.position.addY(otherWorldBox.min.y - selfWorldBox.max.y);
        this.position.snapY(SNAP_SIZE);
      } else if (rotation === Rotation.Left) {
        this.position.addX(otherWorldBox.max.x - selfWorldBox.min.x);
        this.position.snapX(SNAP_SIZE);
      } else if (rotation === Rotation.Right) {
        this.position.addX(otherWorldBox.min.x - selfWorldBox.max.x);
        this.position.snapX(SNAP_SIZE);
      }
      this.updateMatrix(true);

      // Make sure to update collider
      this.collider.update();
    }

    const bulletContacts = collision.contacts.filter((contact) => {
      return contact.collider.object.tags.includes(Tag.Bullet);
    });

    bulletContacts.forEach((contact) => {
      const bullet = contact.collider.object as Bullet;

      // Prevent self-destruction
      if (this.bullets.includes(bullet)) {
        return;
      }

      // If tank has shield - swallow the bullet
      if (this.shield !== null) {
        bullet.nullify();
        return;
      }

      // Enemy bullets don't affect enemy tanks
      if (bullet.tags.includes(Tag.Enemy) && this.tags.includes(Tag.Enemy)) {
        return;
      }

      bullet.explode();

      this.receiveHit(bullet.tankDamage);
    });
  }

  public fire(): boolean {
    if (this.bullets.length >= this.attributes.bulletMaxCount) {
      return;
    }

    // Throttle how fast next bullet comes out during rapid fire
    if (this.lastFireTimer.isActive()) {
      return;
    }

    const bullet = new Bullet(
      this.attributes.bulletSpeed,
      this.attributes.bulletTankDamage,
      this.attributes.bulletWallDamage,
    );

    // First, add bullet inside a tank and position it at the north center
    // of the tank (where the gun is). Bullet will inherit tank's rotation.

    // Update tank position
    this.updateWorldMatrix(true);
    // Add bullet - it will inherit rotation
    this.add(bullet);
    // Make sure rotation is in matrix
    bullet.updateMatrix();
    // Position bullet
    bullet.setCenter(this.getSelfCenter());
    bullet.translateY(this.size.height / 2 - bullet.size.height / 2);
    bullet.updateMatrix();

    // Then, detach bullet from a tank and move it to a field
    this.parent.attach(bullet);

    if (this.tags.includes(Tag.Player)) {
      bullet.tags.push(Tag.Player);
    } else if (this.tags.includes(Tag.Enemy)) {
      bullet.tags.push(Tag.Enemy);
    }

    this.bullets.push(bullet);

    bullet.died.addListener(() => {
      this.bullets = this.bullets.filter((tankBullet) => {
        return tankBullet !== bullet;
      });
    });

    this.fired.notify(null);

    this.lastFireTimer.reset(RAPID_FIRE_DELAY);

    return true;
  }

  public move(deltaTime: number): void {
    if (this.state !== TankState.Moving) {
      this.state = TankState.Moving;
    }

    this.translateY(this.attributes.moveSpeed * deltaTime);
    this.updateMatrix(true);
  }

  public idle(): void {
    if (this.state !== TankState.Idle) {
      this.state = TankState.Idle;
    }
  }

  public rotate(rotation: Rotation): this {
    // When tank is rotating align it to grid. It is needed to:
    // - simplify user navigation when moving into narrow passages; without it
    //   user will be stuck on corners

    if (rotation !== this.rotation) {
      if (rotation === Rotation.Up || rotation === Rotation.Down) {
        this.position.snapX(SNAP_SIZE);
      } else if (rotation === Rotation.Left || rotation === Rotation.Right) {
        this.position.snapY(SNAP_SIZE);
      }
    }

    super.rotate(rotation);

    return this;
  }

  public die(reason: TankDeathReason = TankDeathReason.Bullet): void {
    this.died.notify({ reason });
    this.collider.unregister();
  }

  public activateShield(duration: number): void {
    if (this.shield !== null) {
      this.shield.removeSelf();
      this.shieldTimer.stop();
      this.shield = null;
    }

    this.shield = new Shield();
    this.shield.updateMatrix();
    this.shield.setCenter(this.getSelfCenter());

    this.add(this.shield);

    this.shieldTimer.reset(duration);
  }

  public isAlive(): boolean {
    return this.attributes.health > 0;
  }

  protected receiveHit(damage: number): void {
    this.attributes.health = Math.max(0, this.attributes.health - damage);

    this.hit.notify(null);

    if (!this.isAlive()) {
      this.die();
    }
  }

  private handleShieldTimer = (): void => {
    this.shield.removeSelf();
    this.shield = null;
  };
}
