import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AddRoleDto, UpdateUserDto, CreateUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Roles('ADMIN')
  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }

  @Roles('ADMIN')
  @Post('/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.userService.addRole(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTripDto: UpdateUserDto) {
    return this.userService.update(Number(id), updateTripDto);
  }
}
