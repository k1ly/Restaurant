import { AutoMap } from "@automapper/classes";
import { IsNotEmpty, Length } from "class-validator";

export class UpdateAddressDto {
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

  @IsNotEmpty({ message: "Street cannot be empty" })
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

  @IsNotEmpty({ message: "Apartment number cannot be empty" })
  @Length(1, 10, {
    message: "Apartment number must be between 1 and 10 characters long",
  })
  @AutoMap()
  apartment: string;
}
