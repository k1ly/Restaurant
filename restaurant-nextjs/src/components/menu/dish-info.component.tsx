import { DishDto } from "@/common/dto/dishes/dish.dto";
import config, { ConfigKey } from "@/common/util/config";
import { Button } from "@/components/page/button.component";
import styles from "@/styles/menu.module.sass";
import clsx from "classnames";
import { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

export interface DishInfoComponentProps {
    dish: DishDto;
    addOrderItem: () => void;
}

export function DishInfoComponent({
    dish,
    addOrderItem,
}: DishInfoComponentProps) {
    const [description, setDescription] = useState(false);
    return (
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
                            className={"position-relative w-100 h-100 rounded"}
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
                                        className={styles["dish-discount-text"]}
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
                        <Card.Title className={"fs-5"}>{dish.name}</Card.Title>
                    </Card.Header>
                    <Card.Body className={"flex-fill py-md-4"}>
                        <Card.Text
                            className={clsx(styles["dish-description"], {
                                "text-truncate": description,
                            })}
                            onClick={() => setDescription(!description)}
                        >
                            {dish.description}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <div className={"d-flex justify-content-between"}>
                            <div
                                className={
                                    "d-flex justify-content-between w-25"
                                }
                            >
                                <div className={"border-2 border-end pe-3"}>
                                    {dish.weight} г.
                                </div>
                                <div
                                    className={
                                        "d-flex justify-content-end fs-5"
                                    }
                                >
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
                            </div>
                            <div>
                                <Button
                                    variant={"outline-primary"}
                                    size={"sm"}
                                    onClick={addOrderItem}
                                >
                                    Добавить в корзину
                                </Button>
                            </div>
                        </div>
                    </Card.Footer>
                </Col>
            </Row>
        </Card>
    );
}
