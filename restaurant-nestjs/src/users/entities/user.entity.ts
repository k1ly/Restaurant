import { AutoMap } from "@automapper/classes";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Address } from "../../addresses/entities/address.entity";
import { Order } from "../../orders/entities/order.entity";
import { Reservation } from "../../reservations/entities/reservation.entity";
import { Role } from "../../roles/entities/role.entity";

@Entity("users")
export class User {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column({ type: "varchar", name: "login" })
  login: string;

  @AutoMap()
  @Column({ type: "varchar", name: "password" })
  password: string;

  @AutoMap()
  @Column({ type: "varchar", name: "name" })
  name: string;

  @AutoMap()
  @Column({ type: "varchar", name: "email" })
  email: string;

  @AutoMap()
  @Column({ type: "varchar", name: "phone" })
  phone: string;

  @AutoMap()
  @Column({ type: "boolean", name: "blocked" })
  blocked: boolean;

  @AutoMap()
  @ManyToOne(() => Role)
  @JoinColumn({ name: "role_id", referencedColumnName: "id" })
  role: Role;

  @AutoMap()
  @ManyToOne(() => Order)
  @JoinColumn({ name: "order_id", referencedColumnName: "id" })
  order: Order;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @OneToMany(() => Reservation, (reservation) => reservation.customer)
  reservations: Reservation[];
}
