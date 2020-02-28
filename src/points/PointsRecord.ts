import { PowerupType } from '../powerups';
import { TankTier } from '../tank';

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

  public addKill(tier: TankTier): this {
    this.kills.push(tier);

    return this;
  }

  public addPowerup(type: PowerupType): this {
    this.powerups.push(type);

    return this;
  }

  public getKillCost(tier: TankTier): number {
    return TANK_POINTS_MAP[tier];
  }

  public getPowerupCost(): number {
    return POWERUP_POINTS;
  }

  public getKillCount(): number {
    return this.kills.length;
  }

  public getKillCountByPowerup(tierToFind: TankTier): number {
    const kills = this.kills.filter((tier) => tier === tierToFind);
    const count = kills.length;

    return count;
  }

  public getTierTotal(tierToFind: TankTier): number {
    let total = 0;

    this.kills.forEach((tier) => {
      if (tier !== tierToFind) {
        return;
      }
      total += this.getKillCost(tier);
    });

    return total;
  }

  public getKillTotal(): number {
    let total = 0;

    this.kills.forEach((tier) => {
      total += this.getKillCost(tier);
    });

    return total;
  }

  public getPowerupTotal(): number {
    const total = this.powerups.length * this.getPowerupCost();

    return total;
  }

  public getTotal(): number {
    const killTotal = this.getKillTotal();
    const powerupTotal = this.getPowerupTotal();

    const total = killTotal + powerupTotal;

    return total;
  }
}
