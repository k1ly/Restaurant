import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { RolesModule } from "../roles/roles.module";
import { User } from "./entities/user.entity";
import { UsersController } from "./users.controller";
import { UsersProfile } from "./users.profile";
import { UsersService } from "./users.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RolesModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersProfile],
  exports: [UsersService, UsersProfile],
})
export class UsersModule {}
