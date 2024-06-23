import { CreateAddressDto } from "@/common/dto/addresses/create-address.dto";
import { OrderDto } from "@/common/dto/orders/order.dto";
import { BadRequestError } from "@/common/error/bad-request.error";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import { useEffect, useState } from "react";
import { Card, Collapse, Form } from "react-bootstrap";

export interface AddressFormComponentProps {
    setError: ErrorHandler;
    showAddress: boolean;
    order: OrderDto;
    createAddress: (addressDto: CreateAddressDto) => Promise<void>;
}

export function AddressFormComponent({
    setError,
    showAddress,
    order,
    createAddress,
}: AddressFormComponentProps) {
    const [country, setCountry] = useState("");
    const [locality, setLocality] = useState("");
    const [street, setStreet] = useState("");
    const [house, setHouse] = useState("");
    const [apartment, setApartment] = useState("");
    const [validated, setValidated] = useState(false);
    const [feedback, setFeedback] = useState<string>();
    const resetFormData = () => {
        setCountry("");
        setLocality("");
        setStreet("");
        setHouse("");
        setApartment("");
        setValidated(false);
        setFeedback(null);
    };
    const handleSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (!e.currentTarget.form?.checkValidity()) {
            setValidated(true);
            return;
        }
        try {
            await createAddress({
                country,
                locality,
                street,
                house,
                apartment,
                user: order.customer,
            });
            resetFormData();
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
        resetFormData();
    }, [order]);
    return (
        <Collapse in={showAddress} onExited={resetFormData}>
            <Card className={"my-2 px-2"}>
                <Form validated={validated}>
                    <Form.Group>
                        <Form.Label htmlFor={"country"}>Страна</Form.Label>
                        <Form.Control
                            id={"country"}
                            name={"country"}
                            required
                            minLength={1}
                            maxLength={50}
                            title={"Введите название страны"}
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor={"locality"}>
                            Населенный пункт
                        </Form.Label>
                        <Form.Control
                            id={"locality"}
                            type={"text"}
                            name={"locality"}
                            required
                            minLength={1}
                            maxLength={100}
                            title={"Введите название населенного пункта"}
                            value={locality}
                            onChange={(e) => setLocality(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor={"street"}>Улица</Form.Label>
                        <Form.Control
                            id={"street"}
                            name={"street"}
                            minLength={1}
                            maxLength={100}
                            title={"Введите название улицы"}
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor={"house"}>Дом</Form.Label>
                        <Form.Control
                            id={"house"}
                            name={"house"}
                            required
                            minLength={1}
                            maxLength={10}
                            title={"Введите номер дома"}
                            value={house}
                            onChange={(e) => setHouse(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor={"apartment"}>Квартира</Form.Label>
                        <Form.Control
                            id={"apartment"}
                            type={"text"}
                            name={"apartment"}
                            minLength={1}
                            maxLength={10}
                            title={"Введите номер квартиры"}
                            value={apartment}
                            onChange={(e) => setApartment(e.target.value)}
                        />
                    </Form.Group>
                    <div>
                        {feedback && (
                            <div className={"text-danger fw-bold fst-italic"}>
                                {feedback}
                            </div>
                        )}
                        <div className={"d-flex justify-content-center"}>
                            <Button
                                variant={"primary"}
                                size={"sm"}
                                className={"m-1"}
                                onClick={handleSubmit}
                            >
                                Добавить адрес
                            </Button>
                        </div>
                    </div>
                </Form>
            </Card>
        </Collapse>
    );
}
