import { Response } from 'express';
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Res,
  Req,
  Get,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { CreateUserDto } from 'src/users/dto';
import { RefreshDTO } from './dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/logout')
  logout(@Request() req) {
    return req.logout();
  }

  @Post('/registration')
  async registration(@Body() userDTO: CreateUserDto) {
    return this.authService.registration(userDTO);
  }

  @Post('/refresh-token')
  async refreshToken(@Body() refreshDTO: RefreshDTO) {
    return this.authService.refreshToken(refreshDTO.refreshToken);
  }

  @Get('/google')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async auth() {}

  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/error`);
    }
    const tokens = await this.authService.googleSignIn(req.user);

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth-success?accessToken=${tokens.accessToken}&accessTokenExpires=${tokens.accessTokenExpires}&refreshToken=${tokens.refreshToken}&refreshTokenExpires=${tokens.refreshTokenExpires}`,
    );
  }
}
