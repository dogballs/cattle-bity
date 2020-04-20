import { Vector } from '../../Vector';

import { Font } from '../Font';

export class NullFont implements Font<null> {
  public buildCharacter(): null {
    return null;
  }
  public getScale(): Vector {
    return new Vector(1, 1);
  }
  public getCharacterWidth(): number {
    return 0;
  }
  public getCharacterHeight(): number {
    return 0;
  }
}
