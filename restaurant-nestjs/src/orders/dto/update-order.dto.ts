import { AutoMap } from "@automapper/classes";
import { IsDateString, IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class UpdateOrderDto {
  @IsNotEmpty({ message: "Specified date cannot be empty" })
  @IsDateString({}, { message: "Specified date must be a valid date string" })
  @AutoMap()
  specifiedDate: string;

  @IsNotEmpty({ message: "Address ID cannot be empty" })
  @IsInt({ message: "Address ID must be an integer" })
  @IsPositive({ message: "Address ID must be a positive integer" })
  @AutoMap()
  address: number;
}
