import { InputControl } from './InputControl';

export interface InputContext {
  [action: string]: InputControl[];
}
