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
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AbilityAction } from "../auth/ability/ability.action";
import { AbilityService } from "../auth/ability/ability.service";
import { Auth } from "../auth/auth.decorator";
import { UserDto } from "../users/dto/user.dto";
import { Pagination } from "../util/pagination/pagination.decorator";
import { Pageable } from "../util/pagination/pagination.pageable";
import { CreateReviewDto } from "./dto/create-review.dto";
import { ReviewDto } from "./dto/review.dto";
import { Review } from "./entities/review.entity";
import { ReviewsService } from "./reviews.service";

@ApiTags("reviews")
@Controller("api/reviews")
export class ReviewsController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly reviewsService: ReviewsService,
    private readonly abilityService: AbilityService
  ) {}

  @Get()
  async findAll(
    @Query("filter") filter: string,
    @Pagination() pageable: Pageable,
    @Auth() auth: UserDto
  ) {
    const [reviews, total] = filter
      ? await this.reviewsService.findByFilter(filter, pageable)
      : await this.reviewsService.findAll(pageable);
    if (
      reviews.some(
        (review) =>
          !this.abilityService.authorize(auth, AbilityAction.Read, review)
      )
    )
      throw new ForbiddenException();
    return {
      content: this.mapper.mapArray(reviews, Review, ReviewDto),
      total: Math.ceil(total / pageable.size),
      pageable,
    };
  }

  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @Auth() auth: UserDto
  ) {
    if (
      !this.abilityService.authorize(
        auth,
        AbilityAction.Create,
        createReviewDto
      )
    )
      throw new ForbiddenException();
    await this.reviewsService.create(createReviewDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: number, @Auth() auth: UserDto) {
    const review = await this.reviewsService.findById(id);
    if (!review)
      throw new NotFoundException(`Review with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Delete, review))
      throw new ForbiddenException();
    await this.reviewsService.remove(id);
  }
}
