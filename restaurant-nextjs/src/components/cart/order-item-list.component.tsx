import { CartDto } from "@/common/dto/cart/cart.dto";
import { UpdateCartDto } from "@/common/dto/cart/update-cart.dto";
import { OrderItemDto } from "@/common/dto/order-items/order-item.dto";
import { UpdateOrderItemDto } from "@/common/dto/order-items/update-order-item.dto";
import { OrderDto } from "@/common/dto/orders/order.dto";
import { UpdateOrderDto } from "@/common/dto/orders/update-order.dto";
import { RoleName } from "@/common/dto/roles/role.name";
import { UserDto } from "@/common/dto/users/user.dto";
import api from "@/common/util/api";
import { OrderFormComponent } from "@/components/cart/order-form.component";
import { OrderItemFormComponent } from "@/components/cart/order-item-form.component";
import { ErrorHandler } from "@/components/error/error-handler.component";
import {
    Pageable,
    PageableData,
    PaginationComponent,
} from "@/components/page/pagination.component";
import { SpinnerComponent } from "@/components/page/spinner.component";
import styles from "@/styles/cart.module.sass";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Stack, Toast } from "react-bootstrap";
import { Button } from "@/components/page/button.component";

export type FormOrderItemDto = Partial<OrderItemDto> & CartDto;

export interface OrderItemListComponentProps {
    setError: ErrorHandler;
    auth: UserDto;
}

