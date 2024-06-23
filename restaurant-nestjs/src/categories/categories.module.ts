import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { CategoriesController } from "./categories.controller";
import { CategoriesProfile } from "./categories.profile";
import { CategoriesService } from "./categories.service";
import { Category } from "./entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Category]), forwardRef(() => AuthModule)],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesProfile],
  exports: [CategoriesService, CategoriesProfile],
})
export class CategoriesModule {}
