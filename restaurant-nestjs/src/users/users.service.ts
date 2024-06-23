import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { RoleName } from "../roles/roles.names";
import { RolesService } from "../roles/roles.service";
import { Pageable } from "../util/pagination/pagination.pageable";
import { AdminUpdateUserDto } from "./dto/admin-update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly rolesService: RolesService
  ) {}

  async findAll(pageable: Pageable) {
    try {
      return await this.usersRepository.findAndCount({
        relations: { role: true, order: true },
        skip: pageable.page * pageable.size,
        take: pageable.size,
        order: { [pageable.sort]: pageable.order },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByFilter(filter: string, pageable: Pageable) {
    try {
      return await this.usersRepository.findAndCount({
        relations: { role: true, order: true },
        where: { login: Like(`%${filter}%`) },
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
      return await this.usersRepository.findOne({
        relations: { role: true, order: true },
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByLogin(login: string) {
    try {
      return await this.usersRepository.findOne({
        relations: { role: true, order: true },
        where: { login },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.mapper.map(createUserDto, CreateUserDto, User);
    user.role = await this.rolesService.findByName(RoleName.Guest);
    if (!user.role)
      throw new BadRequestException(
        `Role with name "${RoleName.Guest}" doesn't exist!`
      );
    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.mapper.map(updateUserDto, UpdateUserDto, User);
    try {
      return this.usersRepository.update(id, user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async edit(id: number, updateUserDto: AdminUpdateUserDto) {
    const user = this.mapper.map(updateUserDto, AdminUpdateUserDto, User);
    user.role = await this.rolesService.findById(updateUserDto.role);
    if (!user.role)
      throw new BadRequestException(
        `Role with id "${updateUserDto.role}" doesn't exist!`
      );
    try {
      return this.usersRepository.update(id, user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      return await this.usersRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
