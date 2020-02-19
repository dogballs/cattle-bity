export type FontConfigCharacter = string[][];

export interface FontConfigCharacters {
  [key: string]: FontConfigCharacter;
}

export interface FontConfig {
  fillSymbol: string;
  emptySymbol: string;
  characterWidth: number;
  characterHeight: number;
  characters: FontConfigCharacters;
}
