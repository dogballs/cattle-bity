import * as Joi from '@hapi/joi';

export class ConfigParser {
  public static parse<T>(data: object, schema: Joi.ObjectSchema<T>): T {
    const { value, error } = schema.validate(data);

    if (error !== undefined) {
      throw error;
    }

    return value;
  }
}
