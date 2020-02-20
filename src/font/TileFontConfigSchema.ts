import * as Joi from '@hapi/joi';

import { TileFontConfig } from './TileFontConfig';

export const TileFontConfigSchema = Joi.object<TileFontConfig>({
  fillSymbol: Joi.string()
    .length(1)
    .required(),
  emptySymbol: Joi.string()
    .length(1)
    .required(),
  characterWidth: Joi.number().required(),
  characterHeight: Joi.number().required(),
  characterSet: Joi.string().required(),
  characters: Joi.array()
    .items(Joi.string().length(7))
    .length(7)
    .default([]),
}).default();
