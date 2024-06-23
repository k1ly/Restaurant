import { CreateCartDto } from "@/common/dto/cart/create-cart.dto";
import { CategoryDto } from "@/common/dto/categories/category.dto";
import { DishDto } from "@/common/dto/dishes/dish.dto";
import { CreateOrderItemDto } from "@/common/dto/order-items/create-order-item.dto";
import { RoleName } from "@/common/dto/roles/role.name";
import { UserDto } from "@/common/dto/users/user.dto";
import api from "@/common/util/api";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { DishInfoComponent } from "@/components/menu/dish-info.component";
import {
    Pageable,
    PageableData,
    PaginationComponent,
    SortOrder,
} from "@/components/page/pagination.component";
import { SearchComponent } from "@/components/page/search.component";
import { SpinnerComponent } from "@/components/page/spinner.component";
import { DishSort, Sort } from "@/pages/menu";
import styles from "@/styles/menu.module.sass";
import { useRouter } from "next/navigation";
import queryString from "query-string";
import { ChangeEvent, useEffect, useState } from "react";
import { Form, Toast } from "react-bootstrap";

export interface DishListComponentProps {
    setError: ErrorHandler;
    auth: UserDto;
    category?: CategoryDto;
    filter?: string;
    page: number;
    size: number;
    sort: Sort;
}

export function DishListComponent({
    setError,
    auth,
    category,
    filter,
    page,
    size,
    sort,
}: DishListComponentProps) {
    const [dishes, setDishes] = useState<DishDto[]>();
    const [total, setTotal] = useState<number>();
    const [pageable, setPageable] = useState<Pageable>({});
    const [search, setSearch] = useState("");
    const [notification, setNotification] = useState<string>();
    const router = useRouter();
    const loadDishes = async () => {
        try {
            const dishesData: PageableData<DishDto> = await api.get(
                "/api/dishes",
                {
                    params: {
                        category: category?.id,
                        filter,
                        page,
                        size,
                        sort,
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
    const addOrderItem = async (
        orderItemDto: CreateOrderItemDto | CreateCartDto
    ) => {
        try {
            await api.post(
                [RoleName.Client, RoleName.Manager, RoleName.Admin].includes(
                    auth.role
                )
                    ? "/api/order-items"
                    : "/cart",
                orderItemDto
            );
            setNotification("Добавлено в корзину!");
        } catch (error: any) {
            setError(error);
        }
    };
    const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const [dishSort, order] = sort?.split(",") ?? [];
        router.push(
            `?${queryString.stringify({
                category: category?.id,
                filter,
                size,
                sort: `${e.target.value},${
                    order === SortOrder.Desc ? SortOrder.Desc : SortOrder.Asc
                }`,
            })}`
        );
    };
    const handleOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const [dishSort, order] = sort?.split(",") ?? [];
        router.push(
            `?${queryString.stringify({
                category: category?.id,
                filter,
                size,
                sort: `${dishSort === "" ? DishSort.Name : dishSort},${
                    e.target.value
                }`,
            })}`
        );
    };
    useEffect(() => {
        setSearch(filter ?? "");
        if (category || filter) loadDishes();
    }, [category, filter, page, size, sort]);
    return (
        <div className={"d-flex flex-column flex-fill"}>
            <Toast
                show={!!notification}
                delay={5000}
                autohide={true}
                className={styles["notification"]}
                onClose={() => setNotification(null)}
            >
                <Toast.Header className={"justify-content-center"}>
                    <div className={"fs-5"}>Корзина</div>
                </Toast.Header>
                <Toast.Body>{notification}</Toast.Body>
            </Toast>
            {category && (
                <div
                    className={
                        "mt-3 border-3 border-bottom text-center text-white fs-2"
                    }
                >
                    {category.name}
                </div>
            )}
            <div className={styles["dish-list-wrap"]}>
                <SearchComponent
                    search={search}
                    setSearch={setSearch}
                    submit={() =>
                        router.push(
                            `?${queryString.stringify({
                                filter: search !== "" ? search : undefined,
                                size,
                                sort,
                            })}`
                        )
                    }
                />
                {category || filter ? (
                    dishes ? (
                        total > 0 ? (
                            <>
                                <PaginationComponent
                                    total={total}
                                    pageable={pageable}
                                    setPage={(page) => {
                                        router.push(
                                            `?${queryString.stringify({
                                                category: category?.id,
                                                filter: search !== "" ? search : undefined,
                                                page,
                                                size,
                                                sort,
                                            })}`
                                        );
                                    }}
                                />
                                <div className={"d-flex justify-content-end"}>
                                    <div className={"d-flex"}>
                                        <Form.Group className={"d-flex me-4"}>
                                            <Form.Label
                                                htmlFor={"sort"}
                                                className={
                                                    "me-3 text-end text-nowrap text-white lh-lg"
                                                }
                                            >
                                                Сортировать по
                                            </Form.Label>
                                            <Form.Select
                                                name={"sort"}
                                                value={pageable.sort}
                                                onChange={handleSortChange}
                                                id={"sort"}
                                            >
                                                <option value={null}>
                                                    ...
                                                </option>
                                                <option value={DishSort.Name}>
                                                    Имя
                                                </option>
                                                <option value={DishSort.Price}>
                                                    Цена
                                                </option>
                                                <option
                                                    value={DishSort.Discount}
                                                >
                                                    Скидка
                                                </option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className={"d-flex me-4"}>
                                            <Form.Select
                                                name={"order"}
                                                value={pageable.order}
                                                onChange={handleOrderChange}
                                                id={"order"}
                                            >
                                                <option
                                                    value={null}
                                                    disabled={true}
                                                >
                                                    ...
                                                </option>
                                                <option value={SortOrder.Asc}>
                                                    по возрастанию
                                                </option>
                                                <option value={SortOrder.Desc}>
                                                    по убыванию
                                                </option>
                                            </Form.Select>
                                        </Form.Group>
                                    </div>
                                </div>
                                <div
                                    className={
                                        "d-flex flex-column flex-fill mt-2"
                                    }
                                >
                                    {dishes.map((dish) => (
                                        <DishInfoComponent
                                            key={dish.id}
                                            dish={dish}
                                            addOrderItem={() =>
                                                addOrderItem(
                                                    [
                                                        RoleName.Client,
                                                        RoleName.Manager,
                                                        RoleName.Admin,
                                                    ].includes(auth.role)
                                                        ? {
                                                              quantity: 1,
                                                              dish: dish.id,
                                                              order: auth.order,
                                                          }
                                                        : {
                                                              quantity: 1,
                                                              dish: dish.id,
                                                          }
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            </>
                        ) : category ? (
                            <div
                                className={
                                    "d-flex justify-content-center align-items-center flex-fill"
                                }
                            >
                                <div className={"text-center text-white fs-4"}>
                                    Категория `{category.name}` пока пуста
                                </div>
                            </div>
                        ) : (
                            filter && (
                                <div
                                    className={
                                        "d-flex justify-content-center align-items-center flex-fill"
                                    }
                                >
                                    <div className={"text-white fs-4"}>
                                        По запросу `{filter}` ничего найдено
                                    </div>
                                </div>
                            )
                        )
                    ) : (
                        <SpinnerComponent variant={"light"} size={"lg"} />
                    )
                ) : (
                    <div
                        className={
                            "d-flex justify-content-center align-items-center flex-fill"
                        }
                    >
                        <div className={"text-center text-white fs-4"}>
                            Для того чтобы просмотреть меню выберите категорию
                            или введите запрос
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
