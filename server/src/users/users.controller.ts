import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }
}
