import { TankParty } from './TankParty';
import { TankTier } from './TankTier';

export class TankType {
  public party: TankParty;
  public tier: TankTier;
  public hasDrop: boolean;

  constructor(party: TankParty, tier: TankTier, hasDrop = false) {
    this.party = party;
    this.tier = tier;
    this.hasDrop = hasDrop;
  }

  public setHasDrop(hasDrop): this {
    this.hasDrop = hasDrop;

    return this;
  }

  public clone(): TankType {
    return new TankType(this.party, this.tier);
  }

  public increaseTier(): this {
    switch (this.tier) {
      case TankTier.A:
        this.tier = TankTier.B;
        break;
      case TankTier.B:
        this.tier = TankTier.C;
        break;
      case TankTier.C:
        this.tier = TankTier.D;
      default:
        break;
    }

    return this;
  }

  public isMaxTier(): boolean {
    return this.tier === TankTier.D;
  }

  public equals(other: TankType): boolean {
    return (
      this.party === other.party &&
      this.tier === other.tier &&
      this.hasDrop === other.hasDrop
    );
  }

  public serialize(): string {
    return `${this.party}-${this.tier}-${this.hasDrop}`;
  }

  public toString(): string {
    return this.serialize();
  }

  public static PlayerA(): TankType {
    return new TankType(TankParty.Player, TankTier.A);
  }
  public static PlayerB(): TankType {
    return new TankType(TankParty.Player, TankTier.B);
  }
  public static PlayerC(): TankType {
    return new TankType(TankParty.Player, TankTier.C);
  }
  public static PlayerD(): TankType {
    return new TankType(TankParty.Player, TankTier.D);
  }
  public static EnemyA(): TankType {
    return new TankType(TankParty.Enemy, TankTier.A);
  }
  public static EnemyB(): TankType {
    return new TankType(TankParty.Enemy, TankTier.B);
  }
  public static EnemyD(): TankType {
    return new TankType(TankParty.Enemy, TankTier.D);
  }
}
