import { AutoMap } from "@automapper/classes";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Dish } from "../../dishes/entities/dish.entity";

@Entity("categories")
export class Category {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column({ type: "varchar", name: "name" })
  name: string;

  @OneToMany(() => Dish, (dish) => dish.category)
  dishes: Dish[];
}
