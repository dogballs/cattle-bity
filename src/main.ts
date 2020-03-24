import * as Stats from 'stats.js';

import {
  GameObject,
  GameLoop,
  GameRenderer,
  Logger,
  State,
  Vector,
  AudioLoader,
  ImageLoader,
  RectFontLoader,
  SpriteFontLoader,
  SpriteLoader,
} from './core';
import { DebugInspector } from './debug';
import { GameObjectUpdateArgs, GameState, Session } from './game';
import { InputManager } from './input';
import { MapLoader } from './map';
import {
  EditorScene,
  GameOverScene,
  KeybindingMenuScene,
  LevelScene,
  LevelSelectionScene,
  MainMenuScene,
  ScoreScene,
  SceneManager,
  SceneType,
  SettingsMenuScene,
  TestScene,
} from './scenes';

import * as config from './config';

import * as audioManifest from '../data/audio/audio.manifest.json';
import * as spriteManifest from '../data/graphics/sprite.manifest.json';
import * as spriteFontConfig from '../data/fonts/sprite-font.json';
import * as rectFontConfig from '../data/fonts/rect-font.json';
import * as mapManifest from '../data/maps/map.manifest.json';

const log = new Logger('main', Logger.Level.Debug);

const gameRenderer = new GameRenderer({
  // debug: true,
  height: config.CANVAS_HEIGHT,
  width: config.CANVAS_WIDTH,
});
document.body.appendChild(gameRenderer.getDomElement());

const inputManager = new InputManager();
inputManager.listen();

const audioLoader = new AudioLoader(audioManifest, config.AUDIO_BASE_PATH);
const imageLoader = new ImageLoader(config.GRAPHICS_BASE_PATH);

const spriteFontLoader = new SpriteFontLoader(imageLoader);
spriteFontLoader.register(config.PRIMARY_SPRITE_FONT_ID, spriteFontConfig, {
  scale: 4,
});

const spriteLoader = new SpriteLoader(imageLoader, spriteManifest, {
  scale: 4,
});

const rectFontLoader = new RectFontLoader();
rectFontLoader.register(config.PRIMARY_RECT_FONT_ID, rectFontConfig, {
  scale: config.TILE_SIZE_SMALL,
});

const mapLoader = new MapLoader(mapManifest);

const session = new Session();

const sceneManager = new SceneManager(SceneType.MainMenu);
sceneManager.register(SceneType.Editor, EditorScene);
sceneManager.register(SceneType.GameOver, GameOverScene);
sceneManager.register(SceneType.KeybindingMenu, KeybindingMenuScene);
sceneManager.register(SceneType.Level, LevelScene);
sceneManager.register(SceneType.LevelSelection, LevelSelectionScene);
sceneManager.register(SceneType.MainMenu, MainMenuScene);
sceneManager.register(SceneType.SettingsMenu, SettingsMenuScene);
sceneManager.register(SceneType.Score, ScoreScene);
sceneManager.register(SceneType.Test, TestScene);
sceneManager.start();

const debugInspector = new DebugInspector(gameRenderer.getDomElement());
debugInspector.listen();
debugInspector.click.addListener((position: Vector) => {
  const intersections: GameObject[] = [];

  const scene = sceneManager.getScene();
  scene.root.traverseDescedants((child) => {
    if (child.getWorldBoundingBox().containsPoint(position)) {
      intersections.push(child);
    }
  });
  log.debug(intersections);
});

const gameState = new State<GameState>(GameState.Playing);

const updateArgs: GameObjectUpdateArgs = {
  audioLoader,
  deltaTime: 0,
  imageLoader,
  input: inputManager.getInput(),
  inputManager,
  gameState,
  mapLoader,
  rectFontLoader,
  session,
  spriteFontLoader,
  spriteLoader,
};

const stats = new Stats();

if (config.IS_DEV) {
  document.body.appendChild(stats.dom);
}

const gameLoop = new GameLoop();
gameLoop.tick.addListener((event) => {
  stats.begin();

  inputManager.update();

  updateArgs.deltaTime = event.deltaTime;

  const scene = sceneManager.getScene();
  scene.invokeUpdate(updateArgs);

  gameRenderer.render(scene.root);

  gameState.tick();

  stats.end();
});

async function main(): Promise<void> {
  log.time('Audio preload');
  await audioLoader.preloadAllAsync();
  log.timeEnd('Audio preload');

  log.time('Rect font preload');
  await rectFontLoader.preloadAll();
  log.timeEnd('Rect font preload');

  log.time('Sprite font preload');
  await spriteFontLoader.preloadAllAsync();
  log.timeEnd('Sprite font preload');

  log.time('Sprites preload');
  await spriteLoader.preloadAllAsync();
  log.timeEnd('Sprites preload');

  log.time('Input bindings load');
  inputManager.loadAllBindings();
  log.timeEnd('Input bindings load');

  gameLoop.start();
  // gameLoop.next();
}

main();

if (config.IS_DEV) {
  window.gameLoop = gameLoop;
}
