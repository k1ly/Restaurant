import { TableDto } from "@/common/dto/tables/table.dto";
import { Button } from "@/components/page/button.component";

export interface TableInfoComponentProps {
    table: TableDto;
    updateTable: () => void;
    deleteTable: () => void;
}

export function TableInfoComponent({
    table,
    updateTable,
    deleteTable,
}: TableInfoComponentProps) {
    return (
        <tr>
            <td className={"fw-semibold"}>{table.id}</td>
            <td>{table.places}</td>
            <td>{table.price} руб.</td>
            <td>{table.positionX}</td>
            <td>{table.positionY}</td>
            <td>{table.rotation}</td>
            <td>{table.scaleX}</td>
            <td>{table.scaleY}</td>
            <td>
                <div>
                    <div className={"d-flex justify-content-around float-end"}>
                        <Button
                            variant={"outline-primary"}
                            className={"mx-2"}
                            onClick={updateTable}
                        >
                            Изменить
                        </Button>
                        <Button
                            variant={"outline-danger"}
                            className={"mx-2"}
                            onClick={deleteTable}
                        >
                            Удалить
                        </Button>
                    </div>
                </div>
            </td>
        </tr>
    );
}
