import {
  Input,
  State,
  AudioLoader,
  ImageLoader,
  RectFontLoader,
  SpriteFontLoader,
  SpriteLoader,
} from '../core';
import { InputManager } from '../input';
import { MapLoader } from '../map';

import { GameState } from './GameState';
import { Session } from './Session';

export interface GameUpdateArgs {
  audioLoader: AudioLoader;
  deltaTime: number;
  imageLoader: ImageLoader;
  input: Input;
  inputManager: InputManager;
  gameState: State<GameState>;
  mapLoader: MapLoader;
  rectFontLoader: RectFontLoader;
  session: Session;
  spriteFontLoader: SpriteFontLoader;
  spriteLoader: SpriteLoader;
}
