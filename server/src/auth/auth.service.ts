import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user: User) {
    return this.generateTokens(user);
  }

  async registration(userDTO: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDTO.email);

    if (candidate) {
      throw new BadRequestException('User with this email already exist');
    }
    const hashPassword = await bcrypt.hash(userDTO.password, 5);
    const newUser = await this.userService.createUser({
      ...userDTO,
      password: hashPassword,
    });

    return this.generateTokens(newUser);
  }

  async refreshToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_SECRET,
    });
    const user = await this.userService.getUserByEmail(payload.email);

    if (user) {
      return this.generateTokens(user);
    }
    throw new UnauthorizedException({
      message: 'Invalid refresh token',
    });
  }

  async validateUser(userDto: LoginUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const isPasswordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && isPasswordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Incorrect email or password',
    });
  }

  private async generateTokens(user: User) {
    const payload = { email: user.email, id: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
    };
  }
}
