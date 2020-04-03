import * as Joi from '@hapi/joi';

// TODO: circular deps?
import { TankTier } from '../tank/TankTier';
import { TerrainType } from '../terrain/TerrainType';

import { MapDto } from './MapDto';

export const MapDtoSchema = Joi.object<MapDto>({
  spawn: Joi.object({
    enemy: Joi.object({
      locations: Joi.array()
        .items(
          Joi.object({
            x: Joi.number().required(),
            y: Joi.number().required(),
          }),
        )
        .default([]),
      list: Joi.array()
        .items(
          Joi.object({
            tier: Joi.string()
              .valid(...Object.values(TankTier))
              .required(),
            drop: Joi.boolean(),
          }),
        )
        .default([]),
    }).default(),
    player: Joi.object({
      locations: Joi.array()
        .items(
          Joi.object({
            x: Joi.number().required(),
            y: Joi.number().required(),
          }),
        )
        .default([]),
    }).default(),
  }).default(),
  terrain: Joi.object({
    regions: Joi.array()
      .items(
        Joi.object({
          type: Joi.string()
            .valid(...Object.values(TerrainType))
            .required(),
          x: Joi.number().required(),
          y: Joi.number().required(),
          width: Joi.number().required(),
          height: Joi.number().required(),
        }),
      )
      .default([]),
  }).default(),
});
