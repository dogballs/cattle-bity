export const AUDIO_BASE_PATH = 'data/audio/';
export const GRAPHICS_BASE_PATH = 'data/graphics/';

export const TILE_SIZE_SMALL = 16;
export const TILE_SIZE_MEDIUM = 32;
export const TILE_SIZE_LARGE = 64;

export const FIELD_TILE_COUNT = 13;
export const FIELD_SIZE = FIELD_TILE_COUNT * TILE_SIZE_LARGE;

export const BORDER_LEFT_WIDTH = 64;
export const BORDER_RIGHT_WIDTH = 128;
export const BORDER_TOP_BOTTOM_HEIGHT = 32;
export const CANVAS_WIDTH = FIELD_SIZE + BORDER_LEFT_WIDTH + BORDER_RIGHT_WIDTH;
export const CANVAS_HEIGHT = FIELD_SIZE + BORDER_TOP_BOTTOM_HEIGHT * 2;

export const BRICK_TILE_SIZE = TILE_SIZE_SMALL;
export const STEEL_TILE_SIZE = TILE_SIZE_MEDIUM;

export const FPS = 60;

export const PLAYER_FIRST_SPAWN_DELAY = 0;
export const PLAYER_SPAWN_DELAY = 0;
export const ENEMY_FIRST_SPAWN_DELAY = 10;
export const ENEMY_SPAWN_DELAY = 3 * FPS;

export const ENEMY_MAX_TOTAL_COUNT = 20;
export const ENEMY_MAX_ALIVE_COUNT = 4;

export const POWERUP_DURATION = 30 * FPS;
export const SHIELD_SPAWN_DURATION = 3.5 * FPS;
export const SHIELD_POWERUP_DURATION = 10 * FPS;
export const BASE_DEFENCE_POWERUP_DURATION = 17 * FPS;
export const FREEZE_POWERUP_DURATION = 10 * FPS;

export const POINTS_POWERUP_DURATION = 50;
export const POINTS_ENEMY_TANK_DURATION = 10;

export const BACKGROUND_COLOR = '#636363';
