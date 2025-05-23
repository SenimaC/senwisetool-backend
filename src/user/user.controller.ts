import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(ClerkAuthGuard)
  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @UseGuards(ClerkAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    const email = req.user?.email_addresses?.[0]?.email_address;
    return this.userService.findByEmail(email);
  }

  @UseGuards(ClerkAuthGuard)
  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}
