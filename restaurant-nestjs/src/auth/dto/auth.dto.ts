import { AutoMap } from "@automapper/classes";
import { IsNotEmpty, Length, Matches } from "class-validator";

export class AuthDto {
  @IsNotEmpty({ message: "Login cannot be empty" })
  @Length(4, 20, { message: "Login must be between 4 and 20 characters long" })
  @Matches(/^[A-Za-z]\w*$/, {
    message:
      "Login must start with a Latin character and contain only alphanumeric characters or underscores",
  })
  @AutoMap()
  login: string;

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
}
