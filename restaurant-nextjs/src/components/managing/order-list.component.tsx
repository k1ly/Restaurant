import { ManagerUpdateOrderDto } from "@/common/dto/orders/manager-update-order.dto";
import { OrderDto } from "@/common/dto/orders/order.dto";
import { StatusDto } from "@/common/dto/statuses/status.dto";
import { StatusName } from "@/common/dto/statuses/status.name";
import { UserDto } from "@/common/dto/users/user.dto";
import api from "@/common/util/api";
import config, { ConfigKey } from "@/common/util/config";
import {
    Tab,
    tabStatusNameMap,
} from "@/components/account/order-list.component";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { OrderInfoComponent } from "@/components/managing/order-info.component";
import {
    Pageable,
    PageableData,
    PaginationComponent,
    SortOrder,
} from "@/components/page/pagination.component";
import { SpinnerComponent } from "@/components/page/spinner.component";
import styles from "@/styles/managing.module.sass";
import clsx from "classnames";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { Col, Nav, Row, Stack, Toast } from "react-bootstrap";
import { Socket, io } from "socket.io-client";

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
    const [statusPreparing, setStatusPreparing] = useState<StatusDto>();
    const [statusReady, setStatusReady] = useState<StatusDto>();
    const [statusFinished, setStatusFinished] = useState<StatusDto>();
    const [statusNotPaid, setStatusNotPaid] = useState<StatusDto>();
    const [notification, setNotification] = useState<string>();
    const socketRef = useRef<Socket>();
    const query = useSearchParams();
    const router = useRouter();
    const loadOrders = async () => {
        try {
            const ordersData: PageableData<OrderDto> = await api.get(
                "/api/orders",
                {
                    params: {
                        status: status.id,
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
    const loadStatuses = async () => {
        try {
            const statusData: StatusDto = await api.get("/api/statuses/find", {
                params: {
                    name: tabStatusNameMap[query.get("tab") as Tab],
                },
            });
            setStatus(statusData);
            switch (query.get("tab")) {
                case Tab.Awaiting:
                    const statusPreparingData: StatusDto = await api.get(
                        "/api/statuses/find",
                        {
                            params: {
                                name: StatusName.Preparing,
                            },
                        }
                    );
                    setStatusPreparing(statusPreparingData);
                    break;
                case Tab.Preparing:
                    const statusReadyData: StatusDto = await api.get(
                        "/api/statuses/find",
                        {
                            params: {
                                name: StatusName.Ready,
                            },
                        }
                    );
                    setStatusReady(statusReadyData);
                    break;
                case Tab.Ready:
                    const statusFinishedData: StatusDto = await api.get(
                        "/api/statuses/find",
                        {
                            params: {
                                name: StatusName.Finished,
                            },
                        }
                    );
                    setStatusFinished(statusFinishedData);
                    const statusNotPaidData: StatusDto = await api.get(
                        "/api/statuses/find",
                        {
                            params: {
                                name: StatusName.NotPaid,
                            },
                        }
                    );
                    setStatusNotPaid(statusNotPaidData);
                    break;
            }
        } catch (error: any) {
            setError(error);
        }
    };
    const editOrder = async (id: number, orderDto: ManagerUpdateOrderDto) => {
        try {
            await api.patch(`/api/orders/${id}`, orderDto);
            setNotification("Статус заказа обновлен!");
            loadOrders();
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
        loadStatuses();
    }, [auth, query]);
    useEffect(() => {
        if (status) {
            loadOrders();
            socketRef.current
                ? socketRef.current.off("orders")
                : (socketRef.current = io(config.get(ConfigKey.ApiUrl)));
            socketRef.current.on("orders", (statusName: string) => {
                if (status.name === statusName) loadStatuses();
            });
            return () => {
                socketRef.current.off("orders");
                socketRef.current.close();
            };
        }
    }, [status]);
    return (
        <Row className={"flex-nowrap flex-fill g-0"}>
            <Toast
                show={!!notification}
                delay={5000}
                autohide={true}
                className={styles["notification"]}
                onClose={() => setNotification(null)}
            >
                <Toast.Header className={"justify-content-center"}>
                    <div className={"fs-5"}>Управление заказами</div>
                </Toast.Header>
                <Toast.Body>{notification}</Toast.Body>
            </Toast>
            <Col md={3} className={"d-flex flex-column flex-fill"}>
                <div className={styles["status-list"]}>
                    <Nav className={"flex-column"}>
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
                                tab: Tab.NotPaid,
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
                                                auth={auth}
                                                order={order}
                                                statusPreparing={
                                                    statusPreparing
                                                }
                                                statusReady={statusReady}
                                                statusFinished={statusFinished}
                                                statusNotPaid={statusNotPaid}
                                                editOrder={(
                                                    orderDto: ManagerUpdateOrderDto
                                                ) =>
                                                    editOrder(
                                                        order.id,
                                                        orderDto
                                                    )
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
                                        Список заказов пуст
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
