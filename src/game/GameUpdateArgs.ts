import {
  AudioLoader,
  CollisionSystem,
  ColorSpriteFontGenerator,
  ImageLoader,
  RectFontLoader,
  SpriteFontLoader,
  SpriteLoader,
  State,
} from '../core';
import { InputHintSettings, InputManager } from '../input';
import { MapLoader } from '../map';
import { PointsHighscoreManager } from '../points';

import { AudioManager } from './AudioManager';
import { GameState } from './GameState';
import { GameStorage } from './GameStorage';
import { Session } from './Session';

export interface GameUpdateArgs {
  audioManager: AudioManager;
  audioLoader: AudioLoader;
  collisionSystem: CollisionSystem;
  colorSpriteFontGenerator: ColorSpriteFontGenerator;
  deltaTime: number;
  imageLoader: ImageLoader;
  inputHintSettings: InputHintSettings;
  inputManager: InputManager;
  gameState: State<GameState>;
  gameStorage: GameStorage;
  mapLoader: MapLoader;
  pointsHighscoreManager: PointsHighscoreManager;
  rectFontLoader: RectFontLoader;
  session: Session;
  spriteFontLoader: SpriteFontLoader;
  spriteLoader: SpriteLoader;
}
