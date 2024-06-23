import { ReservationDto } from "@/common/dto/reservations/reservation.dto";
import { Card } from "react-bootstrap";

export interface ReservationInfoComponentProps {
    reservation: ReservationDto;
}

export function ReservationInfoComponent({
    reservation,
}: ReservationInfoComponentProps) {
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
                <Card.Text>
                    Дата бронирования:{" "}
                    {new Date(Date.parse(reservation.date)).toLocaleString()}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}
