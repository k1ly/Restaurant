import { AutoMap } from "@automapper/classes";
import { IsBoolean, IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class AdminUpdateUserDto {
  @IsNotEmpty({ message: "Blocked status cannot be empty" })
  @IsBoolean({ message: "Blocked status must be a boolean value" })
  @AutoMap()
  blocked: boolean;

  @IsNotEmpty({ message: "Role ID cannot be empty" })
  @IsInt({ message: "Role ID must be an integer" })
  @IsPositive({ message: "Role ID must be a positive integer" })
  @AutoMap()
  role: number;
}
