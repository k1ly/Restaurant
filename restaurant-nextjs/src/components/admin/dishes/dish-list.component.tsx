import { CreateDishDto } from "@/common/dto/dishes/create-dish.dto";
import { DishDto } from "@/common/dto/dishes/dish.dto";
import api from "@/common/util/api";
import { DishFormComponent } from "@/components/admin/dishes/dish-form.component";
import { DishInfoComponent } from "@/components/admin/dishes/dish-info.component";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import {
    Pageable,
    PageableData,
    PaginationComponent,
    SortOrder,
} from "@/components/page/pagination.component";
import { SearchComponent } from "@/components/page/search.component";
import { SpinnerComponent } from "@/components/page/spinner.component";
import styles from "@/styles/admin.module.sass";
import { useEffect, useState } from "react";
import { Table, Toast } from "react-bootstrap";

export enum DishSort {
    Id = "id",
    Name = "name",
    Description = "description",
    Weight = "weight",
    Price = "price",
    Discount = "discount",
    Category = "category.id",
}

export type FormDishDto = Partial<DishDto> & CreateDishDto;

export const defaultDishDto: FormDishDto = {
    name: "",
    description: "",
    weight: 1,
    price: 0,
    discount: 0,
    category: 0,
};

export interface DishListComponentProps {
    setError: ErrorHandler;
}

export function DishListComponent({ setError }: DishListComponentProps) {
    const [dishes, setDishes] = useState<DishDto[]>();
    const [total, setTotal] = useState<number>();
    const [pageable, setPageable] = useState<Pageable>({ size: 10 });
    const [dish, setDish] = useState<FormDishDto>();
    const [search, setSearch] = useState("");
    const [notification, setNotification] = useState<string>();
    const loadDishes = async () => {
        try {
            const dishesData: PageableData<DishDto> = await api.get(
                "/api/dishes",
                {
                    params: {
                        filter: search !== "" ? search : undefined,
                        page: pageable.page,
                        size: pageable.size,
                        sort:
                            pageable.sort && pageable.order
                                ? `${pageable.sort},${pageable.order}`
                                : undefined,
                    },
                }
            );
            setDishes(dishesData.content);
            setTotal(dishesData.total);
            setPageable(dishesData.pageable);
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
        loadDishes();
    };
    const uploadImage = async (image: File) => {
        const formData = new FormData();
        formData.append("image", image);
        return await api.upload<string>("/api/dishes/upload", formData);
    };
    const addDish = async (dishDto: CreateDishDto, image?: File) => {
        dishDto.imageUrl = image ? await uploadImage(image) : null;
        await api.post("/api/dishes", dishDto);
        setDish(null);
        setNotification("Блюдо успешно добавлено!");
        loadDishes();
    };
    const updateDish = async (
        id: number,
        dishDto: CreateDishDto,
        image?: File
    ) => {
        dishDto.imageUrl = image ? await uploadImage(image) : null;
        await api.put(`/api/dishes/${id}`, dishDto);
        setDish(null);
        setNotification("Блюдо успешно изменено!");
        loadDishes();
    };
    const deleteDish = async (id: number) => {
        try {
            await api.delete(`/api/dishes/${id}`);
            setDish(null);
            setNotification("Блюдо успешно удалено!");
            loadDishes();
        } catch (error: any) {
            setError(error);
        }
    };
    useEffect(() => {
        loadDishes();
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
                    <div className={"fs-5"}>Администратор: блюда</div>
                </Toast.Header>
                <Toast.Body>{notification}</Toast.Body>
            </Toast>
            <DishFormComponent
                setError={setError}
                dish={dish}
                addDish={(dishDto: CreateDishDto, image?: File) =>
                    addDish(dishDto, image)
                }
                updateDish={(dishDto: CreateDishDto, image?: File) =>
                    updateDish(dish?.id, dishDto, image)
                }
                onClose={() => setDish(null)}
            />
            <div className={"p-4"}>
                <Button
                    variant={"success"}
                    className={"px-2 w-100 fs-4"}
                    onClick={() => setDish(defaultDishDto)}
                >
                    Добавить блюдо
                </Button>
            </div>
            <SearchComponent
                search={search}
                setSearch={setSearch}
                submit={() => {
                    pageable.page = 0;
                    loadDishes();
                }}
            />
            {dishes ? (
                total > 0 ? (
                    <>
                        <PaginationComponent
                            total={total}
                            pageable={pageable}
                            setPage={(page) => {
                                pageable.page = page;
                                loadDishes();
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
                                                handleSort(DishSort.Id)
                                            }
                                        >
                                            ID
                                            {pageable.sort === DishSort.Id
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
                                                handleSort(DishSort.Name)
                                            }
                                        >
                                            Название
                                            {pageable.sort === DishSort.Name
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
                                                handleSort(DishSort.Description)
                                            }
                                        >
                                            Описание
                                            {pageable.sort ===
                                            DishSort.Description
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
                                                handleSort(DishSort.Weight)
                                            }
                                        >
                                            Вес
                                            {pageable.sort === DishSort.Weight
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
                                                handleSort(DishSort.Price)
                                            }
                                        >
                                            Цена
                                            {pageable.sort === DishSort.Price
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
                                                handleSort(DishSort.Discount)
                                            }
                                        >
                                            Скидка
                                            {pageable.sort === DishSort.Discount
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
                                                handleSort(DishSort.Category)
                                            }
                                        >
                                            Категория
                                            {pageable.sort === DishSort.Category
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
                                    {dishes.map((dish) => (
                                        <DishInfoComponent
                                            key={dish.id}
                                            setError={setError}
                                            dish={dish}
                                            updateDish={() => setDish(dish)}
                                            deleteDish={() =>
                                                deleteDish(dish.id)
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
                        <div className={"fs-3"}>Список блюд пуст</div>
                    </div>
                )
            ) : (
                <SpinnerComponent size={"lg"} />
            )}
        </div>
    );
}
