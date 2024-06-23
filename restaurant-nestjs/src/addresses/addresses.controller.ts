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
import { AddressesService } from "./addresses.service";
import { AddressDto } from "./dto/address.dto";
import { CreateAddressDto } from "./dto/create-address.dto";
import { Address } from "./entities/address.entity";

@ApiTags("addresses")
@Controller("api/addresses")
export class AddressesController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly addressesService: AddressesService,
    private readonly abilityService: AbilityService
  ) {}

  @Get()
  async findByUser(
    @Query("user") user: number,
    @Pagination() pageable: Pageable,
    @Auth() auth: UserDto
  ) {
    const [addresses, total] = await this.addressesService.findByUser(
      user,
      pageable
    );
    if (
      addresses.some(
        (address) =>
          !this.abilityService.authorize(auth, AbilityAction.Read, address)
      )
    )
      throw new ForbiddenException();
    return {
      content: this.mapper.mapArray(addresses, Address, AddressDto),
      total: Math.ceil(total / pageable.size),
      pageable,
    };
  }

  @Get(":id")
  async findById(@Param("id") id: number, @Auth() auth: UserDto) {
    const address = await this.addressesService.findById(id);
    if (!address)
      throw new NotFoundException(`Address with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Read, address))
      throw new ForbiddenException();
    return this.mapper.map(address, Address, AddressDto);
  }

  @Post()
  async create(
    @Body() createAddressDto: CreateAddressDto,
    @Auth() auth: UserDto
  ) {
    if (!this.abilityService.authorize(auth, AbilityAction.Create, Address))
      throw new ForbiddenException();
    await this.addressesService.create(createAddressDto);
  }
}
