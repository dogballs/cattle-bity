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
  private startLevelNumber: number;
  private currentLevelNumber: number;
  private levelPointsRecord: PointsRecord;
  private totalPoints: number;
  private lives: number;
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
    this.startLevelNumber = 1;
    this.currentLevelNumber = 1;
    this.levelPointsRecord = new PointsRecord();
    this.totalPoints = 0;
    this.lives = config.PLAYER_INITIAL_LIVES;
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

  // TODO: 20k points give extra live

  public addKillPoints(tier: TankTier): void {
    this.levelPointsRecord.addKill(tier);
  }

  public addPowerupPoints(type: PowerupType): void {
    this.levelPointsRecord.addPowerup(type);
  }

  public getLevelPointsRecord(): PointsRecord {
    return this.levelPointsRecord;
  }

  public getLivesCount(): number {
    return this.lives;
  }

  public removeLive(): void {
    this.lives -= 1;

    if (this.lives < 0) {
      this.setGameOver();
    }
  }
}
