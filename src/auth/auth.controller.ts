import { Body, Controller, Post, Response } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  async register(@Body() registerBody: RegisterUserDto, @Response() res) {
    const result = await this.authService.register(registerBody);
    return res.status(200).json({
      message: 'Register successfully',
      data: result,
    });
  }

  @Post('login')
  async login(@Body() login: LoginUserDto, @Response() res) {
    const result = await this.authService.login(login);
    return res.status(200).json({
      message: 'Register successfully',
      data: result,
    });
  }
}
