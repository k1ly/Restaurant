import { AddressDto } from "@/common/dto/addresses/address.dto";
import { CreateAddressDto } from "@/common/dto/addresses/create-address.dto";
import { OrderDto } from "@/common/dto/orders/order.dto";
import { UpdateOrderDto } from "@/common/dto/orders/update-order.dto";
import { BadRequestError } from "@/common/error/bad-request.error";
import api from "@/common/util/api";
import { AddressFormComponent } from "@/components/cart/address-form.component";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import { PageableData } from "@/components/page/pagination.component";
import styles from "@/styles/cart.module.sass";
import { useEffect, useState } from "react";
import { Col, Form, Modal, Row, Toast } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface OrderFormComponentProps {
    setError: ErrorHandler;
    showOrder: boolean;
    order: OrderDto;
    confirmOrder: (orderDto: UpdateOrderDto) => Promise<void>;
    onClose: () => void;
}

export function OrderFormComponent({
    setError,
    showOrder,
    order,
    confirmOrder,
    onClose,
}: OrderFormComponentProps) {
    const [addresses, setAddresses] = useState<AddressDto[]>();
    const [address, setAddress] = useState(0);
    const [showAddress, setShowAddress] = useState(false);
    const [specifiedDate, setSpecifiedDate] = useState<Date>();
    const [minSpecifiedDate, setMinSpecifiedDate] = useState<Date>();
    const [maxSpecifiedDate, setMaxSpecifiedDate] = useState<Date>();
    const [validated, setValidated] = useState(false);
    const [feedback, setFeedback] = useState<string>();
    const [notification, setNotification] = useState<string>();
    const loadAddresses = async () => {
        try {
            const addressesData: PageableData<AddressDto> = await api.get(
                "/api/addresses",
                {
                    params: {
                        user: order.customer,
                    },
                }
            );
            setAddresses(addressesData.content);
        } catch (error: any) {
            setError(error);
        }
    };
    const createAddress = async (addressDto: CreateAddressDto) => {
        await api.post("/api/addresses", addressDto);
        loadAddresses();
        setShowAddress(false);
        setNotification("Адрес успешно добавлен!");
    };
    const isSubmitAllowed = () => address > 0;
    const handleSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (!e.currentTarget.form?.checkValidity()) {
            setValidated(true);
            return;
        }
        try {
            await confirmOrder({
                specifiedDate,
                address,
            });
        } catch (error: any) {
            if (error instanceof BadRequestError) {
                console.error(error);
                setFeedback("Неверно введены данные!");
                return;
            }
            setError(error);
        }
    };
    useEffect(() => {
        if (order) loadAddresses();
    }, [order]);
    useEffect(() => {
        const now = new Date();
        const minDate = new Date(now);
        minDate.setHours(now.getHours() + 1, now.getMinutes() < 30 ? 0 : 30);
        if (specifiedDate) {
            if (
                specifiedDate.toString().slice(0, 10) !==
                now.toString().slice(0, 10)
            )
                minDate.setHours(0, 0);
            if (specifiedDate.getHours() < minDate.getHours())
                setSpecifiedDate(
                    new Date(
                        new Date(specifiedDate).setHours(minDate.getHours())
                    )
                );
        }
        const maxDate = new Date(now);
        maxDate.setHours(47, 45);
        [minDate, maxDate].forEach((date) => date.setSeconds(0, 0));
        setMinSpecifiedDate(minDate);
        setMaxSpecifiedDate(maxDate);
    }, [specifiedDate]);
    return (
        <>
            <Toast
                show={!!notification}
                delay={5000}
                autohide={true}
                className={styles["notification"]}
                onClose={() => setNotification(null)}
            >
                <Toast.Header className={"justify-content-center"}>
                    <div className={"fs-5"}>Новый адрес</div>
                </Toast.Header>
                <Toast.Body>{notification}</Toast.Body>
            </Toast>
            <Modal
                show={showOrder}
                onHide={onClose}
                size={"lg"}
                backdrop={"static"}
                keyboard={false}
                centered
            >
                {order && (
                    <Form validated={validated} className={"my-1"}>
                        <Modal.Header closeButton>
                            <Modal.Title className={"fs-4"}>
                                Оформление заказа
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col>
                                    {addresses && (
                                        <div className={"my-2"}>
                                            <Form.Label htmlFor={"address"}>
                                                Адрес
                                            </Form.Label>
                                            <Form.Select
                                                id={"address"}
                                                name={"address"}
                                                required
                                                title={
                                                    "Выберите адрес доставки"
                                                }
                                                value={address}
                                                onChange={(e) =>
                                                    setAddress(
                                                        Number(e.target.value)
                                                    )
                                                }
                                            >
                                                <option
                                                    value={0}
                                                    disabled={true}
                                                >
                                                    ...
                                                </option>
                                                {addresses.map((address) => (
                                                    <option
                                                        key={address.id}
                                                        value={address.id}
                                                    >
                                                        {address.locality},{" "}
                                                        {address.country},{" "}
                                                        {address.street}{" "}
                                                        {address.house}{" "}
                                                        {address.apartment}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                    )}
                                    <div>
                                        <Button
                                            variant={"outline-primary"}
                                            onClick={() =>
                                                setShowAddress(!showAddress)
                                            }
                                        >
                                            {showAddress
                                                ? "Скрыть"
                                                : "Добавить новый адрес"}
                                        </Button>
                                        <AddressFormComponent
                                            setError={setError}
                                            showAddress={showAddress}
                                            order={order}
                                            createAddress={createAddress}
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label
                                            htmlFor={"specifiedDate"}
                                            className={"fs-5"}
                                        >
                                            Дата доставки
                                        </Form.Label>
                                        <DatePicker
                                            id={"specifiedDate"}
                                            name={"specifiedDate"}
                                            required
                                            inline
                                            minDate={minSpecifiedDate}
                                            maxDate={maxSpecifiedDate}
                                            dateFormat={"MM-dd HH:mm"}
                                            showTimeSelect
                                            timeIntervals={15}
                                            minTime={minSpecifiedDate}
                                            maxTime={maxSpecifiedDate}
                                            timeFormat={"HH:mm"}
                                            title={"Выберите дату доставки"}
                                            selected={specifiedDate}
                                            onChange={(specifiedDate) =>
                                                setSpecifiedDate(specifiedDate)
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className={"mt-3 bg-light fs-4"}>
                                <div className={"px-3"}>
                                    Итоговая сумма: {order.price} руб.
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            {feedback && (
                                <div
                                    className={"text-danger fw-bold fst-italic"}
                                >
                                    {feedback}
                                </div>
                            )}
                            <Button
                                variant={"success"}
                                className={"w-100"}
                                disabled={!isSubmitAllowed()}
                                onClick={handleSubmit}
                            >
                                Подтвердить заказ
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Modal>
        </>
    );
}
