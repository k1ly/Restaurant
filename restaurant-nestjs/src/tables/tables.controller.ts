import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AbilityAction } from "../auth/ability/ability.action";
import { AbilityService } from "../auth/ability/ability.service";
import { Auth } from "../auth/auth.decorator";
import { UserDto } from "../users/dto/user.dto";
import { Pagination } from "../util/pagination/pagination.decorator";
import { Pageable } from "../util/pagination/pagination.pageable";
import { CreateTableDto } from "./dto/create-table.dto";
import { TableDto } from "./dto/table.dto";
import { Table } from "./entities/table.entity";
import { TablesService } from "./tables.service";

@ApiTags("tables")
@Controller("api/tables")
export class TablesController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly tablesService: TablesService,
    private readonly abilityService: AbilityService
  ) {}

  @Get()
  async findAll(@Pagination() pageable: Pageable, @Auth() auth: UserDto) {
    const [tables, total] = await this.tablesService.findAll(pageable);
    if (
      tables.some(
        (table) =>
          !this.abilityService.authorize(auth, AbilityAction.Read, table)
      )
    )
      throw new ForbiddenException();
    return {
      content: this.mapper.mapArray(tables, Table, TableDto),
      total: Math.ceil(total / pageable.size),
      pageable,
    };
  }

  @Get(":id")
  async findById(@Param("id") id: number, @Auth() auth: UserDto) {
    const table = await this.tablesService.findById(id);
    if (!table)
      throw new NotFoundException(`Table with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Read, table))
      throw new ForbiddenException();
    return this.mapper.map(table, Table, TableDto);
  }

  @Post()
  async create(@Body() createTableDto: CreateTableDto, @Auth() auth: UserDto) {
    if (!this.abilityService.authorize(auth, AbilityAction.Create, Table))
      throw new ForbiddenException();
    await this.tablesService.create(createTableDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() createTableDto: CreateTableDto,
    @Auth() auth: UserDto
  ) {
    const table = await this.tablesService.findById(id);
    if (!table)
      throw new NotFoundException(`Table with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Update, table))
      throw new ForbiddenException();
    await this.tablesService.update(id, createTableDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: number, @Auth() auth: UserDto) {
    const table = await this.tablesService.findById(id);
    if (!table)
      throw new NotFoundException(`Table with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Delete, table))
      throw new ForbiddenException();
    await this.tablesService.remove(id);
  }
}
