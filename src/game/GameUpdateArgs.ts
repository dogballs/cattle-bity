import {
  AudioLoader,
  CollisionSystem,
  ImageLoader,
  Input,
  RectFontLoader,
  SpriteFontLoader,
  SpriteLoader,
  State,
  Storage,
} from '../core';
import { InputManager } from '../input';
import { MapLoader } from '../map';
import { PointsHighscoreStorage } from '../points';

import { AudioManager } from './AudioManager';
import { GameState } from './GameState';
import { Session } from './Session';

export interface GameUpdateArgs {
  audioManager: AudioManager;
  audioLoader: AudioLoader;
  collisionSystem: CollisionSystem;
  deltaTime: number;
  highscoreStorage: PointsHighscoreStorage;
  imageLoader: ImageLoader;
  input: Input;
  inputManager: InputManager;
  gameState: State<GameState>;
  mapLoader: MapLoader;
  rectFontLoader: RectFontLoader;
  session: Session;
  spriteFontLoader: SpriteFontLoader;
  spriteLoader: SpriteLoader;
  storage: Storage;
}
