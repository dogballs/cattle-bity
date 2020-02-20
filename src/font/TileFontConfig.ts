export type TileFontConfigCharacter = string[][];

export interface TileFontConfig {
  fillSymbol: string;
  emptySymbol: string;
  characterWidth: number;
  characterHeight: number;
  characterSet: string;
  characters: TileFontConfigCharacter[];
}
