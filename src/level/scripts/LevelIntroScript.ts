import { Subject, Timer } from '../../core';
import { GameScript, GameUpdateArgs, Session } from '../../game';
import { Curtain, LevelTitle } from '../../gameObjects';
import * as config from '../../config';

import { LevelEventBus } from '../LevelEventBus';
import { LevelWorld } from '../LevelWorld';

export class LevelIntroScript extends GameScript {
  public completed = new Subject();
  private world: LevelWorld;
  private eventBus: LevelEventBus;
  private session: Session;
  private curtain: Curtain;
  private title: LevelTitle;
  private timer: Timer;

  constructor(world: LevelWorld, eventBus: LevelEventBus, session: Session) {
    super();

    this.world = world;
    this.eventBus = eventBus;
    this.session = session;

    this.timer = new Timer(config.LEVEL_START_DELAY);
    this.timer.done.addListener(this.handleTimer);
  }

  protected setup(): void {
    // TODO: add them last order is important
    // TODO: curtain is displayed on top of scenes? (transition between levels)
    this.curtain = new Curtain(
      this.world.sceneRoot.size.width,
      this.world.sceneRoot.size.height,
      false,
    );
    this.world.sceneRoot.add(this.curtain);

    this.title = new LevelTitle(this.session.getLevelNumber());
    this.title.setCenter(this.world.sceneRoot.getSelfCenter());
    this.title.origin.set(0.5, 0.5);
    this.world.sceneRoot.add(this.title);

    this.curtain.open();
  }

  protected update({ deltaTime }: GameUpdateArgs): void {
    this.timer.update(deltaTime);
  }

  private handleTimer = (): void => {
    this.title.visible = false;
    this.completed.notify(null);
  };
}
