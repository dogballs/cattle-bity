import * as Joi from '@hapi/joi';

export const RectFontConfigSchema = Joi.object({
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
    .items(
      Joi.array()
        .items(Joi.string().length(7))
        .length(7)
        .default([]),
    )
    .default([]),
}).default();
