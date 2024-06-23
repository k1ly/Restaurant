import { OrderDto } from "@/common/dto/orders/order.dto";
import { StatusDto } from "@/common/dto/statuses/status.dto";
import { StatusName } from "@/common/dto/statuses/status.name";
import { UserDto } from "@/common/dto/users/user.dto";
import api from "@/common/util/api";
import { OrderInfoComponent } from "@/components/account/order-info.component";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import {
    Pageable,
    PageableData,
    PaginationComponent,
    SortOrder,
} from "@/components/page/pagination.component";
import { SpinnerComponent } from "@/components/page/spinner.component";
import styles from "@/styles/account.module.sass";
import clsx from "classnames";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { Col, Nav, Row, Stack, Toast } from "react-bootstrap";

export enum Tab {
    Awaiting = "awaiting",
    Preparing = "preparing",
    Ready = "ready",
    NotPaid = "not-paid",
    Finished = "finished",
}

export const tabStatusNameMap: Record<Tab, StatusName> = {
    [Tab.Awaiting]: StatusName.Awaiting,
    [Tab.Preparing]: StatusName.Preparing,
    [Tab.Ready]: StatusName.Ready,
    [Tab.NotPaid]: StatusName.NotPaid,
    [Tab.Finished]: StatusName.Finished,
};

export interface OrderListComponentProps {
    setError: ErrorHandler;
    auth: UserDto;
}

export function OrderListComponent({
    setError,
    auth,
}: OrderListComponentProps) {
    const [orders, setOrders] = useState<OrderDto[]>();
    const [total, setTotal] = useState<number>();
    const [pageable, setPageable] = useState<Pageable>({
        sort: "orderDate",
        order: SortOrder.Desc,
    });
    const [status, setStatus] = useState<StatusDto>();
    const [alertPrompt, setAlertPrompt] = useState(false);
    const query = useSearchParams();
    const router = useRouter();
    const loadOrders = async () => {
        try {
            const ordersData: PageableData<OrderDto> = await api.get(
                "/api/orders",
                {
                    params: {
                        status: status.id,
                        customer: auth.id,
                        page: pageable.page,
                        sort: `${pageable.sort},${pageable.order}`,
                    },
                }
            );
            setOrders(ordersData.content);
            setTotal(ordersData.total);
            setPageable(ordersData.pageable);
        } catch (error: any) {
            setError(error);
        }
    };
    const loadStatus = async () => {
        try {
            const statusData: StatusDto = await api.get("/api/statuses/find", {
                params: {
                    name: tabStatusNameMap[query.get("tab") as Tab],
                },
            });
            setStatus(statusData);
        } catch (error: any) {
            setError(error);
        }
    };
    const cancelOrder = async (order: OrderDto) => {
        try {
            await api.delete(`/api/orders/${order.id}`);
            setAlertPrompt(true);
        } catch (error: any) {
            setError(error);
        }
    };
    useEffect(() => {
        if (!tabStatusNameMap[query.get("tab") as Tab]) {
            router.push(
                `?${queryString.stringify({
                    tab: Tab.Awaiting,
                })}`
            );
            return;
        }
        loadStatus();
    }, [auth, query]);
    useEffect(() => {
        if (status) loadOrders();
    }, [status]);
    return (
        <Row className={"flex-nowrap flex-fill g-0"}>
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
                        <div className={"fs-5"}>Заказы</div>
                    </Toast.Header>
                    <Toast.Body>
                        <div className={"text-center"}>Заказ отменен!</div>
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
            <Col md={3} className={"d-flex flex-column flex-fill"}>
                <div className={styles["status-list"]}>
                    <Nav className={"flex-column"}>
                        <Nav.Item>
                            <Link
                                href={`?${queryString.stringify({
                                    tab: Tab.Awaiting,
                                })}`}
                                className={"text-decoration-none"}
                            >
                                <Nav.Link
                                    as={"div"}
                                    className={clsx(styles["order-nav-link"], {
                                        [styles["active"]]:
                                            query.get("tab") === Tab.Awaiting,
                                    })}
                                >
                                    В ожидании
                                </Nav.Link>
                            </Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link
                                href={`?${queryString.stringify({
                                    tab: Tab.Preparing,
                                })}`}
                                className={"text-decoration-none"}
                            >
                                <Nav.Link
                                    as={"div"}
                                    className={clsx(styles["order-nav-link"], {
                                        [styles["active"]]:
                                            query.get("tab") === Tab.Preparing,
                                    })}
                                >
                                    Готовятся
                                </Nav.Link>
                            </Link>
                        </Nav.Item>
                        <Link
                            href={`?${queryString.stringify({
                                tab: Tab.Ready,
                            })}`}
                            className={"text-decoration-none"}
                        >
                            <Nav.Link
                                as={"div"}
                                className={clsx(styles["order-nav-link"], {
                                    [styles["active"]]:
                                        query.get("tab") === Tab.Ready,
                                })}
                            >
                                Готовы
                            </Nav.Link>
                        </Link>
                        <Link
                            href={`?${queryString.stringify({
                                tab: "not-paid",
                            })}`}
                            className={"text-decoration-none"}
                        >
                            <Nav.Link
                                as={"div"}
                                className={clsx(styles["order-nav-link"], {
                                    [styles["active"]]:
                                        query.get("tab") === Tab.NotPaid,
                                })}
                            >
                                Не оплачены
                            </Nav.Link>
                        </Link>
                        <Link
                            href={`?${queryString.stringify({
                                tab: Tab.Finished,
                            })}`}
                            className={"text-decoration-none"}
                        >
                            <Nav.Link
                                as={"div"}
                                className={clsx(styles["order-nav-link"], {
                                    [styles["active"]]:
                                        query.get("tab") === Tab.Finished,
                                })}
                            >
                                Доставлены
                            </Nav.Link>
                        </Link>
                    </Nav>
                    <div className={styles["status-list-footer"]}></div>
                </div>
            </Col>
            <Col className={"d-flex flex-column flex-fill"}>
                <div className={"d-flex flex-column flex-fill pt-4"}>
                    {status ? (
                        orders ? (
                            total > 0 ? (
                                <>
                                    <PaginationComponent
                                        total={total}
                                        pageable={pageable}
                                        setPage={(page) => {
                                            pageable.page = page;
                                            loadOrders();
                                        }}
                                    />
                                    <Stack>
                                        {orders.map((order) => (
                                            <OrderInfoComponent
                                                key={order.id}
                                                setError={setError}
                                                order={order}
                                                cancelOrder={() =>
                                                    cancelOrder(order)
                                                }
                                            />
                                        ))}
                                    </Stack>
                                </>
                            ) : (
                                <div
                                    className={
                                        "d-flex justify-content-center align-items-center flex-fill"
                                    }
                                >
                                    <div className={"text-white fs-3"}>
                                        История заказов пока пуста
                                    </div>
                                </div>
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
                                Выберите статус заказов для просмотра
                            </div>
                        </div>
                    )}
                </div>
            </Col>
        </Row>
    );
}
