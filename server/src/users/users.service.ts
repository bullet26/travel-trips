import { InjectModel } from '@nestjs/sequelize';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './models/users.model';
import { RolesService, Role } from 'src/roles';
import { UpdateUserDto, AddRoleDto, CreateUserDto } from './dto';

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

  async addRole(dto: AddRoleDto) {
    const user = await this.userModel.findByPk(dto.userId); // primary key
    const role = await this.roleService.getRoleByValue(dto.role);

    if (role && user) {
      await user.$set('role', role.id);
      return {
        message: 'Role successfully set for user',
        userId: user.id,
        role: dto.role,
      };
    }
    throw new NotFoundException('User or role wasn`t found');
  }

  async update(id: number, updatedUserDto: UpdateUserDto) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await user.update(updatedUserDto);
    return user;
  }
}
