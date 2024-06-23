import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { CartDto } from "../cart/dto/cart.dto";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UserDto } from "../users/dto/user.dto";
import { Cookies } from "../util/cookies/cookies.decorator";
import { Auth } from "./auth.decorator";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { TokenService } from "./token/token.service";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService
  ) {}

  @Post("login")
  async signIn(
    @Body() authDto: AuthDto,
    @Query("remember-me") rememberMe: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const payload = await this.authService.authenticate(authDto);
    if (rememberMe) {
      const refreshToken = this.tokenService.signToken(payload, "refresh");
      await this.tokenService.saveToken(payload, refreshToken, "refresh");
      res.cookie("refresh-token", refreshToken, {
        httpOnly: true,
        secure: true,
        domain: new URL(this.configService.get("FRONTEND_URL")).hostname,
      });
    }
    const accessToken = this.tokenService.signToken(payload, "access");
    await this.tokenService.saveToken(payload, accessToken, "access");
    return accessToken;
  }

  @Post("register")
  async register(
    @Body() createUserDto: CreateUserDto,
    @Cookies({ name: "cart", type: CartDto }) cartDtos: CartDto[],
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.register(createUserDto, cartDtos ?? []);
    res.clearCookie("cart");
  }

  @Post("refresh")
  async refreshToken(@Cookies({ name: "refresh-token" }) refreshToken: string) {
    if (refreshToken) {
      const payload = this.tokenService.validateToken(refreshToken, "refresh");
      await this.tokenService.verifyToken(payload, "refresh");
      await this.tokenService.deleteToken(payload, "refresh");
      return this.tokenService.signToken(payload, "access");
    }
  }

  @Get("user")
  async getUser(@Auth() auth: UserDto) {
    return auth;
  }

  @Post("logout")
  async logout(
    @Cookies({ name: "refresh-token" }) refreshToken: string,
    @Auth() auth: UserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const payload = { id: auth.id };
    if (payload.id) await this.tokenService.deleteToken(payload, "access");
    if (refreshToken) await this.tokenService.deleteToken(payload, "refresh");
    res.clearCookie("refresh-token");
  }
}
