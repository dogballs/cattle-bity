import { Points } from '../../gameObjects';
import { PointsValue } from '../../points';
import { TankDeathReason, TankTier, TankType } from '../../tank';
import * as config from '../../config';

import { LevelScript } from '../LevelScript';
import { LevelEnemyExplodedEvent, LevelPowerupPickedEvent } from '../events';

export class LevelPointsScript extends LevelScript {
  protected setup(): void {
    this.eventBus.enemyExploded.addListener(this.handleEnemyExploded);
    this.eventBus.powerupPicked.addListener(this.handlePowerupPicked);
  }

  private handleEnemyExploded = (event: LevelEnemyExplodedEvent): void => {
    // Only player kills are awarded
    if (event.reason === TankDeathReason.WipeoutPowerup) {
      return;
    }

    const value = this.getEnemyTankPointsValue(event.type);

    const points = new Points(value, config.POINTS_ENEMY_TANK_DURATION);
    points.updateMatrix();
    points.setCenter(event.centerPosition);
    this.world.field.add(points);
  };

  private handlePowerupPicked = (event: LevelPowerupPickedEvent): void => {
    const points = new Points(PointsValue.V500, config.POINTS_POWERUP_DURATION);
    points.updateMatrix();
    points.setCenter(event.centerPosition);
    this.world.field.add(points);
  };

  private getEnemyTankPointsValue(type: TankType): PointsValue {
    switch (type.tier) {
      case TankTier.A:
        return PointsValue.V100;
      case TankTier.B:
        return PointsValue.V200;
      case TankTier.C:
        return PointsValue.V300;
      case TankTier.D:
        return PointsValue.V400;
      default:
        return 0;
    }
  }
}
