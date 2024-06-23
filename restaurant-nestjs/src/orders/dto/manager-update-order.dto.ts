import { AutoMap } from "@automapper/classes";
import { IsInt, IsNotEmpty, IsOptional, IsPositive } from "class-validator";

export class ManagerUpdateOrderDto {
  @IsNotEmpty({ message: "Status ID cannot be empty" })
  @IsInt({ message: "Status ID must be an integer" })
  @IsPositive({ message: "Status ID must be a positive integer" })
  @AutoMap()
  status: number;

  @IsOptional()
  @IsInt({ message: "Manager ID must be an integer" })
  @IsPositive({ message: "Manager ID must be a positive integer" })
  @AutoMap()
  manager: number;
}
