import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { User } from '@prisma/client';
import { AllPermissions } from 'src/common/constants/permissions.constant';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { Secure } from 'src/common/decorators/secure.decorator';
import { UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Secure('ACTIVE_USER', AllPermissions.USER_MANAGER)
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  @Secure('CONNECTED')
  getMe(@AuthUser() user: User) {
    return this.userService.getUser(user.id);
  }

  @Get(':id')
  @Secure('ACTIVE_USER', AllPermissions.USER_MANAGER)
  findOne(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Patch(':id')
  @Secure('ACTIVE_USER', AllPermissions.USER_MANAGER)
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @Secure('ACTIVE_USER', AllPermissions.USER_MANAGER)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
