import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../auth/auth.module";
import { DishesModule } from "../dishes/dishes.module";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";

@Module({
  imports: [ConfigModule, DishesModule, AuthModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
