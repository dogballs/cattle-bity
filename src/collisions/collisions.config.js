import Block from '../models/block/Block.js';
import Bullet from '../models/Bullet.js';
import EnemyTank from '../models/enemy-tank/EnemyTank.js';

import CollideBlock from './CollideBlock.js';
import CollideBullet from './CollideBullet.js';

const config = [
  // Block
  {
    sourceType: Block,
    targetType: Bullet,
    Instance: CollideBlock,
  },

  // Bullet
  {
    sourceType: Bullet,
    targetType: Block,
    Instance: CollideBullet,
  },
  {
    sourceType: Bullet,
    targetType: EnemyTank,
    Instance: CollideBullet,
  },
];

export default config;
