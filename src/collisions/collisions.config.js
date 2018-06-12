import Block from '../models/block/Block.js';
import Bullet from '../models/Bullet.js';
import EnemyTank from '../models/EnemyTank.js';
import SceneWall from '../models/SceneWall.js';
import Tank from '../models/Tank.js';

import CollideBlock from './CollideBlock.js';
import CollideBullet from './CollideBullet.js';
import CollideEnemyTankWithBullet from './CollideEnemyTankWithBullet.js';
import CollideEnemyTankWithWall from './CollideEnemyTankWithWall.js';
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
    sourceType: EnemyTank,
    Instance: CollideBullet,
  },
  {
    targetType: Bullet,
    sourceType: SceneWall,
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

  // EnemyTank
  {
    targetType: EnemyTank,
    sourceType: SceneWall,
    Instance: CollideEnemyTankWithWall,
  },
  {
    targetType: EnemyTank,
    sourceType: Bullet,
    Instance: CollideEnemyTankWithBullet,
  },
];

export default config;
