import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';

interface User { username: string; password: string; name: string; email: string; phone?: string; }

@Injectable()
export class AppService {
  private users: User[] = [];

  getUsers() {
    return this.users.map(({ password, ...rest }) => rest);
  }

  signup(user: User) {
    if (this.users.some(u => u.username.toLowerCase() === user.username.toLowerCase())) {
      throw new ConflictException('Username already exists');
    }
    this.users.push(user);
    const { password, ...payload } = user;
    return { message: 'User registered', user: payload };
  }

  login(payload: { username: string; password: string }) {
    const user = this.users.find(u => u.username.toLowerCase() === payload.username?.toLowerCase());
    if (!user || user.password !== payload.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { password, ...safe } = user;
    return { message: 'Login success', user: safe };
  }
}
