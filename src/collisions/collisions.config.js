import Block from '../models/block/Block';
import Bullet from '../models/Bullet';
import SceneWall from '../models/SceneWall';

import BasicEnemyTank from '../models/BasicEnemyTank';
import FastEnemyTank from '../models/FastEnemyTank';
import PowerEnemyTank from '../models/PowerEnemyTank';
import Tank from '../models/Tank';

import GrenadePowerup from '../models/GrenadePowerup';

import CollideBlock from './CollideBlock';
import CollideBullet from './CollideBullet';
import CollideEnemyTankWithBullet from './CollideEnemyTankWithBullet';
import CollideEnemyTankWithWall from './CollideEnemyTankWithWall';
import CollideGrenadePowerupWithTank from './CollideGrenadePowerupWithTank';
import CollideTankWithWall from './CollideTankWithWall';

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
