import { Mapper, MappingProfile, createMap } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { CreateTableDto } from "./dto/create-table.dto";
import { TableDto } from "./dto/table.dto";
import { Table } from "./entities/table.entity";

export class TablesProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Table, TableDto);
      createMap(mapper, CreateTableDto, Table);
    };
  }
}
