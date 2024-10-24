import { Response, Request as ExpressRequest } from 'express';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Res,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(req.user);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
    });

    return { accessToken: tokens.accessToken };
  }

  @UseGuards(LocalAuthGuard)
  @Post('/logout')
  logout(@Request() req, @Res() res: Response) {
    res.clearCookie('refreshToken');
    return req.logout();
  }

  @Post('/registration')
  registration(@Body() userDTO: CreateUserDto) {
    return this.authService.registration(userDTO);
  }

  @Post('/refresh-token')
  async refreshToken(@Req() req: ExpressRequest) {
    const refreshToken = req.cookies['refreshToken'];

    return this.authService.refreshToken(refreshToken);
  }
}
