import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { ReservationDto } from "./dto/reservation.dto";
import { Reservation } from "./entities/reservation.entity";

@Injectable()
export class ReservationsProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        Reservation,
        ReservationDto,
        forMember(
          (reservationDto) => reservationDto.table,
          mapFrom((reservation) => reservation.table?.id)
        ),
        forMember(
          (reservationDto) => reservationDto.customer,
          mapFrom((reservation) => reservation.customer?.id)
        )
      );
      createMap(
        mapper,
        CreateReservationDto,
        Reservation,
        forMember(
          (reservation) => reservation.startDate,
          mapFrom(
            (reservationDto) => new Date(Date.parse(reservationDto.startDate))
          )
        ),
        forMember(
          (reservation) => reservation.endDate,
          mapFrom(
            (reservationDto) => new Date(Date.parse(reservationDto.endDate))
          )
        )
      );
    };
  }
}
