import { Subject } from '../core';
import { InputVariant } from '../input';
import { PointsRecord } from '../points';
import { PowerupType } from '../powerup';
import { TankTier } from '../tank';
import * as config from '../config';

export class SessionPlayer {
  public lifeup = new Subject();

  private levelPointsRecord: PointsRecord;
  // Total points for current session
  private gamePoints: number;
  // Total points from last session
  private lastGamePoints: number;
  private lives: number;
  private nextLifePointThreshold: number;
  private tankTier: TankTier;
  private levelFirstSpawned: boolean;
  // Should be used for multiplayer only
  private inputVariant: InputVariant;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.levelPointsRecord = new PointsRecord();
    this.gamePoints = 0;
    this.lastGamePoints = null;
    this.lives = config.PLAYER_INITIAL_LIVES;
    this.nextLifePointThreshold = config.PLAYER_EXTRA_LIVE_POINTS;
    this.tankTier = TankTier.A;
    this.levelFirstSpawned = true;
    this.inputVariant = null;
  }

  public addKillPoints(tier: TankTier): void {
    this.levelPointsRecord.addKill(tier);
    this.checkLifeup();
  }

  public addPowerupPoints(type: PowerupType): void {
    this.levelPointsRecord.addPowerup(type);
    this.checkLifeup();
  }

  public addBonusPoints(): void {
    this.levelPointsRecord.addBonus();
    this.checkLifeup();
  }

  public completeLevel(): void {
    this.gamePoints += this.getLevelPoints();
    this.levelPointsRecord.reset();

    this.resetLevelFirstSpawn();
  }

  // Sum of all previous levels and current level
  public getGamePoints(): number {
    return this.gamePoints + this.getLevelPoints();
  }

  public getLevelPoints(): number {
    return this.levelPointsRecord.getTotalPoints();
  }

  public setLastGamePoints(lastGamePoints: number): void {
    this.lastGamePoints = lastGamePoints;
  }

  public getLastGamePoints(): number {
    return this.lastGamePoints;
  }

  public wasInLastGame(): boolean {
    return this.lastGamePoints !== null;
  }

  public hasBonusPoints(): boolean {
    return this.levelPointsRecord.hasBonus();
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
    return this.levelFirstSpawned;
  }

  public setLevelSpawned(): void {
    this.levelFirstSpawned = false;
  }

  public resetLevelFirstSpawn(): void {
    this.levelFirstSpawned = true;
  }

  public addLife(): void {
    this.lives += 1;

    this.lifeup.notify(null);
  }

  public removeLife(): void {
    this.lives -= 1;
  }

  public setInputVariant(inputVariant: InputVariant): void {
    this.inputVariant = inputVariant;
  }

  public getInputVariant(): InputVariant {
    return this.inputVariant;
  }

  private checkLifeup(): void {
    if (this.getGamePoints() >= this.nextLifePointThreshold) {
      this.nextLifePointThreshold += config.PLAYER_EXTRA_LIVE_POINTS;
      this.addLife();
    }
  }
}
