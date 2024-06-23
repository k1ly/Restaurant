import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { RolesController } from "./roles.controller";
import { RolesProfile } from "./roles.profile";
import { RolesService } from "./roles.service";

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesService, RolesProfile],
  exports: [RolesService, RolesProfile],
})
export class RolesModule {}
