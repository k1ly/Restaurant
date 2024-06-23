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
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AbilityAction } from "../auth/ability/ability.action";
import { AbilityService } from "../auth/ability/ability.service";
import { Auth } from "../auth/auth.decorator";
import { UserDto } from "../users/dto/user.dto";
import { Pagination } from "../util/pagination/pagination.decorator";
import { Pageable } from "../util/pagination/pagination.pageable";
import { CategoriesService } from "./categories.service";
import { CategoryDto } from "./dto/category.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { Category } from "./entities/category.entity";

@ApiTags("categories")
@Controller("api/categories")
export class CategoriesController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly categoriesService: CategoriesService,
    private readonly abilityService: AbilityService
  ) {}

  @Get()
  async findAll(
    @Query("filter") filter: string,
    @Pagination() pageable: Pageable,
    @Auth() auth: UserDto
  ) {
    const [categories, total] = filter
      ? await this.categoriesService.findByFilter(filter, pageable)
      : await this.categoriesService.findAll(pageable);
    if (
      categories.some(
        (category) =>
          !this.abilityService.authorize(auth, AbilityAction.Read, category)
      )
    )
      throw new ForbiddenException();
    return {
      content: this.mapper.mapArray(categories, Category, CategoryDto),
      total: Math.ceil(total / pageable.size),
      pageable,
    };
  }

  @Get(":id")
  async findById(@Param("id") id: number, @Auth() auth: UserDto) {
    const category = await this.categoriesService.findById(id);
    if (!category)
      throw new NotFoundException(`Category with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Read, category))
      throw new ForbiddenException();
    return this.mapper.map(category, Category, CategoryDto);
  }

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Auth() auth: UserDto
  ) {
    if (!this.abilityService.authorize(auth, AbilityAction.Create, Category))
      throw new ForbiddenException();
    await this.categoriesService.create(createCategoryDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() createCategoryDto: CreateCategoryDto,
    @Auth() auth: UserDto
  ) {
    const category = await this.categoriesService.findById(id);
    if (!category)
      throw new NotFoundException(`Category with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Update, category))
      throw new ForbiddenException();
    await this.categoriesService.update(id, createCategoryDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: number, @Auth() auth: UserDto) {
    const category = await this.categoriesService.findById(id);
    if (!category)
      throw new NotFoundException(`Category with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Delete, category))
      throw new ForbiddenException();
    await this.categoriesService.remove(id);
  }
}
