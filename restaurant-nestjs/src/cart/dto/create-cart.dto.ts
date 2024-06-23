import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class CreateCartDto {
  @IsNotEmpty({ message: "Quantity cannot be empty" })
  @IsInt({ message: "Quantity must be an integer" })
  @IsPositive({ message: "Quantity must be a positive integer" })
  quantity: number;

  @IsNotEmpty({ message: "Dish ID cannot be empty" })
  @IsInt({ message: "Dish ID must be an integer" })
  @IsPositive({ message: "Dish ID must be a positive integer" })
  dish: number;
}
