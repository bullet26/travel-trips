import { BadRequestException } from '@nestjs/common';
import { Trip } from 'src/trips/models/trip.model';
import { Place } from 'src/places';
import { City } from 'src/cities/models/city.model';
import { Country } from 'src/countries/models/country.model';
import { EntityType } from '../types/EntityType';
import { ensureEntityExists } from 'src/utils';

export async function validateEntityExists(
  entityType: EntityType,
  entityId: number,
) {
  if (!entityType) {
    throw new BadRequestException(
      `Set entityType (one of: ${Object.values(EntityType).join(', ')}) for link`,
    );
  } else if (entityType === EntityType.TRIP) {
    const trip = await Trip.findByPk(entityId);
    ensureEntityExists({ entity: trip, entityName: 'Trip', value: entityId });
  } else if (entityType === EntityType.PLACE) {
    const place = await Place.findByPk(entityId);
    ensureEntityExists({ entity: place, entityName: 'Place', value: entityId });
  } else if (entityType === EntityType.CITY) {
    const city = await City.findByPk(entityId);
    ensureEntityExists({ entity: city, entityName: 'City', value: entityId });
  } else if (entityType === EntityType.COUNTRY) {
    const country = await Country.findByPk(entityId);
    ensureEntityExists({
      entity: country,
      entityName: 'Country',
      value: entityId,
    });
  }
}
