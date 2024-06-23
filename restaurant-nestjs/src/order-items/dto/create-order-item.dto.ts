import { AutoMap } from "@automapper/classes";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class CreateOrderItemDto {
  @IsNotEmpty({ message: "Quantity cannot be empty" })
  @IsInt({ message: "Quantity must be an integer" })
  @IsPositive({ message: "Quantity must be a positive integer" })
  @AutoMap()
  quantity: number;

  @IsNotEmpty({ message: "Dish ID cannot be empty" })
  @IsInt({ message: "Dish ID must be an integer" })
  @IsPositive({ message: "Dish ID must be a positive integer" })
  @AutoMap()
  dish: number;

  @IsNotEmpty({ message: "Order ID cannot be empty" })
  @IsInt({ message: "Order ID must be an integer" })
  @IsPositive({ message: "Order ID must be a positive integer" })
  @AutoMap()
  order: number;
}
