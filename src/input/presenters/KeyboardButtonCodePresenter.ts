import { InputButtonCodePresenter } from '../InputButtonCodePresenter';

export class KeyboardButtonCodePresenter implements InputButtonCodePresenter {
  public asString(code: number): string {
    // Numbers 0-9
    if (code >= 48 && code <= 57) {
      const numberCharacter = String.fromCharCode(code);
      return numberCharacter;
    }

    // English alphabet characters a-z (lower-case)
    if (code >= 65 && code <= 90) {
      const alphabetCharacter = String.fromCharCode(code).toUpperCase();
      return alphabetCharacter;
    }

    // Num lock numbers 0-9
    if (code >= 96 && code <= 105) {
      const number = code - 96;
      return `NUM ${number}`;
    }

    switch (code) {
      case 9:
        return 'TAB';
      case 13:
        return 'ENTER';
      case 16:
        return 'SHIFT';
      case 17:
        return 'CTRL';
      case 18:
        return 'ALT';
      case 20:
        return 'CAPS';
      case 32:
        return 'SPACE';
      case 32:
        return 'HOME';
      case 33:
        return 'PAGE UP';
      case 34:
        return 'PAGE DOWN';
      case 35:
        return 'END';
      case 37:
        return 'ARROW LEFT';
      case 38:
        return 'ARROW UP';
      case 39:
        return 'ARROW RIGHT';
      case 40:
        return 'ARROW DOWN';
    }

    return `KB[${code}]`;
  }
}
