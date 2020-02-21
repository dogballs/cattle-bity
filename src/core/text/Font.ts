import { Vector } from '../Vector';

export abstract class Font<T> {
  abstract buildCharacter(character: string, scale: Vector, offset: Vector): T;
  abstract getCharacterWidth(): number;
  abstract getCharacterHeight(): number;
}
