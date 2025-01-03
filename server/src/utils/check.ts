import { BadRequestException, NotFoundException } from '@nestjs/common';

interface EnsureEntityExistsParams<T> {
  entity: T | null;
  entityName: string;
  value: string | number;
  fieldName?: string;
}

export const ensureId = (id: number, message = 'id wasn`t set'): void => {
  if (!id) {
    throw new BadRequestException(message);
  }
};

export const ensureEntityExists = <T>({
  entity,
  entityName,
  value,
  fieldName = 'id',
}: EnsureEntityExistsParams<T>): void => {
  if (!entity) {
    throw new NotFoundException(
      `${entityName} with ${fieldName} ${value} not found`,
    );
  }
};
