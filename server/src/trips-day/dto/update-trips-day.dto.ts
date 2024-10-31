import { PartialType } from '@nestjs/swagger';
import { CreateTripsDayDto } from './create-trips-day.dto';

export class UpdateTripsDayDto extends PartialType(CreateTripsDayDto) {}
