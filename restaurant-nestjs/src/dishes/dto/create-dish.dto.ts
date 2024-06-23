import { AutoMap } from "@automapper/classes";
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Length,
  Max,
  Min,
} from "class-validator";

export class CreateDishDto {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @Length(1, 100, { message: "Name must be between 1 and 100 characters long" })
  @AutoMap()
  name: string;

  @Length(0, 200, {
    message: "Description must be between 0 and 200 characters long",
  })
  @AutoMap()
  description: string;

  @IsOptional()
  @Length(0, 100, {
    message: "Image URL must be between 0 and 100 characters long",
  })
  @AutoMap()
  imageUrl: string;

  @IsNotEmpty({ message: "Weight cannot be empty" })
  @IsInt({ message: "Weight must be an integer" })
  @IsPositive({ message: "Weight must be a positive integer" })
  @AutoMap()
  weight: number;

  @IsNotEmpty({ message: "Price cannot be empty" })
  @IsNumber({}, { message: "Price must be a number" })
  @Min(0, { message: "Price cannot be negative" })
  @AutoMap()
  price: number;

  @IsNotEmpty({ message: "Discount cannot be empty" })
  @IsInt({ message: "Discount must be an integer" })
  @Min(0, { message: "Discount must be at least 0" })
  @Max(100, { message: "Discount must be at most 100" })
  @AutoMap()
  discount: number;

  @IsNotEmpty({ message: "Category ID cannot be empty" })
  @IsInt({ message: "Category ID must be an integer" })
  @IsPositive({ message: "Category ID must be a positive integer" })
  @AutoMap()
  category: number;
}
