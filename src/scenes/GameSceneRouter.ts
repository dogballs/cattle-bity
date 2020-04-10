import { GameObject, SceneRouter } from '../core';
import * as config from '../config';

import { EditorEnemyScene, EditorMapScene, EditorMenuScene } from './editor';
import {
  LevelLoadScene,
  LevelSelectionScene,
  LevelPlayScene,
  LevelScoreScene,
} from './level';
import {
  MainGameOverScene,
  MainHighscoreScene,
  MainMenuScene,
  MainVictoryScene,
} from './main';
import {
  SettingsAudioScene,
  SettingsKeybindingScene,
  SettingsMenuScene,
} from './settings';
import { SandboxTransformScene } from './sandbox';

import { GameSceneType } from './GameSceneType';

// Composition root for game scenes
export class GameSceneRouter extends SceneRouter {
  public constructor() {
    super();

    this.register(GameSceneType.EditorEnemy, EditorEnemyScene);
    this.register(GameSceneType.EditorMap, EditorMapScene);
    this.register(GameSceneType.EditorMenu, EditorMenuScene);
    this.register(GameSceneType.MainGameOver, MainGameOverScene);
    this.register(GameSceneType.MainHighscore, MainHighscoreScene);
    this.register(GameSceneType.MainMenu, MainMenuScene);
    this.register(GameSceneType.MainVictory, MainVictoryScene);
    this.register(GameSceneType.LevelLoad, LevelLoadScene);
    this.register(GameSceneType.LevelSelection, LevelSelectionScene);
    this.register(GameSceneType.LevelScore, LevelScoreScene);
    this.register(GameSceneType.LevelPlay, LevelPlayScene);
    this.register(GameSceneType.MainMenu, MainMenuScene);
    this.register(GameSceneType.SettingsAudio, SettingsAudioScene);
    this.register(GameSceneType.SettingsMenu, SettingsMenuScene);
    this.register(GameSceneType.SettingsKeybinding, SettingsKeybindingScene);
    this.register(GameSceneType.SandboxTransform, SandboxTransformScene);
  }

  protected createRoot(): GameObject {
    const root = new GameObject();
    root.size.set(config.CANVAS_WIDTH, config.CANVAS_HEIGHT);
    return root;
  }
}
