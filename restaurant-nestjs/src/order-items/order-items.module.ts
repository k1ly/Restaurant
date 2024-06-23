import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { DishesModule } from "../dishes/dishes.module";
import { OrdersModule } from "../orders/orders.module";
import { OrderItem } from "./entities/order-item.entity";
import { OrderItemsController } from "./order-items.controller";
import { OrderItemsProfile } from "./order-items.profile";
import { OrderItemsService } from "./order-items.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItem]),
    forwardRef(() => DishesModule),
    forwardRef(() => OrdersModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [OrderItemsController],
  providers: [OrderItemsService, OrderItemsProfile],
  exports: [OrderItemsService, OrderItemsProfile],
})
export class OrderItemsModule {}
