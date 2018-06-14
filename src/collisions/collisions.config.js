import Block from '../models/block/Block.js';
import Bullet from '../models/Bullet.js';
import SceneWall from '../models/SceneWall.js';

import BasicEnemyTank from '../models/BasicEnemyTank.js';
import FastEnemyTank from '../models/FastEnemyTank.js';
import PowerEnemyTank from '../models/PowerEnemyTank.js';
import Tank from '../models/Tank.js';

import GrenadePowerup from '../models/GrenadePowerup.js';

import CollideBlock from './CollideBlock.js';
import CollideBullet from './CollideBullet.js';
import CollideEnemyTankWithBullet from './CollideEnemyTankWithBullet.js';
import CollideEnemyTankWithWall from './CollideEnemyTankWithWall.js';
import CollideGrenadePowerupWithTank from './CollideGrenadePowerupWithTank.js';
import CollideTankWithWall from './CollideTankWithWall.js';

const config = [
  // Block
  {
    targetType: Block,
    sourceType: Bullet,
    Instance: CollideBlock,
  },

  // Bullet
  {
    targetType: Bullet,
    sourceType: Block,
    Instance: CollideBullet,
  },
  {
    targetType: Bullet,
    sourceType: SceneWall,
    Instance: CollideBullet,
  },
  {
    targetType: Bullet,
    sourceType: BasicEnemyTank,
    Instance: CollideBullet,
  },
  {
    targetType: Bullet,
    sourceType: FastEnemyTank,
    Instance: CollideBullet,
  },
  {
    targetType: Bullet,
    sourceType: PowerEnemyTank,
    Instance: CollideBullet,
  },

  // Tank
  {
    targetType: Tank,
    sourceType: Block,
    Instance: CollideTankWithWall,
  },
  {
    targetType: Tank,
    sourceType: SceneWall,
    Instance: CollideTankWithWall,
  },

  // Basic Enemy
  {
    targetType: BasicEnemyTank,
    sourceType: SceneWall,
    Instance: CollideEnemyTankWithWall,
  },
  {
    targetType: BasicEnemyTank,
    sourceType: Bullet,
    Instance: CollideEnemyTankWithBullet,
  },

  // Fast enemy
  {
    targetType: FastEnemyTank,
    sourceType: SceneWall,
    Instance: CollideEnemyTankWithWall,
  },
  {
    targetType: FastEnemyTank,
    sourceType: Bullet,
    Instance: CollideEnemyTankWithBullet,
  },

  // Power enemy
  {
    targetType: PowerEnemyTank,
    sourceType: SceneWall,
    Instance: CollideEnemyTankWithWall,
  },
  {
    targetType: PowerEnemyTank,
    sourceType: Bullet,
    Instance: CollideEnemyTankWithBullet,
  },

  // Powerups
  {
    targetType: GrenadePowerup,
    sourceType: Tank,
    Instance: CollideGrenadePowerupWithTank,
  },
];

export default config;
