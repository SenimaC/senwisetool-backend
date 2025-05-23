import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/user/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get()
  // getProfile(@Req() req) {
  //   return req.user;
  // }
}
