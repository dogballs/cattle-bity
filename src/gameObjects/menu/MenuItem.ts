import { GameObject } from '../../core';
import { GameObjectUpdateArgs } from '../../game';

export interface MenuItem extends GameObject {
  updateFocused(updateArgs: GameObjectUpdateArgs): void;
  updateUnfocused(updateArgs: GameObjectUpdateArgs): void;
}
