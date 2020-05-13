import { PowerupType } from '../powerup';
import { TankTier } from '../tank';
import * as config from '../config';

const TANK_POINTS_MAP = {
  [TankTier.A]: 100,
  [TankTier.B]: 200,
  [TankTier.C]: 300,
  [TankTier.D]: 400,
};

const POWERUP_POINTS = 500;

export class PointsRecord {
  private kills: TankTier[] = [];
  private powerups: PowerupType[] = [];
  private bonus = false;

  public addKill(tier: TankTier): this {
    this.kills.push(tier);

    return this;
  }

  public addPowerup(type: PowerupType): this {
    this.powerups.push(type);

    return this;
  }

  public addBonus(): this {
    this.bonus = true;

    return this;
  }

  public hasBonus(): boolean {
    return this.bonus === true;
  }

  public getTierKillCost(tier: TankTier): number {
    return TANK_POINTS_MAP[tier];
  }

  public getPowerupCost(): number {
    return POWERUP_POINTS;
  }

  public getKillTotalCount(): number {
    return this.kills.length;
  }

  public getTierKillCount(tierToFind: TankTier): number {
    const kills = this.kills.filter((tier) => tier === tierToFind);
    const count = kills.length;

    return count;
  }

  public getTierPoints(tierToFind: TankTier): number {
    let total = 0;

    this.kills.forEach((tier) => {
      if (tier !== tierToFind) {
        return;
      }
      total += this.getTierKillCost(tier);
    });

    return total;
  }

  public getKillTotalPoints(): number {
    let total = 0;

    this.kills.forEach((tier) => {
      total += this.getTierKillCost(tier);
    });

    return total;
  }

  public getPowerupTotalPoints(): number {
    const total = this.powerups.length * this.getPowerupCost();

    return total;
  }

  public getBonusTotalPoints(): number {
    if (this.bonus) {
      return config.BONUS_POINTS;
    }
    return 0;
  }

  public getTotalPoints(): number {
    const killTotal = this.getKillTotalPoints();
    const powerupTotal = this.getPowerupTotalPoints();
    const bonusTotal = this.getBonusTotalPoints();

    const total = killTotal + powerupTotal + bonusTotal;

    return total;
  }

  public reset(): void {
    this.kills = [];
    this.powerups = [];
    this.bonus = false;
  }
}
