import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpReturn } from '../../shared/http-response';
import { UsersService } from '../../manager/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    delete user.password;
    return HttpReturn.build({
      data: this.jwtService.sign(user, {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
      }),
    });
  }
}
