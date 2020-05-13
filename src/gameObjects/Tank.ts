import {
  Animation,
  BoundingBox,
  Collision,
  CollisionContact,
  CollisionSystem,
  GameObject,
  SpriteAlignment,
  SpritePainter,
  State,
  Subject,
  SweptBoxCollider,
  Timer,
  Vector,
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

enum SpawnCollisionState {
  WaitUpdate,
  WaitCollide,
  NotColliding,
  Resolved,
}

enum PlayerCollisionState {
  NotColliding,
  Colliding,
  WaitCollide,
}

enum TankCollisionResolution {
  Unknown,
  Self,
  Both,
}

const SKIN_LAYER_DESCRIPTIONS = [{ opacity: 1 }, { opacity: 0.5 }];
const SNAP_SIZE = config.TILE_SIZE_MEDIUM;

const STUN_BLINK_DELAY = 0.1;

export class Tank extends GameObject {
  public collider: SweptBoxCollider = new SweptBoxCollider(this, true);
  public tags = [Tag.Tank];
  // Tank index within it's party: players (0-1), enemies (0-19).
  public partyIndex = -1;
  public type: TankType;
  public behavior: TankBehavior;
  public attributes: TankAttributes;
  public skinAnimation: TankSkinAnimation;
  public bullets: Bullet[] = [];
  public shield: Shield = null;
  public fired = new Subject();
  public died = new Subject<{
    hitterPartyIndex: number;
    reason: TankDeathReason;
  }>();
  public hit = new Subject();
  public slided = new Subject();
  public state = TankState.Uninitialized;
  public freezeState = new State<boolean>(false);
  public isOnIce = false;
  protected shieldTimer = new Timer();
  protected animation: Animation<TankAnimationFrame>;
  protected skinLayers: GameObject[] = [];
  protected lastFireTimer = new Timer();
  protected slideTimer = new Timer();
  protected stunTimer = new Timer();
  protected stunBlinkTimer = new Timer();
  protected spawnCollisionState = new State<SpawnCollisionState>(
    SpawnCollisionState.WaitUpdate,
  );
  protected playerCollisionState = new State<PlayerCollisionState>(
    PlayerCollisionState.NotColliding,
  );
  protected tankCollisionResolution: TankCollisionResolution =
    TankCollisionResolution.Unknown;
  protected isCollisionAbusedByPlayer = false;
  protected collisionSystem: CollisionSystem;

  constructor(type: TankType, behavior: TankBehavior, partyIndex: number) {
    super(64, 64);

    this.pivot.set(0.5, 0.5);

    this.type = type;
    this.behavior = behavior;
    this.partyIndex = partyIndex;

    this.attributes = TankAttributesFactory.create(this.type);

    this.shieldTimer.done.addListener(this.handleShieldTimer);
    this.stunTimer.done.addListener(this.handleStunTimer);
  }

  protected setup(updateArgs: GameUpdateArgs): void {
    const { collisionSystem } = updateArgs;

    this.collisionSystem = collisionSystem;

    collisionSystem.register(this.collider);

    this.behavior.setup(this, updateArgs);

    SKIN_LAYER_DESCRIPTIONS.forEach(() => {
      const layer = new GameObject();
      layer.size.copyFrom(this.size);

      const painter = new SpritePainter();
      painter.alignment = SpriteAlignment.MiddleCenter;

      layer.painter = painter;

      this.skinLayers.push(layer);

      this.add(layer);
    });
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { deltaTime, gameState } = updateArgs;

    if (this.spawnCollisionState.is(SpawnCollisionState.WaitCollide)) {
      // Collide has not been called on prev frame means tank is not colliding
      // with anything
      this.enablePostSpawnCollision();
    } else if (this.spawnCollisionState.is(SpawnCollisionState.WaitUpdate)) {
      // If collision actually exists, #collide() will be called right after
      // this first update and we will know the state of collision.
      // If it won't be called, this state will stay hanging and we will receive
      // it here on the next #update() call. That means that tank is not
      // colliding with anything and we should make it collidable.
      this.spawnCollisionState.set(SpawnCollisionState.WaitCollide);
    }

    if (this.playerCollisionState.is(PlayerCollisionState.WaitCollide)) {
      // Collide has not been called on prev frame means tank is not colliding
      // with player
      this.playerCollisionState.set(PlayerCollisionState.NotColliding);
    } else if (this.playerCollisionState.is(PlayerCollisionState.Colliding)) {
      // If tanks were previously colliding. From here we wait for next
      // #collide() call, where it either goes back to colliding or not
      //  colliding.
      this.playerCollisionState.set(PlayerCollisionState.WaitCollide);
    }

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

    this.dirtyPaintBox();

    if (this.isSliding()) {
      if (this.isOnIce) {
        this.slideTimer.update(deltaTime);
        if (this.slideTimer.isDone()) {
          // If slide timer is done, then tank becomes idle wherever it stopped
          // and player has control of it again.
          this.idle(false);
        } else {
          // If on ice and still sliding - move tank in whatever direction it
          // is facing
          this.move(deltaTime);
        }
      } else {
        // If tank is sliding, but appears not to be on ice any more, then
        // stop sliding.
        this.slideTimer.stop();
        this.idle(false);
      }
    }

    if (this.isStunned()) {
      if (this.stunBlinkTimer.isDone()) {
        this.stunBlinkTimer.reset(STUN_BLINK_DELAY);
        this.setVisible(!this.getVisible());
      }
      this.stunBlinkTimer.update(deltaTime);
      this.stunTimer.update(deltaTime);
    }

    // Behavior code is responsible for blocking movement for a tank when it
    // is sliding
    this.behavior.update(this, updateArgs);

    this.lastFireTimer.update(deltaTime);

    this.updateAnimation(deltaTime);

    this.collider.update();

    // Reset so in case tank leaves ice, flag will be correct. #collide() is
    // called right after and it will set the flag if tank is on ice.
    this.isOnIce = false;

    this.tankCollisionResolution = TankCollisionResolution.Unknown;
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
    this.collideIce(collision);
    this.collideSpawnedTanks(collision);
    this.collideWalls(collision);
    this.collideTanks(collision);
    this.collideBullets(collision);
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
      this.partyIndex,
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

    this.lastFireTimer.reset(this.attributes.bulletRapidFireDelay);

    return true;
  }

  public move(deltaTime: number): void {
    if (this.state !== TankState.Moving) {
      this.state = TankState.Moving;
    }

    this.translateY(this.attributes.moveSpeed * deltaTime);
    this.updateMatrix(true);
  }

  public idle(checkIce = true): void {
    if (this.state !== TankState.Idle) {
      this.state = TankState.Idle;
    }

    // Whenever player lets go of his input controls, we check if tank is on ice
    // and if it should slide.
    if (
      checkIce &&
      this.tags.includes(Tag.Player) &&
      this.isOnIce &&
      !this.isSliding()
    ) {
      this.slided.notify(null);
      this.slideTimer.reset(config.ICE_SLIDE_DURATION);
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

  public die(
    reason: TankDeathReason = TankDeathReason.Bullet,
    hitterPartyIndex = null,
  ): void {
    const event = {
      hitterPartyIndex,
      reason,
    };
    this.died.notify(event);
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

  protected receiveHit(damage: number, hitterPartyIndex: number): void {
    this.attributes.health = Math.max(0, this.attributes.health - damage);

    this.hit.notify(null);

    if (!this.isAlive()) {
      this.die(TankDeathReason.Bullet, hitterPartyIndex);
    }
  }

  public isSliding(): boolean {
    return this.slideTimer.isActive();
  }

  public isStunned(): boolean {
    return this.stunTimer.isActive();
  }

  protected handleStunTimer = (): void => {
    this.stunBlinkTimer.stop();
    this.setVisible(true);
  };

  protected handleShieldTimer = (): void => {
    this.shield.removeSelf();
    this.shield = null;
  };

  protected collideIce(collision: Collision): void {
    // Only player can slip on ice
    if (this.tags.includes(Tag.Enemy)) {
      return;
    }

    const iceTileContacts = collision.contacts.filter((contact) => {
      return contact.collider.object.tags.includes(Tag.Ice);
    });

    if (iceTileContacts.length === 0) {
      return;
    }

    // Check if center of tank is on ice - if so then apply the effect.

    const selfBox = this.getWorldBoundingBox();
    const selfCenter = selfBox.getCenter();

    const sumBox = new BoundingBox();
    for (const contact of iceTileContacts) {
      sumBox.unionWith(contact.box);
    }

    const isOnIce = sumBox.containsPoint(selfCenter);

    this.isOnIce = isOnIce;
  }

  // Try to solve the issue when some alive tank is
  // moving on top of a spawn and at the same time new tank has been spawned.
  // Not to toss the tanks around we simply don't enable collisions for
  // a newly spawned tank until these both tanks move away from each other.
  protected collideSpawnedTanks(collision: Collision): void {
    if (this.spawnCollisionState.is(SpawnCollisionState.WaitCollide)) {
      const tankContacts = collision.contacts.filter((contact) => {
        return contact.collider.object.tags.includes(Tag.Tank);
      });

      if (tankContacts.length > 0) {
        // Live one more cycle and check collisions on next frame
        this.spawnCollisionState.set(SpawnCollisionState.WaitUpdate);
      } else {
        // Collide has been called but there is no collision with other tanks.
        this.enablePostSpawnCollision();
      }
    }
  }

  protected collideWalls(collision: Collision): void {
    const wallContacts = [];

    for (const contact of collision.contacts) {
      const { tags } = contact.collider.object;

      if (tags.includes(Tag.BlockMove) && !tags.includes(Tag.Tank)) {
        wallContacts.push(contact);
      }
    }

    if (wallContacts.length === 0) {
      return;
    }

    // Find closest wall we are colliding with. It solves "tunneling" problem
    // if tank is going too fast it can jump over some small tiles of walls.
    // By using swept box collider and then finding closest points of contact,
    // we make tank interact with the first object on the way.
    // Tank can also hit multiple block at the same time.

    const closestWallContacts = this.getClosestContacts(
      wallContacts,
      this.collider.getPrevBox(),
    );

    if (closestWallContacts.length === 0) {
      return;
    }

    // Most likely it collides with multiple brick when going front and they
    // are positioned in one line near each other. So it will be enough to
    // resolve just one collision of them all.
    const firstWallContact = closestWallContacts[0];
    const otherCurrentBox = firstWallContact.collider.getCurrentBox();

    this.resolveMinkowski(otherCurrentBox, true);
  }

  protected resolveMinkowski(otherBox: BoundingBox, shouldSnap = false): void {
    const selfCurrentBox = this.collider.getCurrentBox();
    const selfPrevBox = this.collider.getPrevBox();
    const selfPrevCenter = selfPrevBox.getCenter();

    // Calculate Minksowski sum of collidable boxes.
    const minkowskiBox = otherBox.clone().minkowskiSum(selfCurrentBox);

    // Resulting box has diagonals. Next we are going to reposition those
    // diagonals to the start of coordinate system. By computing cross product
    // between those diagonals and a center of previous bounding box of
    // collided object we will be able to identify which side of bounding box
    // is collided. Thanks to this we will know what side to resolve collision
    // with without relying on direction or rotation, which might not provide
    // the correct result in different situations
    const minkowskiRect = minkowskiBox.toRect();
    const minkowskiCenter = minkowskiBox.getCenter();

    // Move previous center position according to how diagonals are moved.
    // It is important to use previous position, because current position
    // might intersect from the other side and give the opposite info.
    // We want to know from which direction collision came from.
    const localPrev = new Vector(
      selfPrevCenter.x - minkowskiCenter.x,
      selfPrevCenter.y - minkowskiCenter.y,
    );

    // We will check on which side of diagonals the center is

    // Bottom-left to bottom-right diagonal
    //    |  /
    //    | /
    // ___|/_____
    //    |(0,0)
    //    |
    const blTrLocalDiag = new Vector(
      minkowskiRect.width / 2,
      minkowskiRect.height / 2,
    );

    // Top-left to bottom-right diagonal
    //    |
    // ___|(0,0)___
    //    |\
    //    | \
    //    |  \
    const tlBrLocalDiag = new Vector(
      minkowskiRect.width / 2,
      -minkowskiRect.height / 2,
    );

    const blTrCrossProduct = localPrev.cross(blTrLocalDiag);
    const tlBrCrossProduct = localPrev.cross(tlBrLocalDiag);

    const isTop = blTrCrossProduct < 0 && tlBrCrossProduct < 0;
    const isBottom = blTrCrossProduct > 0 && tlBrCrossProduct > 0;
    const isLeft = blTrCrossProduct > 0 && tlBrCrossProduct < 0;
    const isRight = blTrCrossProduct < 0 && tlBrCrossProduct > 0;

    if (isTop) {
      this.position.subY(selfCurrentBox.min.y - otherBox.max.y);
      if (shouldSnap) {
        this.position.snapY(SNAP_SIZE);
      }
    } else if (isBottom) {
      this.position.subY(selfCurrentBox.max.y - otherBox.min.y);
      if (shouldSnap) {
        this.position.snapY(SNAP_SIZE);
      }
    } else if (isLeft) {
      this.position.subX(selfCurrentBox.min.x - otherBox.max.x);
      if (shouldSnap) {
        this.position.snapX(SNAP_SIZE);
      }
    } else if (isRight) {
      this.position.subX(selfCurrentBox.max.x - otherBox.min.x);
      if (shouldSnap) {
        this.position.snapX(SNAP_SIZE);
      }
    }

    this.updateMatrix(true);

    this.collider.update();
  }

  protected collideTanks(collision: Collision): void {
    if (!this.tags.includes(Tag.BlockMove)) {
      return;
    }

    const tankContacts = [];
    const playerTankContacts = [];
    const wallContacts = [];

    for (const contact of collision.contacts) {
      const { tags } = contact.collider.object;

      if (tags.includes(Tag.BlockMove) && tags.includes(Tag.Tank)) {
        tankContacts.push(contact);
      }
      if (tags.includes(Tag.BlockMove) && !tags.includes(Tag.Tank)) {
        wallContacts.push(contact);
      }
      if (tags.includes(Tag.Tank) && tags.includes(Tag.Player)) {
        playerTankContacts.push(contact);
      }
    }

    if (this.playerCollisionState.is(PlayerCollisionState.WaitCollide)) {
      if (playerTankContacts.length > 0) {
        this.playerCollisionState.set(PlayerCollisionState.Colliding);
      } else {
        this.playerCollisionState.set(PlayerCollisionState.NotColliding);
      }
    }

    if (tankContacts.length === 0) {
      return;
    }

    const closestTankContacts = this.getClosestContacts(
      tankContacts,
      this.collider.getPrevBox(),
    );

    const firstTankContact = closestTankContacts[0];

    const otherCollider = firstTankContact.collider as SweptBoxCollider;
    const other = otherCollider.object as Tank;

    if (other.tankCollisionResolution === TankCollisionResolution.Self) {
      // Other tank has already resolved the collision, skip for current tank
      return;
    }

    // First we check which tanks are moving. It is easier if only one of them
    // is moving, because we only need to resolve his collision.
    const selfCurrentBox = this.collider.getCurrentBox();
    const selfPrevBox = this.collider.getPrevBox();
    const isSelfMoving = !selfCurrentBox.equals(selfPrevBox);

    const otherPrevBox = otherCollider.getPrevBox();
    const otherCurrentBox = otherCollider.getCurrentBox();
    const isOtherMoving = !otherCurrentBox.equals(otherPrevBox);

    if (!isOtherMoving && !isSelfMoving) {
      // Both still. It might happen when one tank goes on spawn of another
      // tank and stand there. Both should do nothing until they get of each
      // others way.
      return;
    }

    if (isOtherMoving && !isSelfMoving) {
      // Let other resolve because it is moving
      return;
    }

    const selfDirection = this.collider.getDirection().normalize();
    const otherDirection = otherCollider.getDirection().normalize();

    if (!isOtherMoving && isSelfMoving) {
      // We are going to resolve because we are moving

      // There is a special case when enemy tank is moving and player tank
      // is standing in the way but it can not be hit with a bullet. Player
      // could abuse this to block enemy tanks from moving. To workaround it
      // we check if enemy tank is moving directly on grid and it collides
      // with player. If at the moment of collision the intersecrion area is
      // not enough for bullet to hit, then we disable collision at all and
      // enemy tank will move "through" player tank.
      if (this.tags.includes(Tag.Enemy) && other.tags.includes(Tag.Player)) {
        // If enemy is already colliding with player - skip it right away
        if (this.playerCollisionState.is(PlayerCollisionState.Colliding)) {
          return;
        }

        const roundedPosition = this.position.clone().round();
        const isMovingOnGridHorizontally =
          (selfDirection.x === 1 || selfDirection.x === -1) &&
          roundedPosition.y % config.TILE_SIZE_MEDIUM === 0;
        const isMovingOnGridVertically =
          (selfDirection.y === 1 || selfDirection.y === -1) &&
          roundedPosition.x % config.TILE_SIZE_MEDIUM === 0;

        const intersectionBox = selfCurrentBox
          .clone()
          .intersectWith(otherCurrentBox);
        const intersectionRect = intersectionBox.toRect();

        const thresholdWidth = (this.size.width - config.BULLET_WIDTH) / 2;
        const thresholdHeight = (this.size.height - config.BULLET_WIDTH) / 2;

        // Don't resolve and remember that player tank was in contact with
        // current tank so we can resolve collision later when they continue
        // moving

        if (
          isMovingOnGridVertically &&
          intersectionRect.width <= thresholdWidth
        ) {
          this.playerCollisionState.set(PlayerCollisionState.Colliding);
          return;
        }

        // Don't resolve
        if (
          isMovingOnGridHorizontally &&
          intersectionRect.height <= thresholdHeight
        ) {
          this.playerCollisionState.set(PlayerCollisionState.Colliding);
          return;
        }
      }

      this.resolveMinkowski(otherPrevBox);
      this.tankCollisionResolution = TankCollisionResolution.Self;
      return;
    }

    // Below we handle if both tanks are moving

    // If player tank is colliding with enemy who decided to temporarily
    // ignore collsion with player. We also check if enemy is waiting because
    // we don't know which tank's #collide() is called first
    if (this.tags.includes(Tag.Player) && other.tags.includes(Tag.Enemy)) {
      if (
        other.playerCollisionState.is(PlayerCollisionState.Colliding) ||
        other.playerCollisionState.is(PlayerCollisionState.WaitCollide)
      ) {
        return;
      }
    }

    // If enemy tank who decided to temporarily ignore collsion with player
    // is colliding with player. We also check if enemy is waiting because
    // we don't know which tank's #collide() is called first.
    if (this.tags.includes(Tag.Enemy) && other.tags.includes(Tag.Player)) {
      if (
        this.playerCollisionState.is(PlayerCollisionState.Colliding) ||
        other.playerCollisionState.is(PlayerCollisionState.WaitCollide)
      ) {
        return;
      }
    }

    // First tank rolled-back his movement, current tank should align to it.
    if (other.tankCollisionResolution === TankCollisionResolution.Both) {
      this.resolveMinkowski(otherCurrentBox);
      return;
    }

    const hasWallCollision = wallContacts.length > 0;

    // Find which direction tank is moving, then find direction of collision
    // from the tank's perspective.

    const selfCurrentCenter = selfCurrentBox.getCenter();
    const otherCurrentCenter = otherCurrentBox.getCenter();

    const selfCollisionDirection = otherCurrentCenter
      .clone()
      .sub(selfCurrentCenter)
      .normalize();
    const otherCollisionDirection = selfCurrentCenter
      .clone()
      .sub(otherCurrentCenter)
      .normalize();

    // Dot product of tank's direction and collision direction from his
    // perspective lets us know if tank is moving towards collision. If that
    // is the case, we consider him as an initiator of the collision and it
    // will be responsible for resolving the collision.
    // If both of them are moving towards collision, then we compare dot
    // product value to check who participates in collision more.
    // If they move towards each other, dot products will be equal and tanks
    // should both resolve the collision. It is important that they resolve
    // it in respect to each other - one should rollback is movement, the other
    // one will account for that rollback and position himself according to
    // first tank bounding box. This will hold tanks in place if they continue
    // moving towards each other.

    const selfDot = selfDirection.dot(selfCollisionDirection);
    const otherDot = otherDirection.dot(otherCollisionDirection);

    let isSelfInitiator = selfDot > 0;
    let isOtherInitiator = otherDot > 0;

    if (selfDot > 0 && otherDot > 0) {
      if (selfDot === otherDot) {
        isSelfInitiator = true;
        isOtherInitiator = true;
      } else {
        isSelfInitiator = selfDot > otherDot;
        isOtherInitiator = otherDot > selfDot;
      }
    }

    // In case current tank has other collision with walls, let him be, and
    // resolve collsion ourselves
    if (hasWallCollision) {
      isSelfInitiator = false;
      isOtherInitiator = true;
    }

    if (isSelfInitiator && !isOtherInitiator) {
      this.resolveMinkowski(otherPrevBox);
      this.tankCollisionResolution = TankCollisionResolution.Self;
      return;
    }

    if (!isSelfInitiator && isOtherInitiator) {
      // We go where we were going, other one will resolve the collision
      return;
    }

    if (isSelfInitiator && isOtherInitiator) {
      // Both should resolve because they are moving towards each other.
      // One should rollback his movement completely, and the other one
      // should use former tank box to align itself. As a result if they
      // both move at each other at full speed, they will be kept in place.
      this.resolveByRollback(this.collider.getDirection());
      this.tankCollisionResolution = TankCollisionResolution.Both;
      return;
    }

    // In case neither is an initiator, we check who has more collsiions with
    // other objects.

    const otherCollision = this.collisionSystem.getCollisionByCollider(
      other.collider,
    );

    const selfContactsExceptOther = collision.contacts.filter((contact) => {
      return contact.collider !== other.collider;
    });

    const otherContactsExceptSelf = otherCollision.contacts.filter(
      (contact) => {
        return contact.collider !== this.collider;
      },
    );

    if (
      otherContactsExceptSelf.length > 0 &&
      selfContactsExceptOther.length === 0
    ) {
      this.resolveMinkowski(otherPrevBox);
      this.tankCollisionResolution = TankCollisionResolution.Self;
      return;
    }

    // For the rest of the situations, we just let them be. During testing
    // this seemed to work fine.
  }

  protected collideBullets(collision: Collision): void {
    const bulletContacts = collision.contacts.filter((contact) => {
      return contact.collider.object.tags.includes(Tag.Bullet);
    });

    if (bulletContacts.length === 0) {
      return;
    }

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

      // When friendly-fire - stun the tank which was hit so he can't move
      // but can still fire
      if (bullet.tags.includes(Tag.Player) && this.tags.includes(Tag.Player)) {
        // If already stunned - ignore
        if (this.isStunned()) {
          return;
        }

        this.stunTimer.reset(config.FRIENDLY_FIRE_STUN_DURATION);
        this.stunBlinkTimer.reset(STUN_BLINK_DELAY);
        this.setVisible(false);
        this.idle();
        return;
      }

      this.receiveHit(bullet.tankDamage, bullet.ownerPartyIndex);
    });
  }

  protected resolveByRollback(direction: Vector): void {
    this.position.sub(direction);
    this.updateMatrix(true);

    this.collider.update();
  }

  protected getClosestContacts(
    contacts: CollisionContact[],
    selfBox: BoundingBox,
  ): CollisionContact[] {
    let minDistance = null;

    for (const contact of contacts) {
      const prevBox = selfBox;
      const distance = prevBox.distanceCenterToCenter(contact.box);

      if (minDistance === null || distance < minDistance) {
        minDistance = distance;
      }
    }

    const closestContacts = [];

    for (const contact of contacts) {
      const prevBox = selfBox;
      const distance = prevBox.distanceCenterToCenter(contact.box);

      if (distance === minDistance) {
        closestContacts.push(contact);
      }
    }

    return closestContacts;
  }

  protected enablePostSpawnCollision(): void {
    this.spawnCollisionState.set(SpawnCollisionState.Resolved);
    this.tags.push(Tag.BlockMove);
  }

  protected getDirection(): Vector {
    if (this.rotation === Rotation.Up) {
      return new Vector(0, -1);
    }
    if (this.rotation === Rotation.Down) {
      return new Vector(0, 1);
    }
    if (this.rotation === Rotation.Left) {
      return new Vector(-1, 0);
    }
    if (this.rotation === Rotation.Right) {
      return new Vector(1, 0);
    }
  }

  /**
   * @deprecated Use resolveMinkowski, left for history reference
   */
  protected resolveBasedOnDirection(
    selfCurrentBox: BoundingBox,
    otherBox: BoundingBox,
    shouldSnap = false,
  ): void {
    const direction = this.collider.getDirection().normalize();

    if (direction.y < 0) {
      this.position.subY(Math.max(0, selfCurrentBox.min.y - otherBox.max.y));
      if (shouldSnap) {
        this.position.snapY(SNAP_SIZE);
      }
    } else if (direction.y > 0) {
      this.position.subY(Math.max(0, selfCurrentBox.max.y - otherBox.min.y));
      if (shouldSnap) {
        this.position.snapY(SNAP_SIZE);
      }
    } else if (direction.x < 0) {
      this.position.subX(Math.max(0, selfCurrentBox.min.x - otherBox.max.x));
      if (shouldSnap) {
        this.position.snapX(SNAP_SIZE);
      }
    } else if (direction.x > 0) {
      this.position.subX(Math.max(0, selfCurrentBox.max.x - otherBox.min.x));
      if (shouldSnap) {
        this.position.snapX(SNAP_SIZE);
      }
    }

    this.updateMatrix(true);

    this.collider.update();
  }

  /**
   * @deprecated Use resolveMinkowski, left for history reference
   */
  protected resolveBasedOnRotation(
    selfBox: BoundingBox,
    otherBox: BoundingBox,
    shouldSnap = false,
  ): void {
    const rotation = this.getWorldRotation();

    // Tied to axis. Reset opposite axis direction so only primary axis
    // will be resolved. Otherwise it conflicts with #rotate() code which
    // aligns tank to a grid during rotation.
    // Snap to avoid situations when between two walls opposite each other,
    // and tank is colliding with right wall, collider pushes tank back to
    // left wall, and wrong resolution branch is applied. Stick tank to grid.
    if (rotation == Rotation.Up) {
      this.position.addY(otherBox.max.y - selfBox.min.y);
      if (shouldSnap) {
        this.position.snapY(SNAP_SIZE);
      }
    } else if (rotation === Rotation.Down) {
      this.position.addY(otherBox.min.y - selfBox.max.y);
      if (shouldSnap) {
        this.position.snapY(SNAP_SIZE);
      }
    } else if (rotation === Rotation.Left) {
      this.position.addX(otherBox.max.x - selfBox.min.x);
      if (shouldSnap) {
        this.position.snapX(SNAP_SIZE);
      }
    } else if (rotation === Rotation.Right) {
      this.position.addX(otherBox.min.x - selfBox.max.x);
      if (shouldSnap) {
        this.position.snapX(SNAP_SIZE);
      }
    }
    this.updateMatrix(true);

    // Make sure to update collider
    this.collider.update();
  }
}
