import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AllRoles } from 'src/common/constants/roles.constant';
import { Secure } from 'src/common/decorators/secure.decorator';
import { CurrentUser } from 'src/common/types/user.type';
import { AssistantAccountDto } from 'src/user/user.dto';
import { AuthUser } from '../common/decorators/auth-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserService } from './user.service';

@Controller('users/assistant')
export class AssisTantController {
  constructor(private userService: UserService) {}

  @Post()
  @Secure('ACTIVE_USER')
  @Roles(AllRoles.ASSISTANT)
  createAssistantAccount(
    @Body() dto: AssistantAccountDto,
    @AuthUser() user: CurrentUser,
  ) {
    return this.userService.createAssistantAccount(dto, user);
  }

  @Get()
  @Secure('ACTIVE_USER')
  @Roles(AllRoles.DG, AllRoles.ADG)
  getAssistantAccounts(@AuthUser() user: CurrentUser) {
    return this.userService.getAssistantAccounts(user);
  }

  @Get(':id')
  @Secure('ACTIVE_USER')
  @Roles(AllRoles.DG, AllRoles.ADG)
  getAssistantAccount(@Param('id') id: string, @AuthUser() user: CurrentUser) {
    return this.userService.getAssistantAccount(user, id);
  }
}
