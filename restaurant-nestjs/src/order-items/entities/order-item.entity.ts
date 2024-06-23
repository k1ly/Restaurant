import { AutoMap } from "@automapper/classes";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Dish } from "../../dishes/entities/dish.entity";
import { Order } from "../../orders/entities/order.entity";

@Entity("order_items")
export class OrderItem {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column({ type: "smallint", name: "quantity" })
  quantity: number;

  @AutoMap()
  @ManyToOne(() => Dish)
  @JoinColumn({ name: "dish_id", referencedColumnName: "id" })
  dish: Dish;

  @AutoMap()
  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: "order_id", referencedColumnName: "id" })
  order: Order;
}
