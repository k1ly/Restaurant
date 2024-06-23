import { classes } from "@automapper/classes";
import { AutomapperModule } from "@automapper/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { AddressesModule } from "./addresses/addresses.module";
import { AuthModule } from "./auth/auth.module";
import { CartModule } from "./cart/cart.module";
import { CategoriesModule } from "./categories/categories.module";
import { DishesModule } from "./dishes/dishes.module";
import { LoggingModule } from "./logging/logging.module";
import { MediaModule } from "./media/media.module";
import { OrderItemsModule } from "./order-items/order-items.module";
import { OrdersModule } from "./orders/orders.module";
import { ReservationsModule } from "./reservations/reservations.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { RolesModule } from "./roles/roles.module";
import { StatusesModule } from "./statuses/statuses.module";
import { TablesModule } from "./tables/tables.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : ".env",
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService) => {
        const publicDirectory = configService.get("PUBLIC_DIRECTORY");
        const rootPath = join(__dirname, "..", publicDirectory);
        return [{ rootPath }];
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService) => ({
        type: configService.get("DB_TYPE"),
        host: configService.get("DB_HOST"),
        port: Number(configService.get("DB_PORT")),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_DATABASE"),
        autoLoadEntities: true,
        ssl: false,
      }),
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    AuthModule,
    RolesModule,
    StatusesModule,
    UsersModule,
    CategoriesModule,
    DishesModule,
    MediaModule,
    OrdersModule,
    OrderItemsModule,
    AddressesModule,
    ReviewsModule,
    TablesModule,
    ReservationsModule,
    CartModule,
    LoggingModule,
  ],
})
export class AppModule {}
