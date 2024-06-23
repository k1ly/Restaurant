import { AddressDto } from "@/common/dto/addresses/address.dto";
import { ManagerUpdateOrderDto } from "@/common/dto/orders/manager-update-order.dto";
import { OrderDto } from "@/common/dto/orders/order.dto";
import { StatusDto } from "@/common/dto/statuses/status.dto";
import { UserDto } from "@/common/dto/users/user.dto";
import api from "@/common/util/api";
import { Tab } from "@/components/account/order-list.component";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Accordion, Card, Form } from "react-bootstrap";

export interface OrderInfoComponentProps {
    setError: ErrorHandler;
    auth: UserDto;
    order: OrderDto;
    statusPreparing: StatusDto;
    statusReady: StatusDto;
    statusFinished: StatusDto;
    statusNotPaid: StatusDto;
    editOrder: (orderDto: ManagerUpdateOrderDto) => void;
}

export function OrderInfoComponent({
    setError,
    auth,
    order,
    statusPreparing,
    statusReady,
    statusFinished,
    statusNotPaid,
    editOrder,
}: OrderInfoComponentProps) {
    const [customer, setCustomer] = useState<UserDto>();
    const [address, setAddress] = useState<AddressDto>();
    const query = useSearchParams();
    const loadCustomer = async () => {
        try {
            const customerData: UserDto = await api.get(
                `/api/users/${order.customer}`
            );
            setCustomer(customerData);
        } catch (error: any) {
            setError(error);
        }
    };
    const loadAddress = async () => {
        try {
            const addressData: AddressDto = await api.get(
                `/api/addresses/${order.address}`
            );
            setAddress(addressData);
        } catch (error: any) {
            setError(error);
        }
    };
    useEffect(() => {
        if (order) {
            loadCustomer();
            loadAddress();
        }
    }, [order]);
    return (
        <Card className={"mx-2"}>
            <Card.Header>
                <Card.Title className={"fw-semibold"}>
                    Дата заказа:{" "}
                    {new Date(Date.parse(order.orderDate)).toLocaleString()}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text className={"col fs-5 fw-semibold"}>
                    Итоговая стоимость: {order.price} руб.
                </Card.Text>
                <Card.Text>
                    Указанное время:{" "}
                    {new Date(Date.parse(order.specifiedDate)).toLocaleString()}
                </Card.Text>
                {query.get("tab") === Tab.Finished && (
                    <Card.Text>
                        Время доставки:{" "}
                        {new Date(
                            Date.parse(order.deliveryDate)
                        ).toLocaleString()}
                    </Card.Text>
                )}
                <Accordion>
                    <Accordion.Item eventKey={"0"}>
                        <Accordion.Header>Адрес заказчика</Accordion.Header>
                        <Accordion.Body>
                            {customer && (
                                <Form.Group>
                                    <Form.Label>
                                        Заказчик: {customer.name}{" "}
                                        {customer.phone &&
                                            `(${customer.phone})`}
                                    </Form.Label>
                                </Form.Group>
                            )}
                            {address && (
                                <div>
                                    <Form.Group>
                                        <Form.Label>
                                            Страна: {address.country}
                                        </Form.Label>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>
                                            Населенный пункт: {address.locality}
                                        </Form.Label>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>
                                            Улица: {address.street}
                                        </Form.Label>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>
                                            Дом: {address.house}
                                        </Form.Label>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>
                                            Квартира: {address.apartment}
                                        </Form.Label>
                                    </Form.Group>
                                </div>
                            )}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Card.Body>
            <Card.Footer>
                {query.get("tab") === Tab.Awaiting && (
                    <div className={"d-flex justify-content-end"}>
                        <Button
                            variant={"primary"}
                            size={"sm"}
                            onClick={() =>
                                editOrder({
                                    status: statusPreparing.id,
                                    manager: auth.id,
                                })
                            }
                        >
                            Принять
                        </Button>
                    </div>
                )}
                {query.get("tab") === Tab.Preparing && (
                    <div className={"d-flex justify-content-end"}>
                        <Button
                            variant={"primary"}
                            size={"sm"}
                            onClick={() =>
                                editOrder({
                                    status: statusReady.id,
                                })
                            }
                        >
                            Готов
                        </Button>
                    </div>
                )}
                {query.get("tab") === Tab.Ready && (
                    <div className={"d-flex justify-content-end"}>
                        <Button
                            variant={"success"}
                            size={"sm"}
                            className={"me-3"}
                            onClick={() =>
                                editOrder({
                                    status: statusFinished.id,
                                })
                            }
                        >
                            Доставлен
                        </Button>
                        <Button
                            variant={"warning"}
                            size={"sm"}
                            className={"ms-3"}
                            onClick={() =>
                                editOrder({
                                    status: statusNotPaid.id,
                                })
                            }
                        >
                            Не оплачен
                        </Button>
                    </div>
                )}
            </Card.Footer>
        </Card>
    );
}
