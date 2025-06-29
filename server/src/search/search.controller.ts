import { Controller, Get, Query } from '@nestjs/common';
import { Public } from 'src/auth';
import { SearchService } from './search.service';
import { SearchAllDto } from './dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  async searchEverywhere(@Query() query: SearchAllDto) {
    if (!query?.searchString) {
      return { message: 'Search string is required' };
    }
    return this.searchService.searchEverywhere(query);
  }

  @Get('/places')
  async searchPlaces(@Query() query: SearchAllDto) {
    if (!query?.searchString) {
      return { message: 'Search string is required' };
    }
    return this.searchService.searchPlaces(query);
  }
}
