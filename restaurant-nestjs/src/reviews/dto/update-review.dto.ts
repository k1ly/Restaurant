import { AutoMap } from "@automapper/classes";
import { IsInt, IsNotEmpty, Length, Max, Min } from "class-validator";

export class UpdateReviewDto {
  @IsNotEmpty({ message: "Grade cannot be empty" })
  @IsInt({ message: "Grade must be an integer" })
  @Min(1, { message: "Grade must be at least 1" })
  @Max(5, { message: "Grade must be at most 5" })
  @AutoMap()
  grade: number;

  @IsNotEmpty({ message: "Comment cannot be empty" })
  @Length(0, 1000, {
    message: "Comment must be between 0 and 1000 characters long",
  })
  @AutoMap()
  comment: string;
}
