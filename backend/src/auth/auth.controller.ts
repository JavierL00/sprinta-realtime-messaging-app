import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() body: { email: string; password: string; name: string },
  ) {
    return this.authService.signUp(body.email, body.password, body.name);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: { email: string; password: string }) {
    return this.authService.signIn(body.email, body.password);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  @Post('profile')
  @HttpCode(HttpStatus.OK)
  async profile(@Body() body: { token: string }) {
    return this.authService.profile(body.token);
  }
}
