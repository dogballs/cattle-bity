import { DebugCollisionMenu } from '../../debug';
import { GameUpdateArgs, GameState, Session } from '../../game';
import { Border } from '../../gameObjects';
import { InputManager } from '../../input';
import { PowerupType } from '../../powerup';
import { TerrainFactory } from '../../terrain';
import * as config from '../../config';

import { LevelEventBus, LevelScript, LevelWorld } from '../../level';
import {
  LevelEnemyDiedEvent,
  LevelPlayerDiedEvent,
  LevelPowerupPickedEvent,
} from '../../level/events';
import {
  LevelAudioScript,
  LevelBaseScript,
  LevelEnemyScript,
  LevelExplosionScript,
  LevelGameOverScript,
  LevelInfoScript,
  LevelIntroScript,
  LevelPauseScript,
  LevelPlayerScript,
  LevelPointsScript,
  LevelPowerupScript,
  LevelSpawnScript,
  LevelWinScript,
} from '../../level/scripts';

import { GameScene } from '../GameScene';
import { GameSceneType } from '../GameSceneType';

import { LevelPlayLocationParams } from './params';

export class LevelPlayScene extends GameScene<LevelPlayLocationParams> {
  private world: LevelWorld;
  private eventBus: LevelEventBus;
  private session: Session;
  private inputManager: InputManager;
  private debugCollisionMenu: DebugCollisionMenu;

  private allScripts: LevelScript[] = [];
  private alwaysUpdateScripts: LevelScript[] = [];
  private playingUpdateScripts: LevelScript[] = [];

  private audioScript: LevelAudioScript;
  private baseScript: LevelBaseScript;
  private enemyScript: LevelEnemyScript;
  private explosionScript: LevelExplosionScript;
  private gameOverScript: LevelGameOverScript;
  private infoScript: LevelInfoScript;
  private introScript: LevelIntroScript;
  private playerScript: LevelPlayerScript;
  private pointsScript: LevelPointsScript;
  private powerupScript: LevelPowerupScript;
  private pauseScript: LevelPauseScript;
  private spawnScript: LevelSpawnScript;
  private winScript: LevelWinScript;

