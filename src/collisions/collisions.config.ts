import {
  BasicEnemyTank,
  BrickWall,
  BrickWallDestroyer,
  Bullet,
  FastEnemyTank,
  GrenadePowerup,
  PowerEnemyTank,
  SceneWall,
  Tank,
} from '../gameObjects';

import { CollideBrickWallWithBrickWallDestroyer } from './CollideBrickWallWithBrickWallDestroyer';
import { CollideBrickWallWithBullet } from './CollideBrickWallWithBullet';
import { CollideBullet } from './CollideBullet';
import { CollideEnemyTankWithBullet } from './CollideEnemyTankWithBullet';
import { CollideEnemyTankWithWall } from './CollideEnemyTankWithWall';
import { CollideGrenadePowerupWithTank } from './CollideGrenadePowerupWithTank';
import { CollideTankWithWall } from './CollideTankWithWall';

const config = [
  // Bullet
  {
    Instance: CollideBullet,
    sourceType: BrickWall,
    targetType: Bullet,
  },
  {
    Instance: CollideBullet,
    sourceType: SceneWall,
    targetType: Bullet,
  },
  {
    Instance: CollideBullet,
    sourceType: BasicEnemyTank,
    targetType: Bullet,
  },
  {
    Instance: CollideBullet,
    sourceType: FastEnemyTank,
    targetType: Bullet,
  },
  {
    Instance: CollideBullet,
    sourceType: PowerEnemyTank,
    targetType: Bullet,
  },

  // Tank
  {
    Instance: CollideTankWithWall,
    sourceType: BrickWall,
    targetType: Tank,
  },
  {
    Instance: CollideTankWithWall,
    sourceType: SceneWall,
    targetType: Tank,
  },

  // Basic Enemy
  {
    Instance: CollideEnemyTankWithWall,
    sourceType: SceneWall,
    targetType: BasicEnemyTank,
  },
  {
    Instance: CollideEnemyTankWithBullet,
    sourceType: Bullet,
    targetType: BasicEnemyTank,
  },

  // Fast enemy
  {
    Instance: CollideEnemyTankWithWall,
    sourceType: SceneWall,
    targetType: FastEnemyTank,
  },
  {
    Instance: CollideEnemyTankWithBullet,
    sourceType: Bullet,
    targetType: FastEnemyTank,
  },

  // Power enemy
  {
    Instance: CollideEnemyTankWithWall,
    sourceType: SceneWall,
    targetType: PowerEnemyTank,
  },
  {
    Instance: CollideEnemyTankWithBullet,
    sourceType: Bullet,
    targetType: PowerEnemyTank,
  },

  // Powerups
  {
    Instance: CollideGrenadePowerupWithTank,
    sourceType: Tank,
    targetType: GrenadePowerup,
  },

  // Walls
  {
    Instance: CollideBrickWallWithBullet,
    sourceType: Bullet,
    targetType: BrickWall,
  },
  {
    Instance: CollideBrickWallWithBrickWallDestroyer,
    sourceType: BrickWallDestroyer,
    targetType: BrickWall,
  },
];

export default config;
