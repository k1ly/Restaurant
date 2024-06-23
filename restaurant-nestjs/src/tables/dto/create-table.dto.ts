import { AutoMap } from "@automapper/classes";
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Max,
  Min,
} from "class-validator";

export class CreateTableDto {
  @IsNotEmpty({ message: "Places cannot be empty" })
  @IsInt({ message: "Places must be an integer" })
  @IsPositive({ message: "Places must be a positive integer" })
  @AutoMap()
  places: number;

  @IsNotEmpty({ message: "Price cannot be empty" })
  @IsNumber({}, { message: "Price must be a number" })
  @Min(0, { message: "Price cannot be negative" })
  @AutoMap()
  price: number;

  @IsNotEmpty({ message: "PositionX cannot be empty" })
  @IsNumber({}, { message: "PositionX must be a number" })
  @AutoMap()
  positionX: number;

  @IsNotEmpty({ message: "PositionY cannot be empty" })
  @IsNumber({}, { message: "PositionY must be a number" })
  @AutoMap()
  positionY: number;

  @IsNotEmpty({ message: "Rotation cannot be empty" })
  @IsNumber({}, { message: "Rotation must be a number" })
  @Min(0, { message: "Rotation must be at least 0" })
  @Max(75, { message: "Rotation must be at most 75" })
  @AutoMap()
  rotation: number;

  @IsNotEmpty({ message: "ScaleX cannot be empty" })
  @IsNumber({}, { message: "ScaleX must be a number" })
  @IsPositive({ message: "ScaleX must be a positive number" })
  @AutoMap()
  scaleX: number;

  @IsNotEmpty({ message: "ScaleY cannot be empty" })
  @IsNumber({}, { message: "ScaleY must be a number" })
  @IsPositive({ message: "ScaleY must be a positive number" })
  @AutoMap()
  scaleY: number;
}