  protected setup(updateArgs: GameUpdateArgs): void {
    const { collisionSystem, inputManager, session } = updateArgs;

    this.debugCollisionMenu = new DebugCollisionMenu(
      collisionSystem,
      this.root,
      { top: 470 },
    );
    if (config.IS_DEV) {
      this.debugCollisionMenu.attach();
      this.debugCollisionMenu.show();
    }

    this.world = new LevelWorld(this.root);

    this.root.add(new Border());

    this.world.field.position.set(
      config.BORDER_LEFT_WIDTH,
      config.BORDER_TOP_BOTTOM_HEIGHT,
    );
    this.root.add(this.world.field);

    this.eventBus = new LevelEventBus();

    this.inputManager = inputManager;
    this.session = session;

    const { mapConfig } = this.params;

    const terrainRegions = mapConfig.getTerrainRegions();
    const tiles = TerrainFactory.createMapFromRegionConfigs(terrainRegions);

    for (const tile of tiles) {
      tile.destroyed.addListener(() => {
        this.eventBus.mapTileDestroyed.notify({
          type: tile.type,
          position: tile.position.clone(),
          size: tile.size.clone(),
        });
      });
    }

    this.world.field.add(...tiles);

    this.audioScript = new LevelAudioScript();
    this.baseScript = new LevelBaseScript();
    this.enemyScript = new LevelEnemyScript();
    this.explosionScript = new LevelExplosionScript();
    this.gameOverScript = new LevelGameOverScript();
    this.infoScript = new LevelInfoScript();
    this.introScript = new LevelIntroScript();
    this.pauseScript = new LevelPauseScript();
    this.playerScript = new LevelPlayerScript();
    this.pointsScript = new LevelPointsScript();
    this.powerupScript = new LevelPowerupScript();
    this.spawnScript = new LevelSpawnScript();
    this.winScript = new LevelWinScript();

    this.allScripts = [
      this.audioScript,
      this.baseScript,
      this.enemyScript,
      this.explosionScript,
      this.gameOverScript,
      this.infoScript,
      this.introScript,
      this.pauseScript,
      this.playerScript,
      this.pointsScript,
      this.powerupScript,
      this.spawnScript,
      this.winScript,
    ];

    this.allScripts.forEach((script) => {
      script.invokeInit(this.world, this.eventBus, session, mapConfig);
    });

    // When intro starts, enable only it and audio
    this.alwaysUpdateScripts = [this.audioScript, this.introScript];

    // When intro is completed, enable the rest of the scripts
    this.introScript.completed.addListener(() => {
      this.alwaysUpdateScripts.push(
        this.gameOverScript,
        this.pauseScript,
        this.winScript,
      );

      this.playingUpdateScripts.push(
        this.baseScript,
        this.explosionScript,
        this.infoScript,
        this.enemyScript,
        this.spawnScript,
        this.playerScript,
        this.pointsScript,
        this.powerupScript,
      );
    });

    this.eventBus.baseDied.addListener(this.handleBaseDied);
    this.eventBus.enemyAllDied.addListener(this.handleEnemyAllDied);
    this.eventBus.enemyDied.addListener(this.handleEnemyDied);
    this.eventBus.playerDied.addListener(this.handlePlayerDied);
    this.eventBus.powerupPicked.addListener(this.handlePowerupPicked);
    this.eventBus.levelGameOverCompleted.addListener(
      this.handleLevelGameOverCompleted,
    );
    this.eventBus.levelGameOverMoveBlocked.addListener(
      this.handleLevelGameOverMoveBlocked,
    );
    this.eventBus.levelWinCompleted.addListener(this.handleLevelWinCompleted);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { collisionSystem, gameState } = updateArgs;

    this.alwaysUpdateScripts.forEach((script) => {
      script.invokeUpdate(updateArgs);
    });

    if (!gameState.is(GameState.Paused)) {
      // These scripts won't run when game is paused
      this.playingUpdateScripts.forEach((script) => {
        // Extra check not to run same script twice
        if (this.alwaysUpdateScripts.includes(script)) {
          return;
        }

        script.invokeUpdate(updateArgs);
      });
    }

    // Update all objects on the scene
    this.root.traverseDescedants((node) => {
      const shouldUpdate = gameState.is(GameState.Playing) || node.ignorePause;
      if (shouldUpdate) {
        node.invokeUpdate(updateArgs);
      }
    });

    this.root.updateWorldMatrix(false, true);

    collisionSystem.update();

    if (config.IS_DEV) {
      this.debugCollisionMenu.update();
    }

    collisionSystem.collide();
  }

  private handlePlayerDied = (event: LevelPlayerDiedEvent): void => {
    const playerSession = this.session.getPlayer(event.playerIndex);
    playerSession.removeLife();

    if (this.session.isAnyPlayerAlive()) {
      return;
    }

    // If both players die - game is lost

    this.session.setGameOver();

    this.pauseScript.disable();
    this.playerScript.disable();
    this.gameOverScript.enable();

    // Player can lose even after level is won
    this.winScript.disable();
  };

  private handleEnemyAllDied = (): void => {
    this.pauseScript.disable();
    this.winScript.enable();
  };

  private handleEnemyDied = (event: LevelEnemyDiedEvent): void => {
    this.session.primaryPlayer.addKillPoints(event.type.tier);
  };

  private handlePowerupPicked = (event: LevelPowerupPickedEvent): void => {
    this.session.primaryPlayer.addPowerupPoints(event.type);

    if (event.type === PowerupType.Life) {
      this.session.primaryPlayer.addLife();
    }
  };

  private handleBaseDied = (): void => {
    this.session.setGameOver();

    this.pauseScript.disable();
    this.playerScript.disable();
    this.gameOverScript.enable();

    // Player can lose even after level is won
    this.winScript.disable();
  };

  // Block user input after some delay when game is over
  private handleLevelGameOverMoveBlocked = (): void => {
    this.inputManager.unlisten();
  };

  private handleLevelGameOverCompleted = (): void => {
    // Restore input
    this.inputManager.listen();

    if (this.session.isPlaytest()) {
      this.navigator.replace(GameSceneType.EditorMenu);
      return;
    }

    this.navigator.replace(GameSceneType.LevelScore);
  };

  private handleLevelWinCompleted = (): void => {
    if (this.session.isPlaytest()) {
      this.navigator.replace(GameSceneType.EditorMenu);
      return;
    }

    this.navigator.replace(GameSceneType.LevelScore);
  };
}
