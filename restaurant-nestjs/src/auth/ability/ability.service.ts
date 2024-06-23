import {
  AbilityBuilder,
  AbilityTuple,
  ExtractSubjectType,
  InferSubjects,
  MatchConditions,
  PureAbility,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Address } from "../../addresses/entities/address.entity";
import { CartDto } from "../../cart/dto/cart.dto";
import { Category } from "../../categories/entities/category.entity";
import { Dish } from "../../dishes/entities/dish.entity";
import { CreateOrderItemDto } from "../../order-items/dto/create-order-item.dto";
import { OrderItem } from "../../order-items/entities/order-item.entity";
import { Order } from "../../orders/entities/order.entity";
import { CreateReservationDto } from "../../reservations/dto/create-reservation.dto";
import { Reservation } from "../../reservations/entities/reservation.entity";
import { CreateReviewDto } from "../../reviews/dto/create-review.dto";
import { Review } from "../../reviews/entities/review.entity";
import { Role } from "../../roles/entities/role.entity";
import { RoleName } from "../../roles/roles.names";
import { Status } from "../../statuses/entities/status.entity";
import { Table } from "../../tables/entities/table.entity";
import { UserDto } from "../../users/dto/user.dto";
import { User } from "../../users/entities/user.entity";
import { AbilityAction } from "./ability.action";

type Subject =
  | InferSubjects<
      | typeof User
      | typeof Role
      | typeof Address
      | typeof Dish
      | typeof Category
      | typeof Order
      | typeof Status
      | typeof OrderItem
      | typeof CreateOrderItemDto
      | typeof CartDto
      | typeof Review
      | typeof CreateReviewDto
      | typeof Table
      | typeof Reservation
      | typeof CreateReservationDto,
      true
    >
  | "all";

type AppAbility = PureAbility<AbilityTuple, MatchConditions>;
const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

@Injectable()
export class AbilityService {
  authorize(auth: UserDto, action: AbilityAction, subject: Subject): boolean {
    const { can, build } = new AbilityBuilder<AppAbility>(PureAbility);
    switch (auth.role) {
      case RoleName.Admin:
        can(AbilityAction.Read, User);
        can(AbilityAction.Create, User, ({ id }) => id === auth.id);
        can(AbilityAction.Update, User);
        can(AbilityAction.Read, Role);
        can(AbilityAction.Read, Address);
        can(AbilityAction.Manage, Dish);
        can(AbilityAction.Manage, Category);
        can(AbilityAction.Read, Order);
        can(AbilityAction.Read, Status);
        can(AbilityAction.Read, OrderItem);
        can(
          AbilityAction.Create,
          CreateOrderItemDto,
          ({ order }) => order === auth.order
        );
        can(
          AbilityAction.Update,
          OrderItem,
          ({ order }) => order.id === auth.order
        );
        can(
          AbilityAction.Delete,
          OrderItem,
          ({ order }) => order.id === auth.order
        );
        can(AbilityAction.Read, Review);
        can(
          AbilityAction.Create,
          CreateReviewDto,
          ({ user }) => user === auth.id
        );
        can(AbilityAction.Delete, Review);
        can(AbilityAction.Manage, Table);
        can(AbilityAction.Read, Reservation);
        can(
          AbilityAction.Create,
          CreateReservationDto,
          ({ customer }) => customer === auth.id
        );
        break;
      case RoleName.Manager:
        can(AbilityAction.Read, User);
        can(AbilityAction.Create, User, ({ id }) => id === auth.id);
        can(AbilityAction.Read, Role);
        can(AbilityAction.Read, Address);
        can(AbilityAction.Create, Address, ({ user }) => user.id === auth.id);
        can(AbilityAction.Read, Dish);
        can(AbilityAction.Read, Category);
        can(AbilityAction.Read, Order);
        can(AbilityAction.Update, Order);
        can(
          AbilityAction.Create,
          Order,
          ({ customer }) => customer.id === auth.id
        );
        can(
          AbilityAction.Delete,
          Order,
          ({ customer }) => customer.id === auth.id
        );
        can(AbilityAction.Read, Status);
        can(AbilityAction.Read, OrderItem);
        can(
          AbilityAction.Update,
          OrderItem,
          ({ order }) => order.id === auth.order
        );
        can(
          AbilityAction.Create,
          CreateOrderItemDto,
          ({ order }) => order === auth.order
        );
        can(
          AbilityAction.Delete,
          OrderItem,
          ({ order }) => order.id === auth.order
        );
        can(AbilityAction.Read, Review);
        can(
          AbilityAction.Create,
          CreateReviewDto,
          ({ user }) => user === auth.id
        );
        can(AbilityAction.Read, Table);
        can(AbilityAction.Read, Reservation);
        can(
          AbilityAction.Create,
          CreateReservationDto,
          ({ customer }) => customer === auth.id
        );
        break;
      case RoleName.Client:
        can(AbilityAction.Read, User);
        can(AbilityAction.Create, User, ({ id }) => id === auth.id);
        can(AbilityAction.Read, Role);
        can(AbilityAction.Read, Address);
        can(AbilityAction.Create, Address, ({ user }) => user.id === auth.id);
        can(AbilityAction.Read, Dish);
        can(AbilityAction.Read, Category);
        can(
          AbilityAction.Read,
          Order,
          ({ customer }) => customer.id === auth.id
        );
        can(
          AbilityAction.Create,
          Order,
          ({ customer }) => customer.id === auth.id
        );
        can(
          AbilityAction.Delete,
          Order,
          ({ customer }) => customer.id === auth.id
        );
        can(AbilityAction.Read, Status);
        can(
          AbilityAction.Read,
          OrderItem,
          ({ order }) => order.id === auth.order
        );
        can(
          AbilityAction.Update,
          OrderItem,
          ({ order }) => order.id === auth.order
        );
        can(
          AbilityAction.Create,
          CreateOrderItemDto,
          ({ order }) => order === auth.order
        );
        can(
          AbilityAction.Delete,
          OrderItem,
          ({ order }) => order.id === auth.order
        );
        can(AbilityAction.Read, Review);
        can(
          AbilityAction.Create,
          CreateReviewDto,
          ({ user }) => user === auth.id
        );
        can(AbilityAction.Read, Table);
        can(AbilityAction.Read, Reservation);
        can(
          AbilityAction.Create,
          CreateReservationDto,
          ({ customer }) => customer === auth.id
        );
        break;
      case RoleName.Guest:
        can(AbilityAction.Read, Role);
        can(AbilityAction.Read, Dish);
        can(AbilityAction.Read, Category);
        can(AbilityAction.Manage, CartDto);
        can(AbilityAction.Read, Status);
        can(AbilityAction.Read, Review);
        can(AbilityAction.Read, Table);
        break;
    }
    const ability = build({
      conditionsMatcher: lambdaMatcher,
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subject>,
    });
    return ability.can(action, subject);
  }
}
