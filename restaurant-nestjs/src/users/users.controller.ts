import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Put,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AbilityAction } from "../auth/ability/ability.action";
import { AbilityService } from "../auth/ability/ability.service";
import { Auth } from "../auth/auth.decorator";
import { Pagination } from "../util/pagination/pagination.decorator";
import { Pageable } from "../util/pagination/pagination.pageable";
import { AdminUpdateUserDto } from "./dto/admin-update-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserDto } from "./dto/user.dto";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("api/users")
export class UsersController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly usersService: UsersService,
    private readonly abilityService: AbilityService
  ) {}

  @Get()
  async findAll(
    @Query("filter") filter: string,
    @Pagination() pageable: Pageable,
    @Auth() auth: UserDto
  ) {
    const [users, total] = filter
      ? await this.usersService.findByFilter(filter, pageable)
      : await this.usersService.findAll(pageable);
    if (
      users.some(
        (user) => !this.abilityService.authorize(auth, AbilityAction.Read, user)
      )
    )
      throw new ForbiddenException();
    return {
      content: this.mapper.mapArray(users, User, UserDto),
      total: Math.ceil(total / pageable.size),
      pageable,
    };
  }

  @Get(":id")
  async findById(@Param("id") id: number, @Auth() auth: UserDto) {
    const user = await this.usersService.findById(id);
    if (!user)
      throw new NotFoundException(`User with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Read, user))
      throw new ForbiddenException();
    return this.mapper.map(user, User, UserDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Auth() auth: UserDto
  ) {
    const user = await this.usersService.findById(id);
    if (!user)
      throw new NotFoundException(`User with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Create, user))
      throw new ForbiddenException();
    await this.usersService.update(id, updateUserDto);
  }

  @Patch(":id")
  async edit(
    @Param("id") id: number,
    @Body() updateUserDto: AdminUpdateUserDto,
    @Auth() auth: UserDto
  ) {
    const user = await this.usersService.findById(id);
    if (!user)
      throw new NotFoundException(`User with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Update, user))
      throw new ForbiddenException();
    await this.usersService.edit(id, updateUserDto);
  }
}
