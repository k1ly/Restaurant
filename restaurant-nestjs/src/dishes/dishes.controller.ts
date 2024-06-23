import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { join } from "path";
import { AbilityAction } from "../auth/ability/ability.action";
import { AbilityService } from "../auth/ability/ability.service";
import { Auth } from "../auth/auth.decorator";
import { MediaService } from "../media/media.service";
import { UserDto } from "../users/dto/user.dto";
import { Pagination } from "../util/pagination/pagination.decorator";
import { Pageable } from "../util/pagination/pagination.pageable";
import { DishesService } from "./dishes.service";
import { CreateDishDto } from "./dto/create-dish.dto";
import { DishDto } from "./dto/dish.dto";
import { Dish } from "./entities/dish.entity";

@ApiTags("dishes")
@Controller("api/dishes")
export class DishesController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly dishesService: DishesService,
    private readonly mediaService: MediaService,
    private readonly abilityService: AbilityService,
  ) {}

  @Get()
  async findAll(
    @Query("category") category: number,
    @Query("filter") filter: string,
    @Pagination() pageable: Pageable,
    @Auth() auth: UserDto,
  ) {
    const [dishes, total] = category
      ? await this.dishesService.findByCategory(category, pageable)
      : filter
        ? await this.dishesService.findByFilter(filter, pageable)
        : await this.dishesService.findAll(pageable);
    if (
      dishes.some(
        (dish) =>
          !this.abilityService.authorize(auth, AbilityAction.Read, dish),
      )
    )
      throw new ForbiddenException();
    return {
      content: this.mapper.mapArray(dishes, Dish, DishDto),
      total: Math.ceil(total / pageable.size),
      pageable,
    };
  }

  @Get(":id")
  async findById(@Param("id") id: number, @Auth() auth: UserDto) {
    const dish = await this.dishesService.findById(id);
    if (!dish)
      throw new NotFoundException(`Dish with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Read, dish))
      throw new ForbiddenException();
    return this.mapper.map(dish, Dish, DishDto);
  }

  @Post()
  async create(@Body() createDishDto: CreateDishDto, @Auth() auth: UserDto) {
    if (!this.abilityService.authorize(auth, AbilityAction.Create, Dish))
      throw new ForbiddenException();
    await this.dishesService.create(createDishDto);
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("image"))
  async upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: true,
        }),
    )
    file: Express.Multer.File,
    @Auth() auth: UserDto,
  ) {
    const imageUrl = join("dishes", file.filename);
    if (!this.abilityService.authorize(auth, AbilityAction.Create, Dish)) {
      await this.mediaService.remove(imageUrl);
      throw new ForbiddenException();
    }
    return imageUrl;
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() createDishDto: CreateDishDto,
    @Auth() auth: UserDto,
  ) {
    const dish = await this.dishesService.findById(id);
    if (!dish)
      throw new NotFoundException(`Dish with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Update, dish))
      throw new ForbiddenException();
    await this.dishesService.update(id, createDishDto);
    if (dish.imageUrl && createDishDto.imageUrl !== dish.imageUrl)
      await this.mediaService.remove(dish.imageUrl);
  }

  @Delete(":id")
  async remove(@Param("id") id: number, @Auth() auth: UserDto) {
    const dish = await this.dishesService.findById(id);
    if (!dish)
      throw new NotFoundException(`Dish with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Delete, dish))
      throw new ForbiddenException();
    await this.dishesService.remove(id);
    if (dish.imageUrl) await this.mediaService.remove(dish.imageUrl);
  }
}
