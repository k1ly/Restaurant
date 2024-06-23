import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AbilityAction } from "../auth/ability/ability.action";
import { AbilityService } from "../auth/ability/ability.service";
import { Auth } from "../auth/auth.decorator";
import { UserDto } from "../users/dto/user.dto";
import { Pagination } from "../util/pagination/pagination.decorator";
import { Pageable } from "../util/pagination/pagination.pageable";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { ReservationDto } from "./dto/reservation.dto";
import { Reservation } from "./entities/reservation.entity";
import { ReservationsGateway } from "./reservations.gateway";
import { ReservationsService } from "./reservations.service";

@ApiTags("reservations")
@Controller("api/reservations")
export class ReservationsController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly reservationsService: ReservationsService,
    private readonly reservationsGateway: ReservationsGateway,
    private readonly abilityService: AbilityService
  ) {}

  @Get()
  async findAll(
    @Query("minStartDate") minStartDate: Date,
    @Query("maxStartDate") maxStartDate: Date,
    @Query("customer") customer: number,
    @Pagination() pageable: Pageable,
    @Auth() auth: UserDto
  ) {
    const [reservations, total] =
      minStartDate && maxStartDate
        ? customer
          ? await this.reservationsService.findByDatesAndCustomer(
              minStartDate,
              maxStartDate,
              customer,
              pageable
            )
          : await this.reservationsService.findByDates(
              minStartDate,
              maxStartDate,
              pageable
            )
        : await this.reservationsService.findAll(pageable);
    if (
      reservations.some(
        (reservation) =>
          !this.abilityService.authorize(auth, AbilityAction.Read, reservation)
      )
    )
      throw new ForbiddenException();
    return {
      content: this.mapper.mapArray(reservations, Reservation, ReservationDto),
      total: Math.ceil(total / pageable.size),
      pageable,
    };
  }

  @Get(":id")
  async findById(@Param("id") id: number, @Auth() auth: UserDto) {
    const reservation = await this.reservationsService.findById(id);
    if (!reservation)
      throw new NotFoundException(`Reservation with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Read, reservation))
      throw new ForbiddenException();
    return this.mapper.map(reservation, Reservation, ReservationDto);
  }

  @Post()
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Auth() auth: UserDto
  ) {
    if (
      !this.abilityService.authorize(
        auth,
        AbilityAction.Create,
        createReservationDto
      )
    )
      throw new ForbiddenException();
    await this.reservationsService.create(createReservationDto);
    this.reservationsGateway.notifyManagers();
  }
}
