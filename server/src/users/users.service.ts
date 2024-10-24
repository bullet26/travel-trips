import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/roles.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private roleService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userModel.create(dto);
    const role = await this.roleService.getRoleByValue('USER');

    await user.$set('role', role.id);
    user.role = role;
    return user;
  }

  async getAllUsers() {
    const users = await this.userModel.findAll({
      include: { model: Role, attributes: ['role'] },
    });
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({
      where: {
        email: email,
      },
      include: { model: Role, attributes: ['role'] },
    });
    return user;
  }
}
