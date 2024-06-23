import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Controller, Get, NotFoundException, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { StatusDto } from "./dto/status.dto";
import { Status } from "./entities/status.entity";
import { StatusesService } from "./statuses.service";

@ApiTags("statuses")
@Controller("api/statuses")
export class StatusesController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly statusesService: StatusesService
  ) {}

  @Get("find")
  async findByName(@Query("name") name: string) {
    const status = await this.statusesService.findByName(name);
    if (!status)
      throw new NotFoundException(`Status with name "${name}" doesn't exist!`);
    return this.mapper.map(status, Status, StatusDto);
  }
}
