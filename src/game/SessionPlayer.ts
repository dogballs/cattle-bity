import { Subject } from '../core';
import { PointsRecord } from '../points';
import { PowerupType } from '../powerup';
import { TankTier } from '../tank';
import * as config from '../config';

export class SessionPlayer {
  public lifeup = new Subject();

  private levelPointsRecord: PointsRecord;
  private totalPoints: number;
  private highscorePoints: number;
  private lives: number;
  private nextLifePointThreshold: number;
  private tankTier: TankTier;
  private levelFirstSpawn: boolean;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.levelPointsRecord = new PointsRecord();
    this.totalPoints = 0;
    this.highscorePoints = 0;
    this.lives = config.PLAYER_INITIAL_LIVES;
    this.nextLifePointThreshold = config.PLAYER_EXTRA_LIVE_POINTS;
    this.tankTier = TankTier.A;
    this.levelFirstSpawn = true;
  }

  public addKillPoints(tier: TankTier): void {
    this.levelPointsRecord.addKill(tier);
    this.checkLifeup();
  }

  public addPowerupPoints(type: PowerupType): void {
    this.levelPointsRecord.addPowerup(type);
    this.checkLifeup();
  }

  public completeLevel(): void {
    this.totalPoints += this.levelPointsRecord.getTotalPoints();
    this.levelPointsRecord.reset();

    this.resetLevelFirstSpawn();
  }

  public getTotalPoints(): number {
    // Sum of all previous levels and current level
    return this.totalPoints + this.levelPointsRecord.getTotalPoints();
  }

  public setHighscore(highscorePoints: number): void {
    this.highscorePoints = highscorePoints;
  }

  public getHighscore(): number {
    return this.highscorePoints;
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

  public getTankTier(): TankTier {
    return this.tankTier;
  }

  public setTankTier(tankTier: TankTier): void {
    this.tankTier = tankTier;
  }

  public resetTankTier(): void {
    this.tankTier = TankTier.A;
  }

  public isLevelFirstSpawn(): boolean {
    return this.levelFirstSpawn;
  }

  public setLevelSpawned(): void {
    this.levelFirstSpawn = false;
  }

  public resetLevelFirstSpawn(): void {
    this.levelFirstSpawn = true;
  }

  public addLife(): void {
    this.lives += 1;

    this.lifeup.notify(null);
  }

  public removeLife(): void {
    this.lives -= 1;
  }

  private checkLifeup(): void {
    if (this.getTotalPoints() >= this.nextLifePointThreshold) {
      this.nextLifePointThreshold += config.PLAYER_EXTRA_LIVE_POINTS;
      this.addLife();
    }
  }
}
