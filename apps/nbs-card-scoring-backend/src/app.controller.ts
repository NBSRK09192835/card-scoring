import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('users')
  getUsers() {
    return this.appService.getUsers();
  }

  @Post('signup')
  signup(@Body() payload: { username: string; password: string; name: string; email: string; phone?: string }) {
    return this.appService.signup(payload);
  }

  @Post('login')
  login(@Body() payload: { username: string; password: string }) {
    return this.appService.login(payload);
  }
}
