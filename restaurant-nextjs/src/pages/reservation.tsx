import { CreateReservationDto } from "@/common/dto/reservations/create-reservation.dto";
import { RoleName } from "@/common/dto/roles/role.name";
import { TableDto } from "@/common/dto/tables/table.dto";
import { UserDto } from "@/common/dto/users/user.dto";
import api from "@/common/util/api";
import session from "@/common/util/session";
import { ErrorHandlerComponent } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import { PageComponent } from "@/components/page/page.component";
import { Pageable, PageableData } from "@/components/page/pagination.component";
import { SpinnerComponent } from "@/components/page/spinner.component";
import { ReservationFormComponent } from "@/components/reservation/reservation-form.component";
import { RestaurantSceneComponent } from "@/components/reservation/restaurant-scene.component";
import styles from "@/styles/reservation.module.sass";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toast } from "react-bootstrap";

export type ReservableTableDto = TableDto & {
    reserved: boolean;
};

export default function Reservation() {
    const [error, setError] = useState<Error>();
    const [tables, setTables] = useState<ReservableTableDto[]>();
    const [total, setTotal] = useState<number>();
    const [pageable, setPageable] = useState<Pageable>({ size: 20 });
    const [table, setTable] = useState<ReservableTableDto>();
    const [auth, setAuth] = useState<UserDto>();
    const [showReservation, setShowReservation] = useState(false);
    const [alertPrompt, setAlertPrompt] = useState(false);
    const [confirmPrompt, setConfirmPrompt] = useState<string>();
    const router = useRouter();
    const loadTables = async () => {
        try {
            const tablesData: PageableData<TableDto> = await api.get(
                "/api/tables",
                { params: { size: pageable.size } }
            );
            setTables(
                tablesData.content.map((table) => ({
                    ...table,
                    reserved: false,
                }))
            );
            setTotal(tablesData.total);
            setPageable(tablesData.pageable);
        } catch (error) {
            setError(error);
        }
    };
    const createReservation = async (reservationDto: CreateReservationDto) => {
        await api.post("/api/reservations", reservationDto);
        setAlertPrompt(true);
    };
    const authenticate = async () => {
        try {
            const authData: UserDto = await session.authenticate();
            setAuth(authData);
        } catch (error) {
            setError(error);
        }
    };
    useEffect(() => {
        authenticate();
    }, []);
    useEffect(() => {
        loadTables();
    }, [auth]);
    return (
        <ErrorHandlerComponent error={error}>
            <Head>
                <title>Reservation</title>
            </Head>
            <PageComponent setError={setError} auth={auth}>
                <div className={"d-flex flex-column flex-fill mx-4"}>
                    <div className={styles["alert"]}>
                        <Toast
                            show={!!confirmPrompt}
                            delay={3000}
                            onClose={() => setConfirmPrompt(null)}
                        >
                            <Toast.Header
                                closeButton={false}
                                className={"justify-content-center"}
                            >
                                <div className={"fs-5"}>Бронирование</div>
                            </Toast.Header>
                            <Toast.Body>
                                <div className={"text-center"}>
                                    {confirmPrompt}
                                </div>
                                <div
                                    className={"d-flex justify-content-center"}
                                >
                                    <Button
                                        variant={"primary"}
                                        size={"sm"}
                                        onClick={() => setConfirmPrompt(null)}
                                    >
                                        ОК
                                    </Button>
                                </div>
                            </Toast.Body>
                        </Toast>
                    </div>
                    <div className={styles["alert"]}>
                        <Toast
                            show={alertPrompt}
                            delay={3000}
                            autohide={true}
                            onClose={() => router.push("/")}
                        >
                            <Toast.Header
                                closeButton={false}
                                className={"justify-content-center"}
                            >
                                <div className={"fs-5"}>Бронирование</div>
                            </Toast.Header>
                            <Toast.Body>
                                <div className={"text-center"}>
                                    Столик забронирован!
                                </div>
                                <div
                                    className={"d-flex justify-content-center"}
                                >
                                    <Button
                                        variant={"primary"}
                                        size={"sm"}
                                        onClick={() => router.push("/")}
                                    >
                                        ОК
                                    </Button>
                                </div>
                            </Toast.Body>
                        </Toast>
                    </div>
                    <div className={"d-flex flex-column flex-fill"}>
                        <div
                            className={
                                "mt-3 border-3 border-bottom text-center text-white fs-2"
                            }
                        >
                            Бронирование
                        </div>
                        <div className={styles["table-list-wrap"]}>
                            {tables ? (
                                total > 0 ? (
                                    <>
                                        <div className={"flex-fill p-3"}>
                                            <RestaurantSceneComponent
                                                auth={auth}
                                                tables={tables}
                                                table={table}
                                                setTable={setTable}
                                            />
                                            <div
                                                className={
                                                    "d-flex justify-content-center"
                                                }
                                            >
                                                <ReservationFormComponent
                                                    setError={setError}
                                                    auth={auth}
                                                    showReservation={
                                                        showReservation
                                                    }
                                                    tables={tables}
                                                    table={table}
                                                    setTable={setTable}
                                                    createReservation={
                                                        createReservation
                                                    }
                                                />
                                            </div>
                                        </div>
                                        {!showReservation && (
                                            <div
                                                className={
                                                    "d-flex justify-content-center m-4"
                                                }
                                            >
                                                <Button
                                                    variant={"success"}
                                                    size={"lg"}
                                                    className={"w-50"}
                                                    onClick={() =>
                                                        [
                                                            RoleName.Client,
                                                            RoleName.Manager,
                                                            RoleName.Admin,
                                                        ].includes(auth.role)
                                                            ? auth.blocked
                                                                ? setConfirmPrompt(
                                                                      "Вы не сможете забронировать столик, так как ваш аккаунт заблокирован"
                                                                  )
                                                                : setShowReservation(
                                                                      !showReservation
                                                                  )
                                                            : setConfirmPrompt(
                                                                  "Вы не сможете забронировать столик пока не зарегистрируетесь"
                                                              )
                                                    }
                                                >
                                                    Забронировать столик
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div
                                        className={
                                            "d-flex justify-content-center align-items-center flex-fill"
                                        }
                                    >
                                        <div className={"text-center"}>
                                            <div className={"fs-3 text-white"}>
                                                Столы пока не добавлены
                                            </div>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <SpinnerComponent
                                    variant={"light"}
                                    size={"lg"}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </PageComponent>
        </ErrorHandlerComponent>
    );
}
