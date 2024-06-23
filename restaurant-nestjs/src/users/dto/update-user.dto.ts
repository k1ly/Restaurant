import { AutoMap } from "@automapper/classes";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
} from "class-validator";

export class UpdateUserDto {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @Length(4, 40, { message: "Name must be between 4 and 40 characters long" })
  @Matches(/^[a-zA-Z]+([. '-][a-zA-Z]+)*$/, {
    message: "Name must not contain numbers or special characters",
  })
  @AutoMap()
  name: string;

  @IsNotEmpty({ message: "Email cannot be empty" })
  @IsEmail({}, { message: "Invalid email format" })
  @Length(3, 320, {
    message: "Email must be between 3 and 320 characters long",
  })
  @AutoMap()
  email: string;

  @IsOptional()
  @Matches(/^(\+\d{1,3}( )?)?((\(\d{1,3}\))|\d{1,3})[- ]?\d{3,4}[- ]?\d{4}/, {
    message: "Invalid phone number format",
  })
  @AutoMap()
  phone: string;
}
