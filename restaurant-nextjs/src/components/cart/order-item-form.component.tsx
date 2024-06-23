import { DishDto } from "@/common/dto/dishes/dish.dto";
import { UpdateOrderItemDto } from "@/common/dto/order-items/update-order-item.dto";
import api from "@/common/util/api";
import config, { ConfigKey } from "@/common/util/config";
import { ErrorHandler } from "@/components/error/error-handler.component";
import styles from "@/styles/cart.module.sass";
import { useEffect, useState } from "react";
import { Card, CloseButton, Col, Form, InputGroup, Row } from "react-bootstrap";
import { FormOrderItemDto } from "./order-item-list.component";

export interface OrderItemFormComponentProps {
    setError: ErrorHandler;
    orderItem: FormOrderItemDto;
    updateOrderItem: (orderItemDto: UpdateOrderItemDto) => void;
}

export function OrderItemFormComponent({
    setError,
    orderItem,
    updateOrderItem,
}: OrderItemFormComponentProps) {
    const [quantity, setQuantity] = useState<number>();
    const [dish, setDish] = useState<DishDto>();
    const loadDish = async () => {
        try {
            const dishData: DishDto = await api.get(
                `/api/dishes/${orderItem.dish}`
            );
            setDish(dishData);
        } catch (error: any) {
            setError(error);
        }
    };
    const handleQuantity = (quantity: number) => {
        if (!Number.isInteger(quantity)) {
            setQuantity(orderItem.quantity);
            return;
        }
        if (quantity !== orderItem.quantity)
            updateOrderItem({
                quantity,
            });
    };
    useEffect(() => {
        loadDish();
    }, []);
    useEffect(() => {
        setQuantity(orderItem.quantity);
    }, [orderItem]);
    return (
        dish && (
            <Card className={"mx-2 my-1"}>
                <Row className={"flex-nowrap g-0"}>
                    <Col md={"auto"} className={"pe-0"}>
                        <div className={styles["dish-image"]}>
                            <Card.Img
                                src={
                                    dish.imageUrl
                                        ? `${config.get(ConfigKey.ApiUrl)}/${
                                              dish.imageUrl
                                          }`
                                        : "/img/icon/dish.svg"
                                }
                                className={
                                    "position-relative w-100 h-100 rounded"
                                }
                            />
                            {dish.discount > 0 && (
                                <div className={styles["dish-discount"]}>
                                    <svg
                                        width={50}
                                        height={50}
                                        viewBox={"0 0 1 1"}
                                        xmlns={"http://www.w3.org/2000/svg"}
                                        className={"mt-1 ms-1"}
                                    >
                                        <path
                                            fill={"#e80202bf"}
                                            d={"M0 1 1 0H0z"}
                                        />
                                    </svg>
                                    <span className={styles["dish-discount"]}>
                                        <div
                                            className={
                                                styles["dish-discount-text"]
                                            }
                                        >
                                            -{dish.discount}%
                                        </div>
                                    </span>
                                </div>
                            )}
                        </div>
                    </Col>
                    <Col className={"d-flex flex-column ps-0 overflow-hidden"}>
                        <Card.Header>
                            <Card.Title className={"fs-5 fw-semibold"}>
                                {dish.name}
                            </Card.Title>
                        </Card.Header>
                        <Card.Body className={"flex-fill py-md-4"}>
                            <div className={"fs-5 ps-2"}>
                                {dish.discount > 0 ? (
                                    <span>
                                        <span
                                            className={
                                                "me-2 text-decoration-line-through text-secondary"
                                            }
                                        >
                                            {dish.price}
                                        </span>
                                        <span className={"fw-semibold"}>
                                            {(
                                                (dish.price *
                                                    (100 - dish.discount)) /
                                                100
                                            ).toFixed(2)}{" "}
                                            руб.
                                        </span>
                                    </span>
                                ) : (
                                    <span className={"fw-semibold"}>
                                        {dish.price} руб.
                                    </span>
                                )}
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <InputGroup
                                className={styles["order-item-quantity"]}
                            >
                                <CloseButton
                                    className={styles["order-item-minus"]}
                                    onClick={() => handleQuantity(quantity - 1)}
                                ></CloseButton>
                                <Form.Control
                                    type={"number"}
                                    value={quantity}
                                    className={"fs-5"}
                                    onChange={(e) =>
                                        handleQuantity(Number(e.target.value))
                                    }
                                />
                                <CloseButton
                                    className={styles["order-item-plus"]}
                                    onClick={() => handleQuantity(quantity + 1)}
                                ></CloseButton>
                                <CloseButton
                                    className={
                                        "py-3 border-start border-secondary"
                                    }
                                    onClick={() => handleQuantity(0)}
                                ></CloseButton>
                            </InputGroup>
                        </Card.Footer>
                    </Col>
                </Row>
            </Card>
        )
    );
}
