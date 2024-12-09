import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto';
import { LoginUserDto } from './dto';
import { User, UsersService } from 'src/users';

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
      provider: userDTO.provider || 'local',
      providerId: userDTO.providerId || null,
      password: hashPassword,
    });

    return this.generateTokens(newUser);
  }

  async googleSignIn(userDTO: User) {
    const { email, providerId } = userDTO;

    const candidateByProviderId =
      await this.userService.getUserByProviderId(providerId);

    if (candidateByProviderId && email === candidateByProviderId.email) {
      const res = await this.generateTokens(candidateByProviderId);
      return res;
    }

    if (candidateByProviderId) {
      throw new BadRequestException({
        message: `Provider ID already linked to another email. ${candidateByProviderId.email}`,
      });
    }

    const candidateByEmail = await this.userService.getUserByEmail(email);

    if (candidateByEmail && candidateByEmail.provider !== 'google') {
      throw new BadRequestException({
        message:
          'This email is already registered with another provider. Please log in locally or link your accounts.',
        providerId: providerId,
      });
    }

    const res = await this.registration(userDTO);
    return res;
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException({
        message: 'Incorrect refreshToken',
      });
    }
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
    if (!user) {
      throw new BadRequestException({
        message: 'Incorrect email',
      });
    }

    if (user.provider !== 'local') {
      throw new BadRequestException({
        message: `Cannot log in directly. This account is registered via ${user.provider}. Use the ${user.provider} provider to authenticate.`,
      });
    }

    const isPasswordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (isPasswordEquals) {
      return user;
    }

    throw new BadRequestException({
      message: 'Incorrect password',
    });
  }

  private async generateTokens(user: User) {
    const payload = { email: user.email, id: user.id, role: user.role };

    const ACCESS_TOKEN_EXPIRES = 15;
    const REFRESH_TOKEN_EXPIRES = 7;

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: `${ACCESS_TOKEN_EXPIRES}m`,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: `${REFRESH_TOKEN_EXPIRES}d`,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpires: ACCESS_TOKEN_EXPIRES * 60,
      refreshTokenExpires: REFRESH_TOKEN_EXPIRES * 24 * 60 * 60,
    };
  }
}
