import { AutoMap } from "@automapper/classes";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
} from "class-validator";
import { Match } from "../../util/validation/match.decorator";

export class CreateUserDto {
  @IsNotEmpty({ message: "Login cannot be empty" })
  @Length(4, 20, { message: "Login must be between 4 and 20 characters long" })
  @Matches(/^[A-Za-z]\w*$/, {
    message:
      "Login must start with a Latin character and contain only alphanumeric characters or underscores",
  })
  @AutoMap()
  login: string;

  @IsNotEmpty({ message: "Name cannot be empty" })
  @Length(4, 40, { message: "Name must be between 4 and 40 characters long" })
  @Matches(/^[a-zA-Z]+([. '-][a-zA-Z]+)*$/, {
    message: "Name must not contain numbers or special characters",
  })
  @AutoMap()
  name: string;

  @IsNotEmpty({ message: "Password cannot be empty" })
  @Length(8, 16, {
    message: "Password must be between 8 and 16 characters long",
  })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/, {
    message:
      "Password is too weak. It should contain at least 1 digit, 1 lowercase letter, 1 uppercase letter",
  })
  @AutoMap()
  password: string;

  @IsNotEmpty({ message: "Matching password cannot be empty" })
  @Match((userDto: CreateUserDto) => userDto.password, {
    message: "Passwords do not match",
  })
  matchingPassword: string;

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
