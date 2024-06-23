import { RedisModule } from "@liaoliaots/nestjs-redis";
import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { DishesModule } from "../dishes/dishes.module";
import { RolesModule } from "../roles/roles.module";
import { StatusesModule } from "../statuses/statuses.module";
import { UsersModule } from "../users/users.module";
import { AbilityService } from "./ability/ability.service";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { TokenService } from "./token/token.service";

@Module({
  imports: [
    ConfigModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          config: {
            url: configService.get("REDIS_URL"),
          },
        };
      },
    }),
    JwtModule,
    RolesModule,
    StatusesModule,
    forwardRef(() => UsersModule),
    forwardRef(() => DishesModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AbilityService,
    TokenService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AbilityService],
})
export class AuthModule {}
