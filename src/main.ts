import {
  GameLoop,
  GameObject,
  GameRenderer,
  GameState,
  KeyboardInput,
  State,
  Vector,
} from './core';

import * as config from './config';

import { AudioManager } from './audio/AudioManager';
import { DebugInspector } from './debug';

import { LevelScene } from './scenes';

const gameRenderer = new GameRenderer({
  // debug: true,
  height: config.CANVAS_HEIGHT,
  width: config.CANVAS_WIDTH,
});
document.body.appendChild(gameRenderer.domElement);

const input = new KeyboardInput();
input.listen();

// const debug = new DebugController(spawner);

const currentScene = new LevelScene();
// const currentScene = new GameOverScene(
//   config.CANVAS_WIDTH,
//   config.CANVAS_HEIGHT,
// );

const debugInspector = new DebugInspector(gameRenderer.domElement);
debugInspector.listen();
debugInspector.click.addListener((position: Vector) => {
  const intersections: GameObject[] = [];
  currentScene.root.traverse((child) => {
    if (child.getWorldBoundingBox().contains(position)) {
      intersections.push(child);
    }
  });
  console.log(intersections);
});

AudioManager.preloadAll();

const gameState = new State<GameState>(GameState.Playing);

currentScene.setup();

const gameLoop = new GameLoop({
  onTick: (): void => {
    input.update();

    currentScene.update({ gameState, input });

    gameRenderer.render(currentScene.root);

    gameState.tick();
  },
});

gameLoop.start();

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
window.gameLoop = gameLoop;

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// window.debug = debug;
