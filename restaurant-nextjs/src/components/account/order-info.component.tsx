import { AddressDto } from "@/common/dto/addresses/address.dto";
import { OrderDto } from "@/common/dto/orders/order.dto";
import api from "@/common/util/api";
import { Tab } from "@/components/account/order-list.component";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Accordion, Card, Form } from "react-bootstrap";

export interface OrderInfoComponentProps {
    setError: ErrorHandler;
    order: OrderDto;
    cancelOrder: () => void;
}

export function OrderInfoComponent({
    setError,
    order,
    cancelOrder,
}: OrderInfoComponentProps) {
    const [address, setAddress] = useState<AddressDto>();
    const query = useSearchParams();
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
        if (order) loadAddress();
    }, []);
    return (
        <Card className={"mx-2"}>
            <Card.Header>
                <Card.Title className={"fw-semibold"}>
                    Дата заказа:{" "}
                    {new Date(Date.parse(order.orderDate)).toLocaleString()}
                </Card.Title>
                <Card.Text>
                    Указанное время:{" "}
                    {new Date(Date.parse(order.specifiedDate)).toLocaleString()}
                </Card.Text>
            </Card.Header>
            <Card.Body>
                <Card.Text className={"col fs-5 fw-semibold"}>
                    Итоговая стоимость: {order.price} руб.
                </Card.Text>
                <Accordion>
                    <Accordion.Item eventKey={"0"}>
                        <Accordion.Header>Адрес</Accordion.Header>
                        <Accordion.Body>
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
                            variant={"outline-danger"}
                            size={"sm"}
                            onClick={() => cancelOrder()}
                        >
                            Отменить заказ
                        </Button>
                    </div>
                )}
            </Card.Footer>
        </Card>
    );
}
