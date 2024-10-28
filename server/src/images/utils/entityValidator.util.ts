import { NotFoundException } from '@nestjs/common';
import { Trip } from 'src/trips/models/trip.model';
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
  }
}
