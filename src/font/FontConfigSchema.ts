import * as Joi from '@hapi/joi';

import { FontConfig } from './FontConfig';

export const FontConfigSchema = Joi.object<FontConfig>({
  fillSymbol: Joi.string()
    .length(1)
    .required(),
  emptySymbol: Joi.string()
    .length(1)
    .required(),
  characterWidth: Joi.number().required(),
  characterHeight: Joi.number().required(),
  characters: Joi.object().pattern(
    /^[A-Z]$/,
    Joi.array()
      .items(Joi.string().length(7))
      .length(7),
  ),
}).default();
