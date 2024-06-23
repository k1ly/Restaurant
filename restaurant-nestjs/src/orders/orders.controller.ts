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
  Patch,
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
import { ManagerUpdateOrderDto } from "./dto/manager-update-order.dto";
import { OrderDto } from "./dto/order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Order } from "./entities/order.entity";
import { OrdersGateway } from "./orders.gateway";
import { OrdersService } from "./orders.service";

@ApiTags("orders")
@Controller("api/orders")
export class OrdersController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly ordersService: OrdersService,
    private readonly ordersGateway: OrdersGateway,
    private readonly abilityService: AbilityService
  ) {}

  @Get()
  async findAll(
    @Query("status") status: number,
    @Query("customer") customer: number,
    @Pagination() pageable: Pageable,
    @Auth() auth: UserDto
  ) {
    const [orders, total] = customer
      ? await this.ordersService.findByStatusAndCustomer(
          status,
          customer,
          pageable
        )
      : await this.ordersService.findByStatus(status, pageable);
    if (
      orders.some(
        (order) =>
          !this.abilityService.authorize(auth, AbilityAction.Read, order)
      )
    )
      throw new ForbiddenException();
    return {
      content: this.mapper.mapArray(orders, Order, OrderDto),
      total: Math.ceil(total / pageable.size),
      pageable,
    };
  }

  @Get(":id")
  async findById(@Param("id") id: number, @Auth() auth: UserDto) {
    const order = await this.ordersService.findById(id);
    if (!order)
      throw new NotFoundException(`Order with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Read, order))
      throw new ForbiddenException();
    return this.mapper.map(order, Order, OrderDto);
  }

  @Put(":id")
  async confirm(
    @Param("id") id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Auth() auth: UserDto
  ) {
    let order = await this.ordersService.findById(id);
    if (!order)
      throw new NotFoundException(`Order with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Create, order))
      throw new ForbiddenException();
    await this.ordersService.confirm(id, updateOrderDto);
    order = await this.ordersService.findById(id);
    this.ordersGateway.notifyManagers(order.status.name);
  }

  @Patch(":id")
  async edit(
    @Param("id") id: number,
    @Body() updateOrderDto: ManagerUpdateOrderDto,
    @Auth() auth: UserDto
  ) {
    let order = await this.ordersService.findById(id);
    if (!order)
      throw new NotFoundException(`Order with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Update, order))
      throw new ForbiddenException();
    await this.ordersService.edit(id, updateOrderDto);
    order = await this.ordersService.findById(id);
    this.ordersGateway.notifyManagers(order.status.name);
  }

  @Delete(":id")
  async cancel(@Param("id") id: number, @Auth() auth: UserDto) {
    let order = await this.ordersService.findById(id);
    if (!order)
      throw new NotFoundException(`Order with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Delete, order))
      throw new ForbiddenException();
    await this.ordersService.cancel(id);
    order = await this.ordersService.findById(id);
    this.ordersGateway.notifyManagers(order.status.name);
  }
}
