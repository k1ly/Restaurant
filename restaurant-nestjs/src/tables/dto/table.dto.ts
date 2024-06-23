import { AutoMap } from "@automapper/classes";

export class TableDto {
  @AutoMap()
  id: number;

  @AutoMap()
  places: number;

  @AutoMap()
  price: number;

  @AutoMap()
  positionX: number;

  @AutoMap()
  positionY: number;

  @AutoMap()
  rotation: number;

  @AutoMap()
  scaleX: number;

  @AutoMap()
  scaleY: number;
}
