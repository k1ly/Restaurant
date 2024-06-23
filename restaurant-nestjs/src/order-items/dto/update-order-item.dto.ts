import { AutoMap } from "@automapper/classes";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class UpdateOrderItemDto {
  @IsNotEmpty({ message: "Quantity cannot be empty" })
  @IsInt({ message: "Quantity must be an integer" })
  @IsPositive({ message: "Quantity must be a positive integer" })
  @AutoMap()
  quantity: number;
}
