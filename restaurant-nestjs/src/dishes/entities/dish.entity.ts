import { AutoMap } from "@automapper/classes";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "../../categories/entities/category.entity";

@Entity("dishes")
export class Dish {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column({ type: "varchar", name: "name" })
  name: string;

  @AutoMap()
  @Column({ type: "varchar", name: "description" })
  description: string;

  @AutoMap()
  @Column({ type: "varchar", name: "image_url" })
  imageUrl: string;

  @AutoMap()
  @Column({ type: "smallint", name: "weight" })
  weight: number;

  @AutoMap()
  @Column({ type: "float", name: "price" })
  price: number;

  @AutoMap()
  @Column({ type: "smallint", name: "discount" })
  discount: number;

  @AutoMap()
  @ManyToOne(() => Category, (category) => category.dishes)
  @JoinColumn({ name: "category_id", referencedColumnName: "id" })
  category: Category;
}
