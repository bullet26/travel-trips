import { NotFoundException } from '@nestjs/common';
import { Trip } from 'src/trips/models/trip.model';
import { Place } from 'src/places';
import { EntityType } from '../types/EntityType';

export async function validateEntityExists(
  entityType: EntityType,
  entityId: number,
) {
  if (entityType === EntityType.TRIP) {
    const trip = await Trip.findByPk(entityId);
    if (!trip) {
      throw new NotFoundException(
        `Trip with id ${entityId} not found for entityType TRIP`,
      );
    }
  } else if (entityType === EntityType.PLACE) {
    const place = await Place.findByPk(entityId);
    if (!place) {
      throw new NotFoundException(
        `Place with id ${entityId} not found for entityType PLACE`,
      );
    }
  } else if (entityType === EntityType.CITY) {
    // TODO
  } else if (entityType === EntityType.COUNTRY) {
    // TODO
  }
}
