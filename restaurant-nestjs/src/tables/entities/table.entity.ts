import { AutoMap } from "@automapper/classes";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tables")
export class Table {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column({ type: "smallint", name: "places" })
  places: number;

  @AutoMap()
  @Column({ type: "float", name: "price" })
  price: number;

  @AutoMap()
  @Column({ type: "float", name: "position_x" })
  positionX: number;

  @AutoMap()
  @Column({ type: "float", name: "position_y" })
  positionY: number;

  @AutoMap()
  @Column({ type: "float", name: "rotation" })
  rotation: number;

  @AutoMap()
  @Column({ type: "float", name: "scale_x" })
  scaleX: number;

  @AutoMap()
  @Column({ type: "float", name: "scale_y" })
  scaleY: number;
}
