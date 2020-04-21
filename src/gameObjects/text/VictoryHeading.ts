import { GameObject, Timer } from '../../core';
import { GameUpdateArgs } from '../../game';
import { TerrainType } from '../../terrain';

import { TerrainText } from './TerrainText';

const VISIBILITY_DURATION = 0.012;

export class VictoryHeading extends GameObject {
  private texts: TerrainText[] = [];
  private visibleIndex = 0;
  private timer: Timer;

  constructor() {
    super();

    this.timer = new Timer();
    this.timer.reset(VISIBILITY_DURATION);
  }

  protected setup(): void {
    this.texts = [
      this.createText(TerrainType.Brick),
      this.createText(TerrainType.InverseBrick),
      this.createText(TerrainType.BlueBrick),
    ];

    this.texts.forEach((text) => {
      text.setVisible(false);
      this.add(text);
    });

    this.updateVisibility();
  }

  protected update({ deltaTime }: GameUpdateArgs): void {
    if (this.timer.isDone()) {
      this.nextText();
      this.updateVisibility();
      this.timer.reset(VISIBILITY_DURATION);
    } else {
      this.timer.update(deltaTime);
    }
  }

  private nextText(): void {
    this.visibleIndex += 1;
    if (this.visibleIndex > this.texts.length - 1) {
      this.visibleIndex = 0;
    }
  }

  private updateVisibility(): void {
    this.texts.forEach((text, index) => {
      if (index === this.visibleIndex) {
        text.setVisible(true);
      } else {
        text.setVisible(false);
      }
    });
  }

  private createText(terrainType: TerrainType): TerrainText {
    const text = new TerrainText('VICTORY', terrainType);
    text.origin.set(0.5, 0.5);
    return text;
  }
}
