import { Vector } from '../Vector';

export interface Font<T> {
  buildCharacter(character: string, scale: Vector, offset: Vector): T;
  getScale(): Vector;
  getCharacterWidth(): number;
  getCharacterHeight(): number;
}
