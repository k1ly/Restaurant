import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Status } from "./entities/status.entity";
import { StatusesController } from "./statuses.controller";
import { StatusesProfile } from "./statuses.profile";
import { StatusesService } from "./statuses.service";

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  controllers: [StatusesController],
  providers: [StatusesService, StatusesProfile],
  exports: [StatusesService, StatusesProfile],
})
export class StatusesModule {}
