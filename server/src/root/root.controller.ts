import { Controller, Get } from '@nestjs/common';
import { RootService } from './root.service';

@Public()
@Controller()
export class RootController {
  constructor(private readonly rootService: RootService) {}

  @Get()
  getRoot(): string {
    return 'Hello, this is the root route for Travel_trips server!';
  }
}
