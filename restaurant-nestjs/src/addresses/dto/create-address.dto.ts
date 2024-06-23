import { AutoMap } from "@automapper/classes";
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Length,
} from "class-validator";

export class CreateAddressDto {
  @IsNotEmpty({ message: "Country cannot be empty" })
  @Length(1, 50, {
    message: "Country must be between 1 and 50 characters long",
  })
  @AutoMap()
  country: string;

  @IsNotEmpty({ message: "Locality cannot be empty" })
  @Length(1, 100, {
    message: "Locality must be between 1 and 100 characters long",
  })
  @AutoMap()
  locality: string;

  @IsOptional()
  @Length(1, 100, {
    message: "Street must be between 1 and 100 characters long",
  })
  @AutoMap()
  street: string;

  @IsNotEmpty({ message: "House number cannot be empty" })
  @Length(1, 10, {
    message: "House number must be between 1 and 10 characters long",
  })
  @AutoMap()
  house: string;

  @IsOptional()
  @Length(1, 10, {
    message: "Apartment number must be between 1 and 10 characters long",
  })
  @AutoMap()
  apartment: string;

  @IsNotEmpty({ message: "User ID cannot be empty" })
  @IsInt({ message: "User ID must be an integer" })
  @IsPositive({ message: "User ID must be a positive integer" })
  @AutoMap()
  user: number;
}
