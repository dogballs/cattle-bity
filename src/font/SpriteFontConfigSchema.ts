import * as Joi from '@hapi/joi';

export const SpriteFontConfigSchema = Joi.object({
  characterSet: Joi.string().required(),
  characterWidth: Joi.number().required(),
  characterHeight: Joi.number().required(),
  rowCount: Joi.number().required(),
  columnCount: Joi.number().required(),
  horizontalSpacing: Joi.number().required(),
  verticalSpacing: Joi.number().required(),
}).default();
