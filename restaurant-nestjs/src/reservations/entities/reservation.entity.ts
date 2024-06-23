import { AutoMap } from "@automapper/classes";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Table } from "../../tables/entities/table.entity";
import { User } from "../../users/entities/user.entity";

@Entity("reservations")
export class Reservation {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column({ type: "float", name: "price" })
  price: number;

  @AutoMap()
  @Column({ type: "timestamp with time zone", name: "start_date" })
  startDate: Date;

  @AutoMap()
  @Column({ type: "timestamp with time zone", name: "end_date" })
  endDate: Date;

  @AutoMap()
  @Column({ type: "timestamp with time zone", name: "date" })
  date: Date;

  @AutoMap()
  @ManyToOne(() => Table)
  @JoinColumn({ name: "table_id", referencedColumnName: "id" })
  table: Table;

  @AutoMap()
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: "customer_id", referencedColumnName: "id" })
  customer: User;
}
