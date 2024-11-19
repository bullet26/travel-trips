import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './models/roles.model';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleModel: typeof Role) {}

  async createRole(dto: CreateRoleDto) {
    const existingRole = await this.roleModel.findOne({
      where: { role: dto.role },
    });
    if (existingRole) {
      new BadRequestException('Role already exists');
    }

    const role = await this.roleModel.create(dto);
    return role;
  }

  async getRoleByValue(value: string) {
    const role = await this.roleModel.findOne({ where: { role: value } });
    return role;
  }
}
