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
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { OrderItemDto } from "./dto/order-item.dto";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";
import { OrderItem } from "./entities/order-item.entity";
import { OrderItemsService } from "./order-items.service";

@ApiTags("order-items")
@Controller("api/order-items")
export class OrderItemsController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly orderItemsService: OrderItemsService,
    private readonly abilityService: AbilityService
  ) {}

  @Get()
  async findAll(
    @Query("order") order: number,
    @Pagination() pageable: Pageable,
    @Auth() auth: UserDto
  ) {
    const [orderItems, total] = await this.orderItemsService.findByOrder(
      order,
      pageable
    );
    if (
      orderItems.some(
        (orderItem) =>
          !this.abilityService.authorize(auth, AbilityAction.Read, orderItem)
      )
    )
      throw new ForbiddenException();
    return {
      content: this.mapper.mapArray(orderItems, OrderItem, OrderItemDto),
      total: Math.ceil(total / pageable.size),
      pageable,
    };
  }

  @Post()
  async create(
    @Body() createOrderItemDto: CreateOrderItemDto,
    @Auth() auth: UserDto
  ) {
    if (
      !this.abilityService.authorize(
        auth,
        AbilityAction.Create,
        createOrderItemDto
      )
    )
      throw new ForbiddenException();
    await this.orderItemsService.create(createOrderItemDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
    @Auth() auth: UserDto
  ) {
    const orderItem = await this.orderItemsService.findById(id);
    if (!orderItem)
      throw new NotFoundException(`Order item with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Update, orderItem))
      throw new ForbiddenException();
    await this.orderItemsService.update(id, updateOrderItemDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: number, @Auth() auth: UserDto) {
    const orderItem = await this.orderItemsService.findById(id);
    if (!orderItem)
      throw new NotFoundException(`Order item with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Delete, orderItem))
      throw new ForbiddenException();
    await this.orderItemsService.remove(id);
  }
}
