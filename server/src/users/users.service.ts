import { InjectModel } from '@nestjs/sequelize';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './models/users.model';
import { RolesService, Role } from 'src/roles';
import { UpdateUserDto, AddRoleDto, CreateUserDto, LinkGoogleDto } from './dto';
import { ensureEntityExists, ensureId } from 'src/utils';

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
      attributes: { exclude: ['password'] },
      include: { model: Role, attributes: ['role'] },
    });
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({
      where: {
        email: email,
      },
      attributes: { exclude: ['password'] },
      include: { model: Role, attributes: ['role'] },
    });

    return user;
  }

  async getUserByProviderId(providerId: string) {
    const user = await this.userModel.findOne({
      where: {
        providerId: providerId,
      },
      attributes: { exclude: ['password'] },
      include: { model: Role, attributes: ['role'] },
    });

    return user;
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userModel.findByPk(dto.userId, {
      include: { model: Role },
    });
    ensureEntityExists({ entity: user, entityName: 'User', value: dto.userId });

    const role = await this.roleService.getRoleByValue(dto.role);
    ensureEntityExists({
      entity: role,
      entityName: 'Role',
      value: dto.role,
      fieldName: 'role',
    });

    if (user.role?.role === dto.role) {
      throw new BadRequestException(`User already have this role ${dto.role}`);
    }

    await user.$set('role', role.id);
    return {
      message: 'Role successfully set for user',
      userId: user.id,
      role: dto.role,
    };
  }

  async update(id: number, updatedUserDto: UpdateUserDto) {
    ensureId(id);
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    ensureEntityExists({ entity: user, entityName: 'User', value: id });

    await user.update(updatedUserDto);
    return user;
  }

  async linkGoogleToLocalAccount(linkDto: LinkGoogleDto) {
    const { userId, providerId } = linkDto;
    ensureId(userId);
    const user = await User.findByPk(userId);
    ensureEntityExists({ entity: user, entityName: 'User', value: userId });

    await user.update({ providerId, provider: 'google' });
    return user;
  }
}
