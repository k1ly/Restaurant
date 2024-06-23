import { ReservationDto } from "@/common/dto/reservations/reservation.dto";
import { UserDto } from "@/common/dto/users/user.dto";
import api from "@/common/util/api";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";

export interface ReservationInfoComponentProps {
    setError: ErrorHandler;
    reservation: ReservationDto;
}

export function ReservationInfoComponent({
    setError,
    reservation,
}: ReservationInfoComponentProps) {
    const [customer, setCustomer] = useState<UserDto>();
    const loadCustomer = async () => {
        try {
            const customerData: UserDto = await api.get(
                `/api/users/${reservation.customer}`
            );
            setCustomer(customerData);
        } catch (error: any) {
            setError(error);
        }
    };
    useEffect(() => {
        if (reservation) loadCustomer();
    }, [reservation]);
    return (
        <Card className={"mx-2"}>
            <Card.Header>
                <Card.Title className={"fw-semibold"}>
                    Дата начала бронирования:{" "}
                    {new Date(
                        Date.parse(reservation.startDate)
                    ).toLocaleString()}
                </Card.Title>
                <Card.Text>
                    Дата окончания броинрования:{" "}
                    {new Date(Date.parse(reservation.endDate)).toLocaleString()}
                </Card.Text>
            </Card.Header>
            <Card.Body>
                <Card.Text className={"col fs-5 fw-semibold"}>
                    Стоимость: {reservation.price} руб.
                </Card.Text>
                <Card.Text>Столик №{reservation.table}</Card.Text>
                {customer && (
                    <Form.Group>
                        <Form.Label>
                            Заказчик: {customer.name}{" "}
                            {customer.phone && `(${customer.phone})`}
                        </Form.Label>
                    </Form.Group>
                )}
                <Card.Text>
                    Дата бронирования:{" "}
                    {new Date(Date.parse(reservation.date)).toLocaleString()}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}
