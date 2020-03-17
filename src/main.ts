import {
  GameObject,
  GameLoop,
  GameRenderer,
  Input,
  KeyboardInputDevice,
  Logger,
  State,
  Vector,
  AudioLoader,
  RectFontLoader,
  SpriteFontLoader,
  SpriteLoader,
  TextureLoader,
} from './core';
import { DebugInspector } from './debug';
import { GameObjectUpdateArgs, GameState, Session } from './game';
import { KeyboardInputMap } from './input';
import { MapLoader } from './map';
import {
  EditorScene,
  GameOverScene,
  LevelScene,
  MenuScene,
  StageSelectionScene,
  ScoreScene,
  SceneManager,
  SceneType,
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
document.body.appendChild(gameRenderer.getElement());

const inputDevice = new KeyboardInputDevice();
const inputMap = KeyboardInputMap;
const input = new Input();
input.setDevice(inputDevice);
input.setMap(inputMap);
inputDevice.listen();

const audioLoader = new AudioLoader(audioManifest, config.AUDIO_BASE_PATH);
const textureLoader = new TextureLoader(config.GRAPHICS_BASE_PATH);

const spriteFontLoader = new SpriteFontLoader(textureLoader);
spriteFontLoader.register(config.PRIMARY_SPRITE_FONT_ID, spriteFontConfig, {
  scale: 4,
});

const spriteLoader = new SpriteLoader(textureLoader, spriteManifest, {
  scale: 4,
});

const rectFontLoader = new RectFontLoader();
rectFontLoader.register(config.PRIMARY_RECT_FONT_ID, rectFontConfig, {
  scale: config.TILE_SIZE_SMALL,
});

const mapLoader = new MapLoader(mapManifest);

const session = new Session();

const sceneManager = new SceneManager(SceneType.Menu);
sceneManager.register(SceneType.Editor, EditorScene);
sceneManager.register(SceneType.GameOver, GameOverScene);
sceneManager.register(SceneType.Menu, MenuScene);
sceneManager.register(SceneType.Level, LevelScene);
sceneManager.register(SceneType.LevelSelection, StageSelectionScene);
sceneManager.register(SceneType.Score, ScoreScene);
sceneManager.register(SceneType.Test, TestScene);
sceneManager.start();

const debugInspector = new DebugInspector(gameRenderer.getElement());
debugInspector.listen();
debugInspector.click.addListener((position: Vector) => {
  const intersections: GameObject[] = [];

  const scene = sceneManager.getScene();
  scene.root.traverseDescedants((child) => {
    if (child.getWorldBoundingBox().containsPoint(position)) {
      intersections.push(child);
    }
  });
  console.log(intersections);
});

const gameState = new State<GameState>(GameState.Playing);

const updateArgs: GameObjectUpdateArgs = {
  audioLoader,
  input,
  gameState,
  mapLoader,
  rectFontLoader,
  session,
  spriteFontLoader,
  spriteLoader,
  textureLoader,
};

const gameLoop = new GameLoop();
gameLoop.tick.addListener(() => {
  input.update();

  const scene = sceneManager.getScene();
  scene.invokeUpdate(updateArgs);

  gameRenderer.render(scene.root);

  gameState.tick();
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

  gameLoop.start();
  // gameLoop.next();
}

main();

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
window.gameLoop = gameLoop;
