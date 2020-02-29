import { GameObject, GameObjectUpdateArgs, Sound, Timer } from '../core';
import * as config from '../config';

import { SpriteText } from './SpriteText';

enum State {
  Idle,
  Progress,
  Done,
}
const INCREMENT_DELAY = 3;

export class ScoreTableCounter extends GameObject {
  private pointsLabel = new SpriteText('PTS', { color: config.COLOR_WHITE });
  private pointsText = new SpriteText('', { color: config.COLOR_WHITE });
  private killsText = new SpriteText('', { color: config.COLOR_WHITE });
  private timer = new Timer();
  private incrementSound: Sound;

  private state = State.Idle;
  private currentKills = 0;
  private targetKills = 0;
  private killCost = 0;

  constructor(targetKills: number, killCost: number) {
    super(344, 28);

    this.targetKills = targetKills;
    this.killCost = killCost;
  }

  protected setup({ audioLoader }: GameObjectUpdateArgs): void {
    this.incrementSound = audioLoader.load('score');

    this.pointsLabel.position.setX(160);
    this.add(this.pointsLabel);

    this.pointsText.position.setX(124);
    this.pointsText.pivot.setX(1);
    this.add(this.pointsText);

    this.killsText.position.setX(this.size.width);
    this.killsText.pivot.setX(1);
    this.add(this.killsText);
  }

  protected update(): void {
    if (this.state !== State.Progress) {
      return;
    }

    if (this.timer.isDone()) {
      this.updateText();
      this.incrementSound.play();

      this.currentKills += 1;

      if (this.currentKills > this.targetKills) {
        this.state = State.Done;
        return;
      }

      this.timer.reset(INCREMENT_DELAY);
    }

    this.timer.tick();
  }

  public start(): void {
    if (this.state !== State.Idle) {
      return;
    }

    if (this.currentKills === this.targetKills) {
      this.updateText();
      this.state = State.Done;
      return;
    }

    this.state = State.Progress;
    this.timer.reset(INCREMENT_DELAY);
  }

  private updateText(): void {
    const points = this.currentKills * this.killCost;

    this.pointsText.setText(points.toString());
    this.killsText.setText(this.currentKills.toString());
  }

  public isIdle(): boolean {
    return this.state === State.Idle;
  }

  public isProgress(): boolean {
    return this.state === State.Progress;
  }

  public isDone(): boolean {
    return this.state === State.Done;
  }
}
