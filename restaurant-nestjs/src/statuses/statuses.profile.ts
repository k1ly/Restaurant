import { Mapper, MappingProfile, createMap } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { CreateStatusDto } from "./dto/create-status.dto";
import { StatusDto } from "./dto/status.dto";
import { Status } from "./entities/status.entity";

@Injectable()
export class StatusesProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Status, StatusDto);
      createMap(mapper, CreateStatusDto, Status);
    };
  }
}
