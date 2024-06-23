import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { Review } from "./entities/review.entity";
import { ReviewsController } from "./reviews.controller";
import { ReviewsProfile } from "./reviews.profile";
import { ReviewsService } from "./reviews.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsProfile],
  exports: [ReviewsProfile],
})
export class ReviewsModule {}
