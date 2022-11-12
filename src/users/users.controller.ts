import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Throttle } from '@nestjs/throttler';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthorityEnum } from './authority.enum';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Throttle(1, 300)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Get()
  // @Roles(AuthorityEnum.ADMIN)
  // findAll() {}

  @Get(':id')
  @Roles(AuthorityEnum.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('/me')
  @Roles(AuthorityEnum.NORMAL)
  findOneUserAuth(@Req() request: RequestWithUser) {
    return request.user;
  }

  @Patch(':id')
  @Roles(AuthorityEnum.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('/me')
  @Roles(AuthorityEnum.NORMAL)
  updateUserAuth(
    @Req() request: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(request.user.userid, updateUserDto);
  }

  @Delete(':id')
  @Roles(AuthorityEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Delete('/me')
  @Roles(AuthorityEnum.NORMAL)
  removeUserAuth(@Req() request: RequestWithUser) {
    return this.usersService.remove(request.user.userid);
  }
}
