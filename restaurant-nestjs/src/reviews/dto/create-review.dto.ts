import { AutoMap } from "@automapper/classes";
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  Length,
  Max,
  Min,
} from "class-validator";

export class CreateReviewDto {
  @IsNotEmpty({ message: "Grade cannot be empty" })
  @IsInt({ message: "Grade must be an integer" })
  @Min(1, { message: "Grade must be at least 1" })
  @Max(5, { message: "Grade must be at most 5" })
  @AutoMap()
  grade: number;

  @IsNotEmpty({ message: "Comment cannot be empty" })
  @Length(1, 1000, {
    message: "Comment must be between 1 and 1000 characters long",
  })
  @AutoMap()
  comment: string;

  @IsNotEmpty({ message: "User ID cannot be empty" })
  @IsInt({ message: "User ID must be an integer" })
  @IsPositive({ message: "User ID must be a positive integer" })
  @AutoMap()
  user: number;
}
