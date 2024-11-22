import { Response, Request as ExpressRequest } from 'express';
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { GoogleOauthGuard } from './guards/google-oauth.guard';

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
      secure: process.env.NODE_ENV === 'production',
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
  async registration(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.registration(req.user);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return { accessToken: tokens.accessToken };
  }

  @Post('/refresh-token')
  async refreshToken(@Req() req: ExpressRequest) {
    const refreshToken = req.cookies['refreshToken'];

    return this.authService.refreshToken(refreshToken);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async auth() {}

  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth-failed`);
    }

    const tokens = await this.authService.googleSignIn(req.user);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return { accessToken: tokens.accessToken };
  }
}
