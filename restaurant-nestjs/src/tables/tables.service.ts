import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Pageable } from "../util/pagination/pagination.pageable";
import { CreateTableDto } from "./dto/create-table.dto";
import { Table } from "./entities/table.entity";

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    @InjectMapper() private readonly mapper: Mapper
  ) {}

  async findAll(pageable: Pageable) {
    try {
      return await this.tableRepository.findAndCount({
        skip: pageable.page * pageable.size,
        take: pageable.size,
        order: { [pageable.sort]: pageable.order },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: number) {
    try {
      return await this.tableRepository.findOne({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(createTableDto: CreateTableDto) {
    const dish = this.mapper.map(createTableDto, CreateTableDto, Table);
    try {
      return await this.tableRepository.save(dish);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, createTableDto: CreateTableDto) {
    const dish = this.mapper.map(createTableDto, CreateTableDto, Table);
    try {
      return this.tableRepository.update(id, dish);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      return await this.tableRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
