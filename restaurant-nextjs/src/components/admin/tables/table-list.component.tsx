import { CreateTableDto } from "@/common/dto/tables/create-table.dto";
import { TableDto } from "@/common/dto/tables/table.dto";
import api from "@/common/util/api";
import { TableFormComponent } from "@/components/admin/tables/table-form.component";
import { TableInfoComponent } from "@/components/admin/tables/table-info.component";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import {
    Pageable,
    PageableData,
    PaginationComponent,
    SortOrder,
} from "@/components/page/pagination.component";
import { SpinnerComponent } from "@/components/page/spinner.component";
import styles from "@/styles/admin.module.sass";
import { useEffect, useState } from "react";
import { Table, Toast } from "react-bootstrap";

export enum TableSort {
    Id = "id",
    Places = "places",
    Price = "price",
    PositionX = "positionX",
    PositionY = "positionY",
    Rotation = "rotation",
    ScaleX = "scaleX",
    ScaleY = "scaleY",
}

export type FormTableDto = Partial<TableDto> & CreateTableDto;

export const defaultTableDto: FormTableDto = {
    places: 1,
    price: 0,
    positionX: 0,
    positionY: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
};

export interface TableListComponentProps {
    setError: ErrorHandler;
}

export function TableListComponent({ setError }: TableListComponentProps) {
    const [tables, setTables] = useState<TableDto[]>();
    const [total, setTotal] = useState<number>();
    const [pageable, setPageable] = useState<Pageable>({ size: 10 });
    const [table, setTable] = useState<FormTableDto>();
    const [notification, setNotification] = useState<string>();
    const loadTables = async () => {
        try {
            const tablesData: PageableData<TableDto> = await api.get(
                "/api/tables",
                {
                    params: {
                        page: pageable.page,
                        size: pageable.size,
                        sort:
                            pageable.sort && pageable.order
                                ? `${pageable.sort},${pageable.order}`
                                : undefined,
                    },
                }
            );
            setTables(tablesData.content);
            setTotal(tablesData.total);
            setPageable(tablesData.pageable);
        } catch (error: any) {
            setError(error);
        }
    };
    const handleSort = (sort: string) => {
        pageable.sort = sort;
        pageable.order =
            pageable.sort !== sort || pageable.order !== SortOrder.Asc
                ? SortOrder.Asc
                : SortOrder.Desc;
        loadTables();
    };
    const addTable = async (tableDto: CreateTableDto) => {
        await api.post("/api/tables", tableDto);
        setTable(null);
        setNotification("Столик успешно добавлен!");
        loadTables();
    };
    const updateTable = async (id: number, tableDto: CreateTableDto) => {
        await api.put(`/api/tables/${id}`, tableDto);
        setTable(null);
        setNotification("Столик успешно изменен!");
        loadTables();
    };
    const deleteTable = async (id: number) => {
        try {
            await api.delete(`/api/tables/${id}`);
            setNotification("Столик успешно удален!");
            loadTables();
        } catch (error: any) {
            setError(error);
        }
    };
    useEffect(() => {
        loadTables();
    }, []);
    return (
        <div className={"d-flex flex-column flex-fill mx-4"}>
            <Toast
                show={!!notification}
                delay={5000}
                autohide={true}
                className={styles["notification"]}
                onClose={() => setNotification(null)}
            >
                <Toast.Header className={"justify-content-center"}>
                    <div className={"fs-5"}>Администратор: столики</div>
                </Toast.Header>
                <Toast.Body>{notification}</Toast.Body>
            </Toast>
            <TableFormComponent
                setError={setError}
                tables={tables?.filter((t) => t !== table)}
                table={table}
                addTable={(tableDto) => addTable(tableDto)}
                updateTable={(tableDto) => updateTable(table?.id, tableDto)}
                onClose={() => setTable(null)}
            />
            <div className={"p-4"}>
                <Button
                    variant={"success"}
                    className={"px-2 w-100 fs-4"}
                    onClick={() => setTable(defaultTableDto)}
                >
                    Добавить столик
                </Button>
            </div>
            {tables ? (
                total > 0 ? (
                    <>
                        <PaginationComponent
                            total={total}
                            pageable={pageable}
                            setPage={(page) => {
                                pageable.page = page;
                                loadTables();
                            }}
                        />
                        <div className={"d-flex flex-column flex-fill"}>
                            <Table bordered={true} striped={true} hover={true}>
                                <thead className={"table-light fw-bold"}>
                                    <tr>
                                        <th
                                            scope={"col"}
                                            className={styles["pointer"]}
                                            onClick={() =>
                                                handleSort(TableSort.Id)
                                            }
                                        >
                                            ID
                                            {pageable.sort === TableSort.Id
                                                ? pageable.order ===
                                                  SortOrder.Asc
                                                    ? " ▲"
                                                    : " ▼"
                                                : ""}
                                        </th>
                                        <th
                                            scope={"col"}
                                            className={styles["pointer"]}
                                            onClick={() =>
                                                handleSort(TableSort.Places)
                                            }
                                        >
                                            Мест
                                            {pageable.sort === TableSort.Places
                                                ? pageable.order ===
                                                  SortOrder.Asc
                                                    ? " ▲"
                                                    : " ▼"
                                                : ""}
                                        </th>
                                        <th
                                            scope={"col"}
                                            className={styles["pointer"]}
                                            onClick={() =>
                                                handleSort(TableSort.Price)
                                            }
                                        >
                                            Стоимость
                                            {pageable.sort === TableSort.Price
                                                ? pageable.order ===
                                                  SortOrder.Asc
                                                    ? " ▲"
                                                    : " ▼"
                                                : ""}
                                        </th>
                                        <th
                                            scope={"col"}
                                            className={styles["pointer"]}
                                            onClick={() =>
                                                handleSort(TableSort.PositionX)
                                            }
                                        >
                                            Позиция X
                                            {pageable.sort ===
                                            TableSort.PositionX
                                                ? pageable.order ===
                                                  SortOrder.Asc
                                                    ? " ▲"
                                                    : " ▼"
                                                : ""}
                                        </th>
                                        <th
                                            scope={"col"}
                                            className={styles["pointer"]}
                                            onClick={() =>
                                                handleSort(TableSort.PositionY)
                                            }
                                        >
                                            Позиция Y
                                            {pageable.sort ===
                                            TableSort.PositionY
                                                ? pageable.order ===
                                                  SortOrder.Asc
                                                    ? " ▲"
                                                    : " ▼"
                                                : ""}
                                        </th>
                                        <th
                                            scope={"col"}
                                            className={styles["pointer"]}
                                            onClick={() =>
                                                handleSort(TableSort.Rotation)
                                            }
                                        >
                                            Угол поворота
                                            {pageable.sort ===
                                            TableSort.Rotation
                                                ? pageable.order ===
                                                  SortOrder.Asc
                                                    ? " ▲"
                                                    : " ▼"
                                                : ""}
                                        </th>
                                        <th
                                            scope={"col"}
                                            className={styles["pointer"]}
                                            onClick={() =>
                                                handleSort(TableSort.ScaleX)
                                            }
                                        >
                                            Масштаб X
                                            {pageable.sort === TableSort.ScaleX
                                                ? pageable.order ===
                                                  SortOrder.Asc
                                                    ? " ▲"
                                                    : " ▼"
                                                : ""}
                                        </th>
                                        <th
                                            scope={"col"}
                                            className={styles["pointer"]}
                                            onClick={() =>
                                                handleSort(TableSort.ScaleY)
                                            }
                                        >
                                            Масштаб Y
                                            {pageable.sort === TableSort.ScaleY
                                                ? pageable.order ===
                                                  SortOrder.Asc
                                                    ? " ▲"
                                                    : " ▼"
                                                : ""}
                                        </th>
                                        <th scope={"col"}></th>
                                    </tr>
                                </thead>
                                <tbody className={"table-group-divider"}>
                                    {tables.map((table) => (
                                        <TableInfoComponent
                                            key={table.id}
                                            table={table}
                                            updateTable={() => setTable(table)}
                                            deleteTable={() =>
                                                deleteTable(table.id)
                                            }
                                        />
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </>
                ) : (
                    <div
                        className={
                            "d-flex justify-content-center align-items-center flex-fill"
                        }
                    >
                        <div className={"fs-3"}>Список столиков пуст</div>
                    </div>
                )
            ) : (
                <SpinnerComponent size={"lg"} />
            )}
        </div>
    );
}
