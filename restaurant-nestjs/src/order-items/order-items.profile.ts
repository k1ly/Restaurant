import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { OrderItemDto } from "./dto/order-item.dto";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";
import { OrderItem } from "./entities/order-item.entity";

@Injectable()
export class OrderItemsProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        OrderItem,
        OrderItemDto,
        forMember(
          (orderItemDto) => orderItemDto.dish,
          mapFrom((orderItem) => orderItem.dish?.id)
        ),
        forMember(
          (orderItemDto) => orderItemDto.order,
          mapFrom((orderItem) => orderItem.order?.id)
        )
      );
      createMap(mapper, CreateOrderItemDto, OrderItem);
      createMap(mapper, UpdateOrderItemDto, OrderItem);
    };
  }
}
