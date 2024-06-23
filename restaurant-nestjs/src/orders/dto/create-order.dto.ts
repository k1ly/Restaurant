import { AutoMap } from "@automapper/classes";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class CreateOrderDto {
  @IsNotEmpty({ message: "Customer ID cannot be empty" })
  @IsInt({ message: "Customer ID must be an integer" })
  @IsPositive({ message: "Customer ID must be a positive integer" })
  @AutoMap()
  customer: number;
}
