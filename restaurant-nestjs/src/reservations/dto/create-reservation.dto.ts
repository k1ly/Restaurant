import { AutoMap } from "@automapper/classes";
import { IsDateString, IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class CreateReservationDto {
  @IsNotEmpty({ message: "Start date cannot be empty" })
  @IsDateString({}, { message: "Invalid start date format" })
  @AutoMap()
  startDate: string;

  @IsNotEmpty({ message: "End date cannot be empty" })
  @IsDateString({}, { message: "Invalid end date format" })
  @AutoMap()
  endDate: string;

  @IsNotEmpty({ message: "Table ID cannot be empty" })
  @IsInt({ message: "Table ID must be an integer" })
  @IsPositive({ message: "Table ID must be a positive integer" })
  @AutoMap()
  table: number;

  @IsNotEmpty({ message: "Customer ID cannot be empty" })
  @IsInt({ message: "Customer ID must be an integer" })
  @IsPositive({ message: "Customer ID must be a positive integer" })
  @AutoMap()
  customer: number;
}
