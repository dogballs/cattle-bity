import { GameObject, Subject, Timer } from '../core';
import { GameObjectUpdateArgs } from '../game';
import { PointsRecord } from '../points';
import { TankTier } from '../tank/TankTier'; // TODO: circular dep?
import * as config from '../config';

import { ScoreTableCounter } from './ScoreTableCounter';
import { ScoreTableTierIcon } from './ScoreTableTierIcon';
import { ScoreTableUnderline } from './ScoreTableUnderline';
import { SpriteText } from './SpriteText';

enum State {
  Idle,
  Transitioning,
  Counting,
  Done,
}

const TIERS = [TankTier.A, TankTier.B, TankTier.C, TankTier.D];
const TRANSITION_DELAY = 0.13;

export class ScoreTable extends GameObject {
  public done = new Subject();
  private record: PointsRecord;
  private playerLabel = new SpriteText('Ⅰ-PLAYER', { color: config.COLOR_RED });
  private underline = new ScoreTableUnderline();
  private totalPoints = new SpriteText('', { color: config.COLOR_YELLOW });
  private totalLabel = new SpriteText('TOTAL', { color: config.COLOR_WHITE });
  private totalKills = new SpriteText('', { color: config.COLOR_WHITE });
  private counters: ScoreTableCounter[] = [];
  private currentCounterIndex = 0;
  private state = State.Idle;
  private transitionTimer = new Timer();

  constructor(record: PointsRecord) {
    super(832, 544);

    this.record = record;
  }

  protected setup(): void {
    this.playerLabel.position.set(256, 0);
    this.playerLabel.origin.setX(1);
    this.add(this.playerLabel);

    this.totalPoints.setText(this.record.getTotalPoints().toString());
    this.totalPoints.position.set(256, 64);
    this.totalPoints.origin.set(1, 0);
    this.add(this.totalPoints);

    TIERS.forEach((tier, index) => {
      const icon = new ScoreTableTierIcon(tier);
      icon.setCenter(this.getSelfCenter());
      icon.position.setY(136 + 100 * index);
      this.add(icon);

      const cost = this.record.getTierKillCost(tier);
      const kills = this.record.getTierKillCount(tier);

      const counter = new ScoreTableCounter(kills, cost);
      counter.position.set(4, 152 + 100 * index);
      this.counters.push(counter);
      this.add(counter);
    });

    this.underline.setCenter(this.getSelfCenter());
    this.underline.position.setY(504);
    this.add(this.underline);

    this.totalLabel.position.set(256, 516);
    this.totalLabel.origin.set(1, 0);
    this.add(this.totalLabel);

    this.totalKills.position.set(348, 516);
    this.totalKills.origin.set(1, 0);
    this.add(this.totalKills);
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    if (this.state === State.Idle || this.state === State.Done) {
      return;
    }

    if (this.state === State.Transitioning) {
      if (this.transitionTimer.isDone()) {
        if (this.allCountersDone()) {
          this.totalKills.setText(this.record.getKillTotalCount().toString());
          this.state = State.Done;
          this.done.notify();
          return;
        }

        const counter = this.getCurrentCounter();
        counter.start();
        this.state = State.Counting;
      }

      this.transitionTimer.update(updateArgs.deltaTime);
      return;
    }

    if (this.state === State.Counting) {
      const counter = this.getCurrentCounter();
      if (counter.isDone()) {
        if (this.hasNextCounter()) {
          this.currentCounterIndex += 1;
        }

        this.state = State.Transitioning;
        this.transitionTimer.reset(TRANSITION_DELAY);
        return;
      }
    }
  }

  public start(): void {
    if (this.state !== State.Idle) {
      return;
    }

    this.state = State.Transitioning;
    this.transitionTimer.reset(TRANSITION_DELAY);
  }

  private getCurrentCounter(): ScoreTableCounter {
    return this.counters[this.currentCounterIndex];
  }

  private hasNextCounter(): boolean {
    return this.currentCounterIndex < this.counters.length - 1;
  }

  private allCountersDone(): boolean {
    const lastCounter = this.counters[this.counters.length - 1];
    return lastCounter.isDone();
  }
}
