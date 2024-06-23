import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { Table } from "./entities/table.entity";
import { TablesController } from "./tables.controller";
import { TablesProfile } from "./tables.profile";
import { TablesService } from "./tables.service";

@Module({
  imports: [TypeOrmModule.forFeature([Table]), forwardRef(() => AuthModule)],
  controllers: [TablesController],
  providers: [TablesService, TablesProfile],
  exports: [TablesService, TablesProfile],
})
export class TablesModule {}
