import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { TablesModule } from "../tables/tables.module";
import { UsersModule } from "../users/users.module";
import { Reservation } from "./entities/reservation.entity";
import { ReservationsController } from "./reservations.controller";
import { ReservationsGateway } from "./reservations.gateway";
import { ReservationsProfile } from "./reservations.profile";
import { ReservationsService } from "./reservations.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    TablesModule,
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsProfile, ReservationsGateway],
  exports: [ReservationsService, ReservationsProfile, ReservationsGateway],
})
export class ReservationsModule {}
