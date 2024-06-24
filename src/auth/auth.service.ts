import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerBody: RegisterUserDto) {
    const user = this.userRepository.create(registerBody);
    const result = await this.userRepository.save({
      ...user,
      refresh_token: '',
      password: await this.hashPassword(user.password),
    });
    return result;
  }

  async login(loginBody: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginBody.email },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    const isMatch = await this.isMatchPassword(
      loginBody.password,
      user.password,
    );
    if (!isMatch) {
      throw new HttpException('Password incorrect', HttpStatus.UNAUTHORIZED);
    }
    const payload = { id: user.id, email: user.email };
    // không lấy password
    const { password, ...rest } = user;
    return { ...(await this.generateToken(payload)), user: rest };
  }
  async hashPassword(password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async isMatchPassword(password: string, hash: string) {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }

  async generateToken(payload: { id: number; email: string }) {
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
    });
    await this.userRepository.update(
      { email: payload.email },
      { refresh_token: refresh_token },
    );
    return {
      access_token,
      refresh_token,
    };
  }
}
