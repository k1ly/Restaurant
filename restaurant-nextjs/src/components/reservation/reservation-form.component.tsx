import { CreateReservationDto } from "@/common/dto/reservations/create-reservation.dto";
import { ReservationDto } from "@/common/dto/reservations/reservation.dto";
import { UserDto } from "@/common/dto/users/user.dto";
import { BadRequestError } from "@/common/error/bad-request.error";
import api from "@/common/util/api";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import {
    Pageable,
    PageableData,
    SortOrder,
} from "@/components/page/pagination.component";
import { ReservableTableDto } from "@/pages/reservation";
import { useEffect, useState } from "react";
import { Card, Col, Collapse, Form, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface ReservationFormComponentProps {
    setError: ErrorHandler;
    auth: UserDto;
    showReservation: boolean;
    tables: ReservableTableDto[];
    table: ReservableTableDto;
    setTable: (table: ReservableTableDto) => void;
    createReservation: (reservationDto: CreateReservationDto) => Promise<void>;
}

export function ReservationFormComponent({
    setError,
    auth,
    showReservation,
    tables,
    table,
    setTable,
    createReservation,
}: ReservationFormComponentProps) {
    const [reservations, setReservations] = useState<ReservationDto[]>();
    const [pageable, setPageable] = useState<Pageable>({
        size: 20,
        sort: "startDate",
        order: SortOrder.Desc,
    });
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [minStartDate, setMinStartDate] = useState<Date>();
    const [minEndDate, setMinEndDate] = useState<Date>();
    const [maxStartDate, setMaxStartDate] = useState<Date>();
    const [maxEndDate, setMaxEndDate] = useState<Date>();
    const [validated, setValidated] = useState(false);
    const [feedback, setFeedback] = useState<string>();
    const loadReservations = async () => {
        try {
            const minStartDate = new Date(startDate);
            minStartDate.setHours(9, 0, 0, 0);
            const maxStartDate = new Date(minStartDate);
            maxStartDate.setHours(21);
            const reservationsData: PageableData<ReservationDto> =
                await api.get("/api/reservations", {
                    params: {
                        minStartDate,
                        maxStartDate,
                        size: pageable.size,
                        sort: `${pageable.sort},${pageable.order}`,
                    },
                });
            setReservations(reservationsData.content);
            setPageable(reservationsData.pageable);
        } catch (error: any) {
            setError(error);
        }
    };
    const isSubmitAllowed = () => table && !table.reserved;
    const handleSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (!e.currentTarget.form?.checkValidity()) {
            setValidated(true);
            return;
        }
        try {
            await createReservation({
                startDate,
                endDate,
                table: table.id,
                customer: auth.id,
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
        const minStartDate = new Date();
        if (
            startDate &&
            startDate.toString().slice(0, 10) !==
                minStartDate.toString().slice(0, 10)
        )
            minStartDate.setHours(
                minStartDate.getHours() >= 21 ? 9 + 24 : 9,
                0,
                0,
                0
            );
        else {
            minStartDate.setHours(
                minStartDate.getHours() < 9
                    ? 9
                    : minStartDate.getHours() >= 21
                    ? 9 + 24
                    : minStartDate.getHours() + 1,
                0,
                0,
                0
            );
            if (startDate && startDate.getHours() < minStartDate.getHours())
                setStartDate(minStartDate);
        }
        setMinStartDate(minStartDate);
        const maxStartDate = new Date(minStartDate);
        maxStartDate.setHours(21);
        maxStartDate.setMonth(maxStartDate.getMonth() + 1);
        setMaxStartDate(maxStartDate);
        if (startDate) {
            const minEndDate = new Date(startDate);
            minEndDate.setHours(minEndDate.getHours() + 1, 0, 0, 0);
            setMinEndDate(minEndDate);
            const maxEndDate = new Date(minEndDate);
            maxEndDate.setHours(23);
            setMaxEndDate(maxEndDate);
            setEndDate(new Date(maxEndDate));
            loadReservations();
        }
    }, [startDate]);
    useEffect(() => {
        if (reservations)
            tables.forEach(
                (table) =>
                    (table.reserved = reservations
                        .filter((reservation) => reservation.table === table.id)
                        .some(
                            (reservation) =>
                                (new Date(reservation.startDate) >= startDate &&
                                    new Date(reservation.startDate) <
                                        endDate) ||
                                (new Date(reservation.endDate) > startDate &&
                                    new Date(reservation.endDate) <= endDate) ||
                                (new Date(reservation.startDate) <= startDate &&
                                    new Date(reservation.endDate) >= endDate)
                        ))
            );
    }, [reservations]);
    return (
        <Collapse in={showReservation} className={"mt-4 shadow"}>
            <Card>
                <Form validated={validated} className={"my-1"}>
                    <Card.Header>
                        <Card.Title className={"fs-4"}>
                            Бронирование столика
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group className={"my-2"}>
                            <Form.Label htmlFor={"table"}>Столик</Form.Label>
                            <Form.Select
                                id={"table"}
                                name={"table"}
                                required
                                title={"Выберите столик для бронирования"}
                                value={table ? table.id : 0}
                                onChange={(e) =>
                                    setTable(
                                        tables.find(
                                            (table) =>
                                                table.id ===
                                                Number(e.target.value)
                                        )
                                    )
                                }
                            >
                                <option value={0} disabled={true}>
                                    ...
                                </option>
                                {tables.map((table) => (
                                    <option key={table.id} value={table.id}>
                                        Столик №{table.id}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <div>
                                        <Form.Label
                                            htmlFor={"startDate"}
                                            className={"fs-5"}
                                        >
                                            Дата начала бронирования
                                        </Form.Label>
                                    </div>
                                    <DatePicker
                                        id={"startDate"}
                                        name={"startDate"}
                                        required
                                        inline
                                        minDate={minStartDate}
                                        maxDate={maxStartDate}
                                        dateFormat={"MM-dd HH:mm"}
                                        showTimeSelect
                                        timeIntervals={60}
                                        minTime={minStartDate}
                                        maxTime={maxStartDate}
                                        timeFormat={"HH:mm"}
                                        title={
                                            "Выберите дату начала бронирования"
                                        }
                                        selected={startDate}
                                        onChange={(startDate) =>
                                            setStartDate(startDate)
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            {startDate && (
                                <Col>
                                    <Form.Group>
                                        <div>
                                            <Form.Label
                                                htmlFor={"endDate"}
                                                className={"fs-5"}
                                            >
                                                Дата окончания бронирования
                                            </Form.Label>
                                        </div>
                                        <DatePicker
                                            id={"endDate"}
                                            name={"startDate"}
                                            required
                                            inline
                                            minDate={minEndDate}
                                            maxDate={maxEndDate}
                                            dateFormat={"MM-dd HH:mm"}
                                            showTimeSelect
                                            timeIntervals={60}
                                            minTime={minEndDate}
                                            maxTime={maxEndDate}
                                            timeFormat={"HH:mm"}
                                            title={
                                                "Выберите дату окончания бронирования"
                                            }
                                            selected={endDate}
                                            onChange={(endDate) =>
                                                setEndDate(endDate)
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            )}
                        </Row>
                        {table && (
                            <Row>
                                <div className={"mt-3 bg-light fs-4"}>
                                    <div className={"px-3"}>
                                        Количество мест: {table.places}
                                    </div>
                                    {startDate && endDate && (
                                        <div className={"px-3"}>
                                            Стоимость:{" "}
                                            {(
                                                table.price *
                                                (endDate.getHours() -
                                                    startDate.getHours())
                                            ).toFixed(2)}{" "}
                                            руб.
                                        </div>
                                    )}
                                </div>
                                {table.reserved && (
                                    <div className={"text-danger fs-5 fw-bold"}>
                                        Столик уже забронирован!
                                    </div>
                                )}
                            </Row>
                        )}
                    </Card.Body>
                    <Card.Footer>
                        {feedback && (
                            <div className={"text-danger fw-bold fst-italic"}>
                                {feedback}
                            </div>
                        )}
                        <Button
                            variant={"success"}
                            className={"w-100"}
                            disabled={!isSubmitAllowed()}
                            onClick={handleSubmit}
                        >
                            Подтвердить бронирование
                        </Button>
                    </Card.Footer>
                </Form>
            </Card>
        </Collapse>
    );
}
