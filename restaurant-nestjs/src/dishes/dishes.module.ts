import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { diskStorage } from "multer";
import { join } from "path";
import { MediaModule } from "src/media/media.module";
import { AuthModule } from "../auth/auth.module";
import { CategoriesModule } from "../categories/categories.module";
import { DishesController } from "./dishes.controller";
import { DishesProfile } from "./dishes.profile";
import { DishesService } from "./dishes.service";
import { Dish } from "./entities/dish.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Dish]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const publicDirectory = configService.get("PUBLIC_DIRECTORY");
        const destinationPath = join(
          __dirname,
          "..",
          "..",
          publicDirectory,
          "dishes"
        );
        return {
          dest: destinationPath,
          storage: diskStorage({
            destination: destinationPath,
          }),
        };
      },
    }),
    MediaModule,
    forwardRef(() => CategoriesModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [DishesController],
  providers: [DishesService, DishesProfile],
  exports: [DishesService, DishesProfile],
})
export class DishesModule {}
