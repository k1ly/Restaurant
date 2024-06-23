import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { AddressesController } from "./addresses.controller";
import { AddressesProfile } from "./addresses.profile";
import { AddressesService } from "./addresses.service";
import { Address } from "./entities/address.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Address]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [AddressesController],
  providers: [AddressesService, AddressesProfile],
  exports: [AddressesService, AddressesProfile],
})
export class AddressesModule {}
