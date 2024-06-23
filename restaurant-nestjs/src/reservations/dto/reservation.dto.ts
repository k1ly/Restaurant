import { AutoMap } from "@automapper/classes";

export class ReservationDto {
  @AutoMap()
  id: number;

  @AutoMap()
  price: number;

  @AutoMap()
  startDate: Date;

  @AutoMap()
  endDate: Date;

  @AutoMap()
  date: Date;

  @AutoMap()
  table: number;

  @AutoMap()
  customer: number;
}
