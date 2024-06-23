import { ReservationDto } from "@/common/dto/reservations/reservation.dto";
import { UserDto } from "@/common/dto/users/user.dto";
import api from "@/common/util/api";
import config, { ConfigKey } from "@/common/util/config";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { ReservationInfoComponent } from "@/components/managing/reservation-info.component";
import {
    Pageable,
    PageableData,
    PaginationComponent,
    SortOrder,
} from "@/components/page/pagination.component";
import { SpinnerComponent } from "@/components/page/spinner.component";
import { useEffect, useRef, useState } from "react";
import { Col, Row, Stack } from "react-bootstrap";
import { Socket, io } from "socket.io-client";

export interface ReservationListComponentProps {
    setError: ErrorHandler;
    auth: UserDto;
}

export function ReservationListComponent({
    setError,
    auth,
}: ReservationListComponentProps) {
    const [reservations, setReservations] = useState<ReservationDto[]>();
    const [total, setTotal] = useState<number>();
    const [pageable, setPageable] = useState<Pageable>({
        sort: "startDate",
        order: SortOrder.Desc,
    });
    const socketRef = useRef<Socket>();
    const loadReservations = async () => {
        try {
            const minStartDate = new Date();
            minStartDate.setHours(9, 0, 0, 0);
            const maxStartDate = new Date(minStartDate);
            maxStartDate.setHours(21 + 24);
            const reservationsData: PageableData<ReservationDto> =
                await api.get("/api/reservations", {
                    params: {
                        minStartDate,
                        maxStartDate,
                        page: pageable.page,
                        sort: `${pageable.sort},${pageable.order}`,
                    },
                });
            setReservations(reservationsData.content);
            setTotal(reservationsData.total);
            setPageable(reservationsData.pageable);
        } catch (error: any) {
            setError(error);
        }
    };
    useEffect(() => {
        loadReservations();
        socketRef.current = io(config.get(ConfigKey.ApiUrl));
        socketRef.current.on("reservations", () => {
            loadReservations();
        });
        return () => {
            socketRef.current.off("reservations");
            socketRef.current.close();
        };
    }, [auth]);
    return (
        <Row className={"flex-nowrap flex-fill g-0"}>
            <Col className={"d-flex flex-column flex-fill"}>
                <div className={"d-flex flex-column flex-fill pt-4"}>
                    {reservations ? (
                        total > 0 ? (
                            <>
                                <PaginationComponent
                                    total={total}
                                    pageable={pageable}
                                    setPage={(page) => {
                                        pageable.page = page;
                                        loadReservations();
                                    }}
                                />
                                <Stack>
                                    {reservations.map((reservation) => (
                                        <ReservationInfoComponent
                                            key={reservation.id}
                                            setError={setError}
                                            reservation={reservation}
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
                                    Список забронированных до завтра столиков
                                    пуст
                                </div>
                            </div>
                        )
                    ) : (
                        <SpinnerComponent variant={"light"} size={"lg"} />
                    )}
                </div>
            </Col>
        </Row>
    );
}
