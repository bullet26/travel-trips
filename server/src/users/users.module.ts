import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesModule } from '../roles/roles.module';
import { Role } from '../roles/roles.model';
import { User } from './users.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [SequelizeModule.forFeature([User, Role]), RolesModule],
  exports: [UsersService],
})
export class UsersModule {}
