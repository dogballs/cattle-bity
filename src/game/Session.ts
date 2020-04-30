import { SessionPlayer } from './SessionPlayer';

enum State {
  Idle,
  Playing,
  GameOver,
}

export class Session {
  public primaryPlayer = new SessionPlayer();
  public secondaryPlayer = new SessionPlayer();
  private startLevelNumber: number;
  private endLevelNumber: number;
  private currentLevelNumber: number;
  private playtest: boolean;
  private state: State;
  private seenIntro: boolean;

  constructor() {
    this.reset();
  }

  public start(startLevelNumber: number, endLevelNumber: number): void {
    if (this.state !== State.Idle) {
      return;
    }

    this.startLevelNumber = startLevelNumber;
    this.endLevelNumber = endLevelNumber;
    this.currentLevelNumber = startLevelNumber;
    this.state = State.Playing;
  }

  public reset(): void {
    this.seenIntro = false;
    this.startLevelNumber = 1;
    this.currentLevelNumber = 1;
    this.endLevelNumber = 1;
    this.state = State.Idle;
    this.playtest = false;

    this.primaryPlayer.reset();
  }

  public resetExceptIntro(): void {
    this.startLevelNumber = 1;
    this.currentLevelNumber = 1;
    this.endLevelNumber = 1;
    this.state = State.Idle;
    this.playtest = false;

    this.primaryPlayer.reset();
    this.secondaryPlayer.reset();
  }

  public activateNextLevel(): void {
    this.currentLevelNumber += 1;

    this.primaryPlayer.completeLevel();
    this.secondaryPlayer.completeLevel();
  }

  public getMaxPoints(): number {
    const primaryPoints = this.primaryPlayer.getTotalPoints();
    const secondaryPoints = this.secondaryPlayer.getTotalPoints();

    const points = [primaryPoints, secondaryPoints];

    const maxPoints = Math.max(...points);

    return maxPoints;
  }

  public getLevelNumber(): number {
    return this.currentLevelNumber;
  }

  public isLastLevel(): boolean {
    return this.currentLevelNumber === this.endLevelNumber;
  }

  public setGameOver(): void {
    this.state = State.GameOver;
  }

  public isGameOver(): boolean {
    return this.state === State.GameOver;
  }

  public setSeenIntro(seenIntro: boolean): void {
    this.seenIntro = seenIntro;
  }

  public haveSeenIntro(): boolean {
    return this.seenIntro;
  }

  public setPlaytest(): void {
    this.playtest = true;
  }

  public resetPlaytest(): void {
    this.playtest = false;
  }

  public isPlaytest(): boolean {
    return this.playtest;
  }
}
