import { Subject } from '../core';
import { PointsRecord } from '../points';
import { PowerupType } from '../powerups';
import { TankTier } from '../tank';
import * as config from '../config';

enum State {
  Idle,
  Playing,
  GameOver,
}

export class Session {
  public lifeup = new Subject();

  private seenIntro: boolean;
  private startLevelNumber: number;
  private currentLevelNumber: number;
  private levelPointsRecord: PointsRecord;
  private totalPoints: number;
  private lives: number;
  private nextLifePointThreshold: number;
  private state: State;

  constructor() {
    this.reset();
  }

  public start(startLevelNumber: number): void {
    if (this.state !== State.Idle) {
      return;
    }

    this.startLevelNumber = startLevelNumber;
    this.currentLevelNumber = startLevelNumber;
    this.state = State.Playing;
  }

  public reset(): void {
    this.seenIntro = false;
    this.startLevelNumber = 1;
    this.currentLevelNumber = 1;
    this.levelPointsRecord = new PointsRecord();
    this.totalPoints = 0;
    this.lives = config.PLAYER_INITIAL_LIVES;
    this.nextLifePointThreshold = config.PLAYER_EXTRA_LIVE_POINTS;
    this.state = State.Idle;
  }

  public activateNextLevel(): void {
    this.currentLevelNumber += 1;
    this.totalPoints += this.levelPointsRecord.getTotalPoints();
    this.levelPointsRecord.reset();
  }

  public getLevelNumber(): number {
    return this.currentLevelNumber;
  }

  public setGameOver(): void {
    this.state = State.GameOver;
  }

  public isGameOver(): boolean {
    return this.state === State.GameOver;
  }

  // TODO: 20k points give extra life

  public addKillPoints(tier: TankTier): void {
    this.levelPointsRecord.addKill(tier);
    this.checkLifeup();
  }

  public addPowerupPoints(type: PowerupType): void {
    this.levelPointsRecord.addPowerup(type);
    this.checkLifeup();
  }

  public getTotalPoints(): number {
    // Sum of all previous levels and current level
    return this.totalPoints + this.levelPointsRecord.getTotalPoints();
  }

  public getLevelPointsRecord(): PointsRecord {
    return this.levelPointsRecord;
  }

  public getLivesCount(): number {
    return this.lives;
  }

  public isAlive(): boolean {
    return this.lives > 0;
  }

  public addLife(): void {
    this.lives += 1;

    this.lifeup.notify(null);
  }

  public removeLife(): void {
    this.lives -= 1;

    if (!this.isAlive()) {
      this.setGameOver();
    }
  }

  public setSeenIntro(seenIntro: boolean): void {
    this.seenIntro = seenIntro;
  }

  public haveSeenIntro(): boolean {
    return this.seenIntro;
  }

  private checkLifeup(): void {
    if (this.getTotalPoints() >= this.nextLifePointThreshold) {
      this.nextLifePointThreshold += config.PLAYER_EXTRA_LIVE_POINTS;
      this.addLife();
    }
  }
}
