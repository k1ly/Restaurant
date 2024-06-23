import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserDto } from "../users/dto/user.dto";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { TokenService } from "./token/token.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    if (!token || type !== "Bearer") {
      request.user = await this.authService.createGuest();
      return true;
    }
    const payload = this.tokenService.validateToken(token, "access");
    await this.tokenService.verifyToken(payload, "access");
    const user = await this.usersService.findById(payload.id);
    if (!user) throw new UnauthorizedException("Invalid token!");
    request.user = this.mapper.map(user, User, UserDto);
    return true;
  }
}
