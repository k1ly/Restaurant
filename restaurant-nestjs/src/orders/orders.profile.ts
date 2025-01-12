import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { ManagerUpdateOrderDto } from "./dto/manager-update-order.dto";
import { OrderDto } from "./dto/order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Order } from "./entities/order.entity";

@Injectable()
export class OrdersProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        Order,
        OrderDto,
        forMember(
          (orderDto) => orderDto.address,
          mapFrom((order) => order.address?.id)
        ),
        forMember(
          (orderDto) => orderDto.status,
          mapFrom((order) => order.status?.name)
        ),
        forMember(
          (orderDto) => orderDto.customer,
          mapFrom((order) => order.customer?.id)
        ),
        forMember(
          (orderDto) => orderDto.manager,
          mapFrom((order) => order.manager?.id)
        )
      );
      createMap(mapper, CreateOrderDto, Order);
      createMap(
        mapper,
        UpdateOrderDto,
        Order,
        forMember(
          (order) => order.specifiedDate,
          mapFrom((orderDto) => new Date(Date.parse(orderDto.specifiedDate)))
        )
      );
      createMap(mapper, ManagerUpdateOrderDto, Order);
    };
  }
}
