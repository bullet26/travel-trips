import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchAllDto } from './dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async searchCountries(@Query() query: SearchAllDto) {
    if (!query?.searchString) {
      return { message: 'Search string is required' };
    }
    return this.searchService.searchEverywhere(query);
  }
}
