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
  private startLevelNumber = 0;
  private currentLevelNumber = 0;
  private levelPointsRecord = new PointsRecord();
  private totalPoints = 0;
  private lives = config.PLAYER_INITIAL_LIVES;
  private state = State.Idle;

  public start(startLevelNumber: number): void {
    if (this.state !== State.Idle) {
      return;
    }

    this.startLevelNumber = startLevelNumber;
    this.currentLevelNumber = startLevelNumber;
    this.state = State.Playing;
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

  public getLevelPointsRecord(): PointsRecord {
    return this.levelPointsRecord;
  }

  public addKillPoints(tier: TankTier): void {
    this.levelPointsRecord.addKill(tier);
  }

  public addPowerupPoints(type: PowerupType): void {
    this.levelPointsRecord.addPowerup(type);
  }
}
