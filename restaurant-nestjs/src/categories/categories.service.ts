import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { Pageable } from "../util/pagination/pagination.pageable";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { Category } from "./entities/category.entity";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectMapper() private readonly mapper: Mapper
  ) {}

  async findAll(pageable: Pageable) {
    try {
      return await this.categoriesRepository.findAndCount({
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
      return await this.categoriesRepository.findAndCount({
        where: { name: Like(`%${filter}%`) },
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
      return await this.categoriesRepository.findOne({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const dish = this.mapper.map(
      createCategoryDto,
      CreateCategoryDto,
      Category
    );
    try {
      return await this.categoriesRepository.save(dish);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, createCategoryDto: CreateCategoryDto) {
    const dish = this.mapper.map(
      createCategoryDto,
      CreateCategoryDto,
      Category
    );
    try {
      return this.categoriesRepository.update(id, dish);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      return await this.categoriesRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
