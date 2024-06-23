import { AutoMap } from "@automapper/classes";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("reviews")
export class Review {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column({ type: "smallint", name: "grade" })
  grade: number;

  @AutoMap()
  @Column({ type: "text", name: "comment" })
  comment: string;

  @AutoMap()
  @Column({ type: "timestamp with time zone", name: "date" })
  date: Date;

  @AutoMap()
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;
}
