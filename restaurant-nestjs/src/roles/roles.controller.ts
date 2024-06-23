import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Controller, Get, NotFoundException, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RoleDto } from "./dto/role.dto";
import { Role } from "./entities/role.entity";
import { RolesService } from "./roles.service";

@ApiTags("roles")
@Controller("api/roles")
export class RolesController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly rolesService: RolesService
  ) {}

  @Get()
  async findAll() {
    const roles = await this.rolesService.findAll();
    return this.mapper.mapArray(roles, Role, RoleDto);
  }

  @Get("find")
  async findByName(@Query("name") name: string) {
    const role = await this.rolesService.findByName(name);
    if (!role)
      throw new NotFoundException(`Role with name "${name}" doesn't exist!`);
    return this.mapper.map(role, Role, RoleDto);
  }
}