export function OrderItemListComponent({
    setError,
    auth,
}: OrderItemListComponentProps) {
    const [orderItems, setOrderItems] = useState<FormOrderItemDto[]>();
    const [total, setTotal] = useState<number>();
    const [pageable, setPageable] = useState<Pageable>({});
    const [order, setOrder] = useState<OrderDto>();
    const [showOrder, setShowOrder] = useState(false);
    const [alertPrompt, setAlertPrompt] = useState(false);
    const [confirmPrompt, setConfirmPrompt] = useState<string>();
    const router = useRouter();
    const loadOrderItems = async () => {
        try {
            const orderItemsData: PageableData<FormOrderItemDto> =
                await api.get(
                    [
                        RoleName.Client,
                        RoleName.Manager,
                        RoleName.Admin,
                    ].includes(auth.role)
                        ? "/api/order-items"
                        : "/cart",
                    {
                        params: {
                            order: auth.order,
                            page: pageable.page,
                        },
                    }
                );
            setOrderItems(orderItemsData.content);
            setTotal(orderItemsData.total);
            setPageable(orderItemsData.pageable);
        } catch (error: any) {
            setError(error);
        }
    };
    const loadOrder = async () => {
        if (
            [RoleName.Client, RoleName.Manager, RoleName.Admin].includes(
                auth.role
            )
        ) {
            try {
                const orderData: OrderDto = await api.get(
                    `/api/orders/${auth.order}`
                );
                setOrder(orderData);
            } catch (error: any) {
                setError(error);
            }
        }
    };
    const updateOrderItem = async (
        id: number,
        orderItemDto: UpdateOrderItemDto | UpdateCartDto
    ) => {
        try {
            orderItemDto.quantity > 0
                ? await api.put(
                      [
                          RoleName.Client,
                          RoleName.Manager,
                          RoleName.Admin,
                      ].includes(auth.role)
                          ? `/api/order-items/${id}`
                          : `/cart/${id}`,
                      orderItemDto
                  )
                : await api.delete(
                      [
                          RoleName.Client,
                          RoleName.Manager,
                          RoleName.Admin,
                      ].includes(auth.role)
                          ? `/api/order-items/${id}`
                          : `/cart/${id}`
                  );
            loadOrderItems();
            loadOrder();
        } catch (error: any) {
            setError(error);
        }
    };
    const confirmOrder = async (orderDto: UpdateOrderDto) => {
        await api.put(`/api/orders/${auth.order}`, orderDto);
        setAlertPrompt(true);
    };
    useEffect(() => {
        if (auth) {
            loadOrderItems();
            loadOrder();
        }
    }, [auth]);
    return (
        <div className={"d-flex flex-column flex-fill mx-4"}>
            <div className={styles["alert"]}>
                <Toast
                    show={alertPrompt}
                    delay={3000}
                    autohide={true}
                    onClose={() => router.push("/")}
                >
                    <Toast.Header
                        closeButton={false}
                        className={"justify-content-center"}
                    >
                        <div className={"fs-5"}>Оформление заказа</div>
                    </Toast.Header>
                    <Toast.Body>
                        <div className={"text-center"}>Заказ подтвержден!</div>
                        <div className={"d-flex justify-content-center"}>
                            <Button
                                variant={"primary"}
                                size={"sm"}
                                onClick={() => router.push("/")}
                            >
                                ОК
                            </Button>
                        </div>
                    </Toast.Body>
                </Toast>
            </div>
            <div className={styles["alert"]}>
                <Toast
                    show={!!confirmPrompt}
                    delay={3000}
                    onClose={() => setConfirmPrompt(null)}
                >
                    <Toast.Header
                        closeButton={false}
                        className={"justify-content-center"}
                    >
                        <div className={"fs-5"}>Оформление заказа</div>
                    </Toast.Header>
                    <Toast.Body>
                        <div className={"text-center"}>{confirmPrompt}</div>
                        <div className={"d-flex justify-content-center"}>
                            <Button
                                variant={"primary"}
                                size={"sm"}
                                onClick={() => setConfirmPrompt(null)}
                            >
                                ОК
                            </Button>
                        </div>
                    </Toast.Body>
                </Toast>
            </div>
            <div className={"d-flex flex-column flex-fill"}>
                <div
                    className={
                        "mt-3 border-3 border-bottom text-center text-white fs-2"
                    }
                >
                    Корзина
                </div>
                <div className={styles["order-item-list-wrap"]}>
                    {orderItems ? (
                        total > 0 ? (
                            <>
                                <OrderFormComponent
                                    setError={setError}
                                    showOrder={showOrder}
                                    order={order}
                                    confirmOrder={confirmOrder}
                                    onClose={() => setShowOrder(false)}
                                />
                                <PaginationComponent
                                    total={total}
                                    pageable={pageable}
                                    setPage={(page) => {
                                        pageable.page = page;
                                        loadOrderItems();
                                    }}
                                />
                                <div
                                    className={
                                        "d-flex align-items-center flex-column flex-fill"
                                    }
                                >
                                    <div
                                        className={
                                            "d-flex flex-column flex-fill w-75"
                                        }
                                    >
                                        <Stack>
                                            {orderItems.map((orderItem) => (
                                                <OrderItemFormComponent
                                                    key={
                                                        orderItem.id ??
                                                        orderItem.dish
                                                    }
                                                    setError={setError}
                                                    orderItem={orderItem}
                                                    updateOrderItem={(
                                                        orderItemDto:
                                                            | UpdateOrderItemDto
                                                            | UpdateCartDto
                                                    ) =>
                                                        updateOrderItem(
                                                            [
                                                                RoleName.Client,
                                                                RoleName.Manager,
                                                                RoleName.Admin,
                                                            ].includes(
                                                                auth.role
                                                            )
                                                                ? orderItem.id
                                                                : orderItem.dish,
                                                            orderItemDto
                                                        )
                                                    }
                                                />
                                            ))}
                                        </Stack>
                                    </div>
                                </div>
                                <div
                                    className={
                                        "d-flex justify-content-center m-4"
                                    }
                                >
                                    <Button
                                        variant={"success"}
                                        size={"lg"}
                                        className={"w-50"}
                                        onClick={() =>
                                            [
                                                RoleName.Client,
                                                RoleName.Manager,
                                                RoleName.Admin,
                                            ].includes(auth.role)
                                                ? auth.blocked
                                                    ? setConfirmPrompt(
                                                          "Вы не сможете оформить заказ, так как ваш аккаунт заблокирован"
                                                      )
                                                    : setShowOrder(true)
                                                : setConfirmPrompt(
                                                      "Вы не сможете оформить заказ пока не зарегистрируетесь"
                                                  )
                                        }
                                    >
                                        Оформить заказ
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div
                                className={
                                    "d-flex justify-content-center align-items-center flex-fill"
                                }
                            >
                                <div className={"text-center"}>
                                    <div className={"fs-3 text-white"}>
                                        В корзине пока пусто
                                    </div>
                                    <Link href={"/menu"}>
                                        <Button
                                            variant={"danger"}
                                            size={"lg"}
                                            className={"m-4 rounded-pill"}
                                        >
                                            Посмотреть меню
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )
                    ) : (
                        <SpinnerComponent variant={"light"} size={"lg"} />
                    )}
                </div>
            </div>
        </div>
    );
}
