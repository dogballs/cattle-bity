export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PROD = process.env.NODE_ENV === 'production';

export const TILE_SIZE_SMALL = 16;
export const TILE_SIZE_MEDIUM = 32;
export const TILE_SIZE_LARGE = 64;

export const FIELD_TILE_COUNT = 13;
export const FIELD_SIZE = FIELD_TILE_COUNT * TILE_SIZE_LARGE;

export const BORDER_LEFT_WIDTH = 64;
export const BORDER_RIGHT_WIDTH = 128;
export const BORDER_TOP_BOTTOM_HEIGHT = 32;
export const BORDER_RECTS = [
  // Top
  {
    x: 0,
    y: 0,
    width: BORDER_LEFT_WIDTH + FIELD_SIZE + BORDER_RIGHT_WIDTH,
    height: BORDER_TOP_BOTTOM_HEIGHT,
  },
  // Bottom
  {
    x: 0,
    y: FIELD_SIZE + BORDER_TOP_BOTTOM_HEIGHT,
    width: BORDER_LEFT_WIDTH + FIELD_SIZE + BORDER_RIGHT_WIDTH,
    height: BORDER_TOP_BOTTOM_HEIGHT,
  },
  // Left
  {
    x: 0,
    y: BORDER_TOP_BOTTOM_HEIGHT,
    width: BORDER_LEFT_WIDTH,
    height: FIELD_SIZE,
  },
  // Right
  {
    x: BORDER_LEFT_WIDTH + FIELD_SIZE,
    y: BORDER_TOP_BOTTOM_HEIGHT,
    width: BORDER_RIGHT_WIDTH,
    height: FIELD_SIZE,
  },
];

export const CANVAS_WIDTH = FIELD_SIZE + BORDER_LEFT_WIDTH + BORDER_RIGHT_WIDTH;
export const CANVAS_HEIGHT = FIELD_SIZE + BORDER_TOP_BOTTOM_HEIGHT * 2;

export const BRICK_TILE_SIZE = TILE_SIZE_SMALL;
export const BRICK_SUPER_TILE_SIZE = TILE_SIZE_MEDIUM;
export const STEEL_TILE_SIZE = TILE_SIZE_MEDIUM;
export const JUNGLE_TILE_SIZE = TILE_SIZE_MEDIUM;
export const WATER_TILE_SIZE = TILE_SIZE_MEDIUM;
export const ICE_TILE_SIZE = TILE_SIZE_MEDIUM;

export const PLAYER_FIRST_SPAWN_DELAY = 0;
export const PLAYER_SPAWN_DELAY = 0;
export const ENEMY_FIRST_SPAWN_DELAY = 0.16;
export const ENEMY_SPAWN_DELAY = 3;

export const ENEMY_MAX_TOTAL_COUNT = 20;
export const ENEMY_MAX_ALIVE_COUNT = 4;

export const POWERUP_DURATION = 30;
export const SHIELD_SPAWN_DURATION = 3.5;
export const SHIELD_POWERUP_DURATION = 10;
export const BASE_DEFENCE_POWERUP_DURATION = 17;
export const FREEZE_POWERUP_DURATION = 10;

export const POINTS_POWERUP_DURATION = 0.8;
export const POINTS_ENEMY_TANK_DURATION = 0.16;

export const LEVEL_START_DELAY = 2;

export const PLAYER_INITIAL_LIVES = 3;
export const PLAYER_EXTRA_LIVE_POINTS = 20000;
export const DEFAULT_HIGHSCORE = 20000;

export const COLOR_BACKDROP = 'rgba(0,0,0,0.7)';
export const COLOR_GRAY = '#636363';
export const COLOR_BLACK = '#000';
export const COLOR_WHITE = '#fff';
export const COLOR_RED = '#d74000';
export const COLOR_YELLOW = '#ffae0a';

export const PRIMARY_SPRITE_FONT_ID = 'primary';
export const PRIMARY_RECT_FONT_ID = 'primary';

export const STORAGE_NAMESPACE = 'battle-city';
export const STORAGE_KEY_SETTINGS_AUDIO = 'audio';
export const STORAGE_KEY_BINDINGS_PRIMARY = 'bindings-primary';
export const STORAGE_KEY_HIGHSCORE_PRIMARY = 'highscore-primary';

export const PLAYER_DEFAULT_SPAWN_POSITIONS = [{ x: 256, y: 768 }];
export const ENEMY_DEFAULT_SPAWN_POSITIONS = [
  { x: 384, y: 0 },
  { x: 768, y: 0 },
  { x: 0, y: 0 },
];
export const BASE_DEFAULT_POSITION = { x: 352, y: 736 };
export const BASE_DEFAULT_SIZE = { width: 128, height: 96 };

export const MENU_TITLE_DEFAULT_POSITION = {
  x: 112,
  y: 96,
};
export const MENU_DEFAULT_POSITION = {
  x: 16,
  y: 192,
};

export const BRICK_TILE_Z_INDEX = 0;
export const STEEL_TILE_Z_INDEX = 0;
export const WATER_TILE_Z_INDEX = 0;
export const ICE_TILE_Z_INDEX = 0;
export const BORDER_WALL_Z_INDEX = 0;
export const BASE_HEART_Z_INDEX = 0;
export const ENEMY_TANK_Z_INDEX = 1;
export const PLAYER_TANK_Z_INDEX = 2;
export const BULLET_Z_INDEX = 3;
export const SHIELD_Z_INDEX = 3;
export const SMALL_EXPLOSION_Z_INDEX = 4;
export const SPAWN_Z_INDEX = 4;
export const JUNGLE_TILE_Z_INDEX = 5;
export const LARGE_EXPLOSION_Z_INDEX = 6;
export const POWERUP_Z_INDEX = 7;
export const POINTS_Z_INDEX = 7;
export const PAUSE_NOTICE_Z_INDEX = 8;
export const GAME_OVER_NOTICE_Z_INDEX = 8;
export const CURTAIN_Z_INDEX = 9;
export const LEVEL_TITLE_Z_INDEX = 10;
export const ALERT_MODAL_Z_INDEX = 11;
export const DEBUG_COLLISION_RECT_Z_INDEX = 20;
export const DEBUG_GRID_Z_INDEX = 21;
