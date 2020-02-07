const config = {
  block: ['sprite.png', 257, 1, 13, 13],

  'bullet.down': ['sprite.png', 339, 102, 3, 4],
  'bullet.left': ['sprite.png', 330, 102, 4, 3],
  'bullet.right': ['sprite.png', 346, 102, 4, 3],
  'bullet.up': ['sprite.png', 323, 102, 3, 4],

  'explosionBullet.1': ['sprite.png', 259, 130, 11, 11],
  'explosionBullet.2': ['sprite.png', 273, 129, 15, 15],
  'explosionBullet.3': ['sprite.png', 288, 128, 16, 16],

  'explosionTank.1': ['sprite.png', 304, 129, 31, 29],
  'explosionTank.2': ['sprite.png', 334, 128, 34, 32],

  powerupGrenade: ['sprite.png', 320, 112, 16, 15],

  'shield.1': ['sprite.png', 256, 144, 16, 16],
  'shield.2': ['sprite.png', 272, 144, 16, 16],

  'spawn.1': ['sprite.png', 259, 99, 9, 9],
  'spawn.2': ['sprite.png', 274, 98, 11, 11],
  'spawn.3': ['sprite.png', 289, 97, 13, 13],
  'spawn.4': ['sprite.png', 304, 96, 15, 15],

  'tankEnemyBasic.up.1': ['sprite.png', 129, 64, 13, 15],
  'tankEnemyBasic.up.2': ['sprite.png', 145, 64, 13, 15],
  'tankEnemyBasic.down.1': ['sprite.png', 193, 64, 13, 15],
  'tankEnemyBasic.down.2': ['sprite.png', 209, 64, 13, 15],
  'tankEnemyBasic.left.1': ['sprite.png', 160, 66, 15, 13],
  'tankEnemyBasic.left.2': ['sprite.png', 176, 66, 15, 13],
  'tankEnemyBasic.right.1': ['sprite.png', 225, 65, 15, 13],
  'tankEnemyBasic.right.2': ['sprite.png', 241, 65, 15, 13],

  'tankEnemyBasicDrop.up.1': ['sprite.png', 129, 192, 13, 15],
  'tankEnemyBasicDrop.up.2': ['sprite.png', 145, 192, 13, 15],
  'tankEnemyBasicDrop.down.1': ['sprite.png', 193, 192, 13, 15],
  'tankEnemyBasicDrop.down.2': ['sprite.png', 209, 192, 13, 15],
  'tankEnemyBasicDrop.left.1': ['sprite.png', 160, 194, 15, 13],
  'tankEnemyBasicDrop.left.2': ['sprite.png', 176, 194, 15, 13],
  'tankEnemyBasicDrop.right.1': ['sprite.png', 225, 193, 15, 13],
  'tankEnemyBasicDrop.right.2': ['sprite.png', 241, 193, 15, 13],

  'tankEnemyFast.up.1': ['sprite.png', 129, 80, 13, 15],
  'tankEnemyFast.up.2': ['sprite.png', 145, 80, 13, 15],
  'tankEnemyFast.down.1': ['sprite.png', 193, 81, 13, 15],
  'tankEnemyFast.down.2': ['sprite.png', 209, 81, 13, 15],
  'tankEnemyFast.left.1': ['sprite.png', 160, 82, 15, 13],
  'tankEnemyFast.left.2': ['sprite.png', 176, 82, 15, 13],
  'tankEnemyFast.right.1': ['sprite.png', 225, 81, 15, 13],
  'tankEnemyFast.right.2': ['sprite.png', 241, 81, 15, 13],

  'tankEnemyFastDrop.up.1': ['sprite.png', 129, 208, 13, 15],
  'tankEnemyFastDrop.up.2': ['sprite.png', 145, 208, 13, 15],
  'tankEnemyFastDrop.down.1': ['sprite.png', 193, 209, 13, 15],
  'tankEnemyFastDrop.down.2': ['sprite.png', 209, 209, 13, 15],
  'tankEnemyFastDrop.left.1': ['sprite.png', 160, 210, 15, 13],
  'tankEnemyFastDrop.left.2': ['sprite.png', 176, 210, 15, 13],
  'tankEnemyFastDrop.right.1': ['sprite.png', 225, 209, 15, 13],
  'tankEnemyFastDrop.right.2': ['sprite.png', 241, 209, 15, 13],

  'tankEnemyPower.up.1': ['sprite.png', 129, 96, 13, 15],
  'tankEnemyPower.up.2': ['sprite.png', 145, 96, 13, 15],
  'tankEnemyPower.down.1': ['sprite.png', 192, 96, 13, 15],
  'tankEnemyPower.down.2': ['sprite.png', 208, 96, 13, 15],
  'tankEnemyPower.left.1': ['sprite.png', 160, 98, 15, 13],
  'tankEnemyPower.left.2': ['sprite.png', 176, 98, 15, 13],
  'tankEnemyPower.right.1': ['sprite.png', 225, 97, 15, 13],
  'tankEnemyPower.right.2': ['sprite.png', 241, 97, 15, 13],

  'tankEnemyPowerDrop.up.1': ['sprite.png', 129, 224, 13, 15],
  'tankEnemyPowerDrop.up.2': ['sprite.png', 145, 224, 13, 15],
  'tankEnemyPowerDrop.down.1': ['sprite.png', 192, 224, 13, 15],
  'tankEnemyPowerDrop.down.2': ['sprite.png', 208, 224, 13, 15],
  'tankEnemyPowerDrop.left.1': ['sprite.png', 160, 226, 15, 13],
  'tankEnemyPowerDrop.left.2': ['sprite.png', 176, 226, 15, 13],
  'tankEnemyPowerDrop.right.1': ['sprite.png', 225, 225, 15, 13],
  'tankEnemyPowerDrop.right.2': ['sprite.png', 241, 225, 15, 13],

  'tankPlayer.down.1': ['sprite.png', 65, 1, 13, 13],
  'tankPlayer.down.2': ['sprite.png', 81, 1, 13, 13],
  'tankPlayer.left.1': ['sprite.png', 34, 1, 13, 13],
  'tankPlayer.left.2': ['sprite.png', 50, 1, 13, 13],
  'tankPlayer.right.1': ['sprite.png', 97, 1, 13, 13],
  'tankPlayer.right.2': ['sprite.png', 113, 1, 13, 13],
  'tankPlayer.up.1': ['sprite.png', 1, 2, 13, 13],
  'tankPlayer.up.2': ['sprite.png', 17, 2, 13, 13],

  'wall.brick.1': ['sprite.png', 256, 0, 4, 4],
  'wall.brick.2': ['sprite.png', 260, 0, 4, 4],
  'wall.brick.3': ['sprite.png', 264, 0, 4, 4],
  'wall.brick.4': ['sprite.png', 268, 0, 4, 4],
  'wall.brick.5': ['sprite.png', 256, 4, 4, 4],
  'wall.brick.6': ['sprite.png', 260, 4, 4, 4],
  'wall.brick.7': ['sprite.png', 264, 4, 4, 4],
  'wall.brick.8': ['sprite.png', 268, 4, 4, 4],

  'wall.steel': ['sprite.png', 256, 16, 8, 8],

  'ui.enemyCounter': ['sprite.png', 377, 144, 7, 8],
};

export default config;
