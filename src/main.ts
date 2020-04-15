import * as Stats from 'stats.js';

import {
  AudioLoader,
  CollisionSystem,
  ColorSpriteFontGenerator,
  GameObject,
  GameLoop,
  GameRenderer,
  ImageLoader,
  LocalStorage,
  Logger,
  RectFontLoader,
  SpriteFontLoader,
  SpriteLoader,
  State,
  Vector,
} from './core';
import { DebugGameLoopMenu, DebugInspector } from './debug';
import { AudioManager, GameUpdateArgs, GameState, Session } from './game';
import { InputManager } from './input';
import { ManifestMapListReader, MapLoader } from './map';
import { PointsHighscoreStorage } from './points';
import { GameSceneRouter, GameSceneType } from './scenes';

import * as config from './config';

import * as audioManifest from '../data/audio.manifest.json';
import * as spriteManifest from '../data/sprite.manifest.json';
import * as spriteFontConfig from '../data/fonts/sprite-font.json';
import * as rectFontConfig from '../data/fonts/rect-font.json';
import * as mapManifest from '../data/map.manifest.json';

const loadingElement = document.querySelector('[data-loading]');

const log = new Logger('main', Logger.Level.Debug);

const gameRenderer = new GameRenderer({
  // debug: true,
  height: config.CANVAS_HEIGHT,
  width: config.CANVAS_WIDTH,
});

const storage = new LocalStorage(config.STORAGE_NAMESPACE);
const highscoreStorage = new PointsHighscoreStorage(storage);
storage.load();

const inputManager = new InputManager(storage);
inputManager.listen();

const audioLoader = new AudioLoader(audioManifest);
const imageLoader = new ImageLoader();

const spriteFontLoader = new SpriteFontLoader(imageLoader);
spriteFontLoader.register(config.PRIMARY_SPRITE_FONT_ID, spriteFontConfig);

const colorSpriteFontGenerator = new ColorSpriteFontGenerator(spriteFontLoader);
colorSpriteFontGenerator.register(
  config.PRIMARY_SPRITE_FONT_ID,
  config.COLOR_BLACK,
);

const spriteLoader = new SpriteLoader(imageLoader, spriteManifest, {
  scale: 4,
});

const rectFontLoader = new RectFontLoader();
rectFontLoader.register(config.PRIMARY_RECT_FONT_ID, rectFontConfig, {
  scale: config.TILE_SIZE_SMALL,
});

const manifestMapListReader = new ManifestMapListReader(mapManifest);
const mapLoader = new MapLoader(manifestMapListReader);

const audioManager = new AudioManager(audioLoader, storage);
audioManager.loadSettings();

const session = new Session();

const collisionSystem = new CollisionSystem();

const sceneRouter = new GameSceneRouter();
sceneRouter.start(GameSceneType.LevelLoad);
sceneRouter.transitionStarted.addListener(() => {
  collisionSystem.reset();
});

const debugInspector = new DebugInspector(gameRenderer.getDomElement());
debugInspector.listen();
debugInspector.click.addListener((position: Vector) => {
  const intersections: GameObject[] = [];

  const scene = sceneRouter.getCurrentScene();
  scene.getRoot().traverseDescedants((child) => {
    if (child.getWorldBoundingBox().containsPoint(position)) {
      intersections.push(child);
    }
  });
  log.debug(intersections);
});

const gameState = new State<GameState>(GameState.Playing);

const updateArgs: GameUpdateArgs = {
  audioManager,
  audioLoader,
  collisionSystem,
  colorSpriteFontGenerator,
  deltaTime: 0,
  highscoreStorage,
  imageLoader,
  input: inputManager.getInput(),
  inputManager,
  gameState,
  mapLoader,
  rectFontLoader,
  session,
  spriteFontLoader,
  spriteLoader,
  storage,
};

const gameLoop = new GameLoop();

const stats = new Stats();
const debugGameLoopMenu = new DebugGameLoopMenu(gameLoop);

if (config.IS_DEV) {
  document.body.appendChild(stats.dom);
  debugGameLoopMenu.attach();
}

gameLoop.tick.addListener((event) => {
  stats.begin();

  inputManager.update();

  updateArgs.deltaTime = event.deltaTime;

  const scene = sceneRouter.getCurrentScene();
  scene.invokeUpdate(updateArgs);

  gameRenderer.render(scene.getRoot());

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

  log.time('Color sprite font generation');
  colorSpriteFontGenerator.generate(
    config.PRIMARY_SPRITE_FONT_ID,
    config.COLOR_WHITE,
  );
  colorSpriteFontGenerator.generate(
    config.PRIMARY_SPRITE_FONT_ID,
    config.COLOR_GRAY,
  );
  colorSpriteFontGenerator.generate(
    config.PRIMARY_SPRITE_FONT_ID,
    config.COLOR_RED,
  );
  colorSpriteFontGenerator.generate(
    config.PRIMARY_SPRITE_FONT_ID,
    config.COLOR_YELLOW,
  );
  log.timeEnd('Color sprite font generation');

  log.time('Sprites preload');
  await spriteLoader.preloadAllAsync();
  log.timeEnd('Sprites preload');

  log.time('Input bindings load');
  inputManager.loadAllBindings();
  log.timeEnd('Input bindings load');

  document.body.removeChild(loadingElement);
  document.body.appendChild(gameRenderer.getDomElement());

  gameLoop.start();
  // gameLoop.next();
}

main();

if (config.IS_DEV) {
  window.gameLoop = gameLoop;
}
