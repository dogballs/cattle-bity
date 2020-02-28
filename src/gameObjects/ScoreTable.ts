import { GameObject } from '../core';
import { PointsRecord } from '../points';
import { PowerupType } from '../powerups';
import { TankTier } from '../tank';
import * as config from '../config';

import { ScoreTablePointCounter } from './ScoreTablePointCounter';
import { ScoreTableTierIcon } from './ScoreTableTierIcon';
import { ScoreTableUnderline } from './ScoreTableUnderline';
import { SpriteText } from './SpriteText';

export class ScoreTable extends GameObject {
  private points = new PointsRecord();

  private iconA = new ScoreTableTierIcon(TankTier.A);
  private iconB = new ScoreTableTierIcon(TankTier.B);
  private iconC = new ScoreTableTierIcon(TankTier.C);
  private iconD = new ScoreTableTierIcon(TankTier.D);

  private counter = new ScoreTablePointCounter();
  private title = new SpriteText('Ⅰ-PLAYER', { color: config.COLOR_RED });
  private totalPoints = new SpriteText('1300', { color: config.COLOR_YELLOW });

  private pointsA = new SpriteText('880', { color: config.COLOR_WHITE });
  private pointsB = new SpriteText('0', { color: config.COLOR_WHITE });
  private pointsC = new SpriteText('0', { color: config.COLOR_WHITE });
  private pointsD = new SpriteText('0', { color: config.COLOR_WHITE });

  private pointsTextA = new SpriteText('PTS', { color: config.COLOR_WHITE });
  private pointsTextB = new SpriteText('PTS', { color: config.COLOR_WHITE });
  private pointsTextC = new SpriteText('PTS', { color: config.COLOR_WHITE });
  private pointsTextD = new SpriteText('PTS', { color: config.COLOR_WHITE });

  private killsA = new SpriteText('0', { color: config.COLOR_WHITE });
  private killsB = new SpriteText('0', { color: config.COLOR_WHITE });
  private killsC = new SpriteText('0', { color: config.COLOR_WHITE });
  private killsD = new SpriteText('0', { color: config.COLOR_WHITE });

  private underline = new ScoreTableUnderline();

  private totalTitle = new SpriteText('TOTAL', { color: config.COLOR_WHITE });
  private totalKills = new SpriteText('8', { color: config.COLOR_WHITE });

  constructor() {
    super(832, 544);

    this.points.addKill(TankTier.A);
    this.points.addKill(TankTier.A);
    this.points.addKill(TankTier.A);
    this.points.addKill(TankTier.A);
    this.points.addKill(TankTier.A);
    this.points.addKill(TankTier.A);
    this.points.addKill(TankTier.A);
    this.points.addKill(TankTier.A);
    this.points.addKill(TankTier.B);
    this.points.addKill(TankTier.B);
    this.points.addKill(TankTier.C);
    this.points.addKill(TankTier.C);
    this.points.addKill(TankTier.C);
    this.points.addKill(TankTier.D);
    this.points.addKill(TankTier.D);
    this.points.addKill(TankTier.D);
    this.points.addKill(TankTier.D);

    this.points.addPowerup(PowerupType.BaseDefence);
    this.points.addPowerup(PowerupType.BaseDefence);
    this.points.addPowerup(PowerupType.BaseDefence);
  }

  protected setup(): void {
    this.title.position.set(256, 0);
    this.title.pivot.setX(1);
    this.add(this.title);

    this.totalPoints.setText(this.points.getTotal().toString());
    this.totalPoints.position.set(256, 64);
    this.totalPoints.pivot.set(1, 0);
    this.add(this.totalPoints);

    this.iconA.setCenter(this.getChildrenCenter());
    this.iconA.position.setY(136);
    this.add(this.iconA);

    this.iconB.setCenter(this.getChildrenCenter());
    this.iconB.position.setY(236);
    this.add(this.iconB);

    this.iconC.setCenter(this.getChildrenCenter());
    this.iconC.position.setY(336);
    this.add(this.iconC);

    this.iconD.setCenter(this.getChildrenCenter());
    this.iconD.position.setY(436);
    this.add(this.iconD);

    this.pointsA.setText(this.points.getTierTotal(TankTier.A).toString());
    this.pointsA.position.set(128, 152);
    this.pointsA.pivot.set(1, 0);
    this.add(this.pointsA);

    this.pointsB.setText(this.points.getTierTotal(TankTier.B).toString());
    this.pointsB.position.set(128, 252);
    this.pointsB.pivot.set(1, 0);
    this.add(this.pointsB);

    this.pointsC.setText(this.points.getTierTotal(TankTier.C).toString());
    this.pointsC.position.set(128, 352);
    this.pointsC.pivot.set(1, 0);
    this.add(this.pointsC);

    this.pointsD.setText(this.points.getTierTotal(TankTier.D).toString());
    this.pointsD.position.set(128, 452);
    this.pointsD.pivot.set(1, 0);
    this.add(this.pointsD);

    this.pointsTextA.position.set(256, 152);
    this.pointsTextA.pivot.set(1, 0);
    this.add(this.pointsTextA);

    this.pointsTextB.position.set(256, 252);
    this.pointsTextB.pivot.set(1, 0);
    this.add(this.pointsTextB);

    this.pointsTextC.position.set(256, 352);
    this.pointsTextC.pivot.set(1, 0);
    this.add(this.pointsTextC);

    this.pointsTextD.position.set(256, 452);
    this.pointsTextD.pivot.set(1, 0);
    this.add(this.pointsTextD);

    this.killsA.setText(
      this.points.getKillCountByPowerup(TankTier.A).toString(),
    );
    this.killsA.position.set(344, 152);
    this.killsA.pivot.set(1, 0);
    this.add(this.killsA);

    this.killsB.setText(
      this.points.getKillCountByPowerup(TankTier.B).toString(),
    );
    this.killsB.position.set(344, 252);
    this.killsB.pivot.set(1, 0);
    this.add(this.killsB);

    this.killsC.setText(
      this.points.getKillCountByPowerup(TankTier.C).toString(),
    );
    this.killsC.position.set(344, 352);
    this.killsC.pivot.set(1, 0);
    this.add(this.killsC);

    this.killsD.setText(
      this.points.getKillCountByPowerup(TankTier.D).toString(),
    );
    this.killsD.position.set(344, 452);
    this.killsD.pivot.set(1, 0);
    this.add(this.killsD);

    this.underline.setCenter(this.getChildrenCenter());
    this.underline.position.setY(504);
    this.add(this.underline);

    this.totalTitle.position.set(256, 516);
    this.totalTitle.pivot.set(1, 0);
    this.add(this.totalTitle);

    this.totalKills.setText(this.points.getKillCount().toString());
    this.totalKills.position.set(344, 516);
    this.totalKills.pivot.set(1, 0);
    this.add(this.totalKills);
  }
}
