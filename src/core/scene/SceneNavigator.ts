import { SceneType } from './SceneType';

export interface SceneNavigator {
  push(type: SceneType): void;
  replace(type: SceneType): void;
  back(): void;
  clearAndPush(type: SceneType): void;
}
