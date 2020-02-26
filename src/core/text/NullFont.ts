import { Font } from './Font';

export class NullFont implements Font<null> {
  public buildCharacter(): null {
    return null;
  }
  public getCharacterWidth(): number {
    return 0;
  }
  public getCharacterHeight(): number {
    return 0;
  }
}
