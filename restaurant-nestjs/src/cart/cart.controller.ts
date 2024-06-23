import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AbilityAction } from "../auth/ability/ability.action";
import { AbilityService } from "../auth/ability/ability.service";
import { Auth } from "../auth/auth.decorator";
import { UserDto } from "../users/dto/user.dto";
import { Cookies } from "../util/cookies/cookies.decorator";
import { Pagination } from "../util/pagination/pagination.decorator";
import { Pageable } from "../util/pagination/pagination.pageable";
import { CartService } from "./cart.service";
import { CartDto } from "./dto/cart.dto";
import { CreateCartDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";

@ApiTags("cart")
@Controller("cart")
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly abilityService: AbilityService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  findAll(
    @Pagination() pageable: Pageable,
    @Cookies({ name: "cart", type: CartDto }) cartDtos: CartDto[],
    @Auth() auth: UserDto,
  ) {
    const [cart, total] = this.cartService.findAll(pageable, cartDtos ?? []);
    if (
      cart.some(
        (cartDto) =>
          !this.abilityService.authorize(auth, AbilityAction.Read, cartDto),
      )
    )
      throw new ForbiddenException();
    return {
      content: cart,
      total: Math.ceil(total / pageable.size),
      pageable,
    };
  }

  @Post()
  async create(
    @Body() createCartDto: CreateCartDto,
    @Cookies({ name: "cart", type: CartDto }) cartDtos: CartDto[],
    @Auth() auth: UserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!this.abilityService.authorize(auth, AbilityAction.Create, CartDto))
      throw new ForbiddenException();
    cartDtos = await this.cartService.create(createCartDto, cartDtos ?? []);
    res.cookie("cart", JSON.stringify(cartDtos), {
      httpOnly: true,
      secure: true,
      domain: new URL(this.configService.get("FRONTEND_URL")).hostname,
    });
  }

  @Put(":dishId")
  updateByDish(
    @Param("dishId") dishId: number,
    @Body() updateCartDto: UpdateCartDto,
    @Cookies({ name: "cart", type: CartDto }) cartDtos: CartDto[],
    @Auth() auth: UserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cartDto = this.cartService.findByDish(dishId, cartDtos);
    if (!cartDto)
      throw new NotFoundException(
        `Cart dto with dish id "${dishId}" doesn't exist!`,
      );
    if (!this.abilityService.authorize(auth, AbilityAction.Update, cartDto))
      throw new ForbiddenException();
    cartDtos = this.cartService.updateByDish(
      dishId,
      updateCartDto,
      cartDtos ?? [],
    );
    res.cookie("cart", JSON.stringify(cartDtos), {
      httpOnly: true,
      secure: true,
      domain: new URL(this.configService.get("FRONTEND_URL")).hostname,
    });
  }

  @Delete(":dishId")
  removeByDish(
    @Param("dishId") dishId: number,
    @Cookies({ name: "cart", type: CartDto }) cartDtos: CartDto[],
    @Auth() auth: UserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cartDto = this.cartService.findByDish(dishId, cartDtos);
    if (!cartDto)
      throw new NotFoundException(
        `Cart dto with dish id "${dishId}" doesn't exist!`,
      );
    if (!this.abilityService.authorize(auth, AbilityAction.Delete, cartDto))
      throw new ForbiddenException();
    cartDtos = this.cartService.removeByDish(dishId, cartDtos ?? []);
    res.cookie("cart", JSON.stringify(cartDtos), {
      httpOnly: true,
      secure: true,
      domain: new URL(this.configService.get("FRONTEND_URL")).hostname,
    });
  }
}
