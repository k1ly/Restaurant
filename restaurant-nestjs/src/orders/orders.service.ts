import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { AddressesService } from "../addresses/addresses.service";
import { DishesService } from "../dishes/dishes.service";
import { OrderItemsService } from "../order-items/order-items.service";
import { StatusName } from "../statuses/statuses.names";
import { StatusesService } from "../statuses/statuses.service";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { Pageable } from "../util/pagination/pagination.pageable";
import { CreateOrderDto } from "./dto/create-order.dto";
import { ManagerUpdateOrderDto } from "./dto/manager-update-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Order } from "./entities/order.entity";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly usersService: UsersService,
    private readonly statusesService: StatusesService,
    private readonly addressesService: AddressesService,
    private readonly dishesService: DishesService,
    @Inject(forwardRef(() => OrderItemsService))
    private readonly orderItemsService: OrderItemsService,
    private readonly dataSource: DataSource
  ) {}

  async findAll(pageable: Pageable) {
    try {
      return await this.ordersRepository.findAndCount({
        relations: {
          address: true,
          status: true,
          customer: true,
          manager: true,
        },
        skip: pageable.page * pageable.size,
        take: pageable.size,
        order: { [pageable.sort]: pageable.order },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByStatus(statusId: number, pageable: Pageable) {
    try {
      const status = await this.statusesService.findById(statusId);
      return await this.ordersRepository.findAndCount({
        relations: {
          address: true,
          status: true,
          customer: true,
          manager: true,
        },
        where: { status },
        skip: pageable.page * pageable.size,
        take: pageable.size,
        order: { [pageable.sort]: pageable.order },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByStatusAndCustomer(
    statusId: number,
    customerId: number,
    pageable: Pageable
  ) {
    try {
      const status = await this.statusesService.findById(statusId);
      const customer = await this.usersService.findById(customerId);
      return await this.ordersRepository.findAndCount({
        relations: { address: true, status: true, customer: true },
        where: { status, customer },
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
      return await this.ordersRepository.findOne({
        relations: {
          address: true,
          status: true,
          customer: true,
          manager: true,
        },
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(createOrderDto: CreateOrderDto) {
    const order = this.mapper.map(createOrderDto, CreateOrderDto, Order);
    order.status = await this.statusesService.findByName(StatusName.Created);
    if (!order.status)
      throw new BadRequestException(
        `Status with name "${StatusName.Created}" doesn't exist!`
      );
    order.customer = await this.usersService.findById(createOrderDto.customer);
    if (!order.customer)
      throw new BadRequestException(
        `User with id "${createOrderDto.customer}" doesn't exist!`
      );
    try {
      return this.ordersRepository.save(order);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async confirm(id: number, updateOrderDto: UpdateOrderDto) {
    const order = this.mapper.map(updateOrderDto, UpdateOrderDto, Order);
    order.status = await this.statusesService.findByName(StatusName.Awaiting);
    if (!order.status)
      throw new BadRequestException(
        `Status with name "${StatusName.Awaiting}" doesn't exist!`
      );
    order.address = await this.addressesService.findById(
      updateOrderDto.address
    );
    if (!order.address)
      throw new BadRequestException(
        `Address with id "${updateOrderDto.address}" doesn't exist!`
      );
    order.orderDate = new Date();
    const newOrder = new Order();
    newOrder.status = await this.statusesService.findByName(StatusName.Created);
    if (!newOrder.status)
      throw new BadRequestException(
        `Status with name "${StatusName.Created}" doesn't exist!`
      );
    const oldOrder = await this.findById(id);
    newOrder.customer = oldOrder.customer;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await queryRunner.manager.update(Order, id, order);
      const user = new User();
      user.order = await queryRunner.manager.save(newOrder);
      await queryRunner.manager.update(User, newOrder.customer.id, user);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async edit(id: number, updateOrderDto: ManagerUpdateOrderDto) {
    const order = this.mapper.map(updateOrderDto, ManagerUpdateOrderDto, Order);
    order.status = await this.statusesService.findById(updateOrderDto.status);
    if (!order.status)
      throw new BadRequestException(
        `Status with id "${updateOrderDto.status}" doesn't exist!`
      );
    order.manager = await this.usersService.findById(updateOrderDto.manager);
    if (!order.manager)
      throw new BadRequestException(
        `User with id "${updateOrderDto.manager}" doesn't exist!`
      );
    if (order.status.name === StatusName.Finished)
      order.deliveryDate = new Date();
    try {
      return this.ordersRepository.update(id, order);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async cancel(id: number) {
    const order = new Order();
    order.status = await this.statusesService.findByName(StatusName.Canceled);
    if (!order.status)
      throw new BadRequestException(
        `Status with name "${StatusName.Canceled}" doesn't exist!`
      );
    try {
      return this.ordersRepository.update(id, order);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      return await this.ordersRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
