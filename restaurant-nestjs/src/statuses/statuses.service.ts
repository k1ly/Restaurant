import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateStatusDto } from "./dto/create-status.dto";
import { Status } from "./entities/status.entity";

@Injectable()
export class StatusesService {
  constructor(
    @InjectRepository(Status)
    private readonly statusesRepository: Repository<Status>,
    @InjectMapper() private readonly mapper: Mapper
  ) {}

  async findAll() {
    try {
      return await this.statusesRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: number) {
    try {
      return await this.statusesRepository.findOneBy({ id });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByName(name: string) {
    try {
      return await this.statusesRepository.findOneBy({ name });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(createStatusDto: CreateStatusDto) {
    const status = this.mapper.map(createStatusDto, CreateStatusDto, Status);
    try {
      return await this.statusesRepository.create(status);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, createStatusDto: CreateStatusDto) {
    const status = this.mapper.map(createStatusDto, CreateStatusDto, Status);
    try {
      return await this.statusesRepository.update(id, status);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      return await this.statusesRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
