import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressesModule } from "../addresses/addresses.module";
import { AuthModule } from "../auth/auth.module";
import { DishesModule } from "../dishes/dishes.module";
import { OrderItemsModule } from "../order-items/order-items.module";
import { StatusesModule } from "../statuses/statuses.module";
import { UsersModule } from "../users/users.module";
import { Order } from "./entities/order.entity";
import { OrdersController } from "./orders.controller";
import { OrdersGateway } from "./orders.gateway";
import { OrdersProfile } from "./orders.profile";
import { OrdersService } from "./orders.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    StatusesModule,
    forwardRef(() => UsersModule),
    forwardRef(() => AddressesModule),
    forwardRef(() => DishesModule),
    forwardRef(() => OrderItemsModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersProfile, OrdersGateway],
  exports: [OrdersService, OrdersProfile, OrdersGateway],
})
export class OrdersModule {}
