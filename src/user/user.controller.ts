import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
} from '@nestjs/common';
import { AllPermissions } from 'src/common/constants/permissions.constant';
import { Secure } from 'src/common/decorators/secure.decorator';
import { UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@Secure('ACTIVE_USER', AllPermissions.USER_MANAGER)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  getMe(@Request() req) {
    return this.userService.getUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
