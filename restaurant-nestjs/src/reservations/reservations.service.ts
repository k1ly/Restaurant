import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { TablesService } from "../tables/tables.service";
import { UsersService } from "../users/users.service";
import { Pageable } from "../util/pagination/pagination.pageable";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { Reservation } from "./entities/reservation.entity";

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly usersService: UsersService,
    private readonly tablesService: TablesService
  ) {}

  async findAll(pageable: Pageable) {
    try {
      return await this.reservationRepository.findAndCount({
        relations: { table: true, customer: true },
        skip: pageable.page * pageable.size,
        take: pageable.size,
        order: { [pageable.sort]: pageable.order },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByDates(
    minStartDate: Date,
    maxStartDate: Date,
    pageable: Pageable
  ) {
    try {
      return await this.reservationRepository.findAndCount({
        relations: { table: true, customer: true },
        where: {
          startDate: Between(minStartDate, maxStartDate),
        },
        skip: pageable.page * pageable.size,
        take: pageable.size,
        order: { [pageable.sort]: pageable.order },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByDatesAndCustomer(
    minStartDate: Date,
    maxStartDate: Date,
    customerId: number,
    pageable: Pageable
  ) {
    try {
      const customer = await this.usersService.findById(customerId);
      return await this.reservationRepository.findAndCount({
        relations: { table: true, customer: true },
        where: {
          startDate: Between(minStartDate, maxStartDate),
          customer,
        },
        skip: pageable.page * pageable.size,
        take: pageable.size,
        order: { [pageable.sort]: pageable.order },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: number) {
    try {
      return await this.reservationRepository.findOne({
        relations: { table: true, customer: true },
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(createReservationDto: CreateReservationDto) {
    const reservation = this.mapper.map(
      createReservationDto,
      CreateReservationDto,
      Reservation
    );
    reservation.table = await this.tablesService.findById(
      createReservationDto.table
    );
    if (!reservation.table)
      throw new BadRequestException(
        `Table with id "${createReservationDto.table}" doesn't exist!`
      );
    reservation.price = Number(
      (
        reservation.table.price *
        (new Date(reservation.endDate).getHours() -
          new Date(reservation.startDate).getHours())
      ).toFixed(2)
    );
    reservation.customer = await this.usersService.findById(
      createReservationDto.customer
    );
    if (!reservation.customer)
      throw new BadRequestException(
        `User with id "${createReservationDto.customer}" doesn't exist!`
      );
    try {
      return this.reservationRepository.save(reservation);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, createReservationDto: CreateReservationDto) {
    const reservation = this.mapper.map(
      createReservationDto,
      CreateReservationDto,
      Reservation
    );
    reservation.table = await this.tablesService.findById(
      createReservationDto.table
    );
    if (!reservation.table)
      throw new BadRequestException(
        `Table with id "${createReservationDto.table}" doesn't exist!`
      );
    reservation.price = Number(
      (
        reservation.table.price *
        (new Date(reservation.endDate).getHours() -
          new Date(reservation.startDate).getHours())
      ).toFixed(2)
    );
    reservation.customer = await this.usersService.findById(
      createReservationDto.customer
    );
    if (!reservation.customer)
      throw new BadRequestException(
        `User with id "${createReservationDto.customer}" doesn't exist!`
      );
    try {
      return this.reservationRepository.update(id, reservation);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      return await this.reservationRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
