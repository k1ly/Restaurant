import { AutoMap } from "@automapper/classes";
import { IsNotEmpty, Length } from "class-validator";

export class CreateStatusDto {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @Length(1, 30, { message: "Name must be between 1 and 30 characters long" })
  @AutoMap()
  name: string;
}
