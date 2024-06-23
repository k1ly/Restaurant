import { AutoMap } from "@automapper/classes";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("addresses")
export class Address {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column({ type: "varchar", name: "country" })
  country: string;

  @AutoMap()
  @Column({ type: "varchar", name: "locality" })
  locality: string;

  @AutoMap()
  @Column({ type: "varchar", name: "street" })
  street: string;

  @AutoMap()
  @Column({ type: "varchar", name: "house" })
  house: string;

  @AutoMap()
  @Column({ type: "varchar", name: "apartment" })
  apartment: string;

  @AutoMap()
  @ManyToOne(() => User, (user) => user.addresses)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;
}
