import { UserDto } from "@/common/dto/users/user.dto";
import session from "@/common/util/session";
import { ErrorHandlerComponent } from "@/components/error/error-handler.component";
import { PageComponent } from "@/components/page/page.component";
import styles from "@/styles/contacts.module.sass";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Card, Col, Row, Table } from "react-bootstrap";

export interface ContactAddress {
    country: string;
    locality: string;
    street: string;
    house: string;
}

export interface ContactWorkTime {
    days: string;
    from: string;
    to: string;
}

export interface ContactsData {
    addressList: ContactAddress[];
    emailList: string[];
    phoneList: string[];
    workTimeList: ContactWorkTime[];
}

export interface ContactsProps {
    contacts: ContactsData;
}

export const getServerSideProps: GetServerSideProps<ContactsProps> = async () => {
    const contacts = await import("./../../public/contacts.json");
    return { props: { contacts: contacts.default } };
};

export default function Contacts({ contacts }: ContactsProps) {
    const [error, setError] = useState<Error>();
    const [auth, setAuth] = useState<UserDto>();
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
    return (
        <ErrorHandlerComponent error={error}>
            <Head>
                <title>Contacts</title>
            </Head>
            <PageComponent setError={setError} auth={auth}>
                <div className={"d-flex flex-column flex-fill"}>
                    <div
                        className={
                            "d-flex justify-content-center align-items-center flex-fill m-4"
                        }
                    >
                        <Row>
                            <Col>
                                <Card className={"shadow"}>
                                    <Card.Header>
                                        <Card.Title
                                            className={
                                                "text-center fs-2 fw-semibold"
                                            }
                                        >
                                            Контакты
                                        </Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        {contacts && (
                                            <Table striped={true}>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div
                                                                className={
                                                                    "fs-5 fw-semibold fst-italic"
                                                                }
                                                            >
                                                                Адрес
                                                            </div>
                                                        </td>
                                                        <td
                                                            className={
                                                                "text-end"
                                                            }
                                                        >
                                                            {contacts.addressList.map(
                                                                (
                                                                    address,
                                                                    i: number
                                                                ) => (
                                                                    <div
                                                                        key={i}
                                                                    >
                                                                        {
                                                                            address.locality
                                                                        }
                                                                        ,{" "}
                                                                        {
                                                                            address.country
                                                                        }
                                                                        ,{" "}
                                                                        {
                                                                            address.street
                                                                        }{" "}
                                                                        {
                                                                            address.house
                                                                        }
                                                                    </div>
                                                                )
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <div
                                                                className={
                                                                    "fs-5 fw-semibold fst-italic"
                                                                }
                                                            >
                                                                Почта
                                                            </div>
                                                        </td>
                                                        <td
                                                            className={
                                                                "text-end"
                                                            }
                                                        >
                                                            {contacts.emailList.map(
                                                                (
                                                                    email,
                                                                    i: number
                                                                ) => (
                                                                    <div
                                                                        key={i}
                                                                    >
                                                                        {email}
                                                                    </div>
                                                                )
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <div
                                                                className={
                                                                    "fs-5 fw-semibold fst-italic"
                                                                }
                                                            >
                                                                Телефон
                                                            </div>
                                                        </td>
                                                        <td
                                                            className={
                                                                "text-end"
                                                            }
                                                        >
                                                            {contacts.phoneList.map(
                                                                (
                                                                    phone,
                                                                    i: number
                                                                ) => (
                                                                    <div
                                                                        key={i}
                                                                    >
                                                                        {phone}
                                                                    </div>
                                                                )
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <div
                                                                className={
                                                                    "fs-5 fw-semibold fst-italic"
                                                                }
                                                            >
                                                                Время работы
                                                            </div>
                                                        </td>
                                                        <td
                                                            className={
                                                                "text-end"
                                                            }
                                                        >
                                                            {contacts.workTimeList.map(
                                                                (
                                                                    workTime,
                                                                    i: number
                                                                ) => (
                                                                    <div
                                                                        key={i}
                                                                    >
                                                                        {
                                                                            workTime.days
                                                                        }
                                                                        :{" "}
                                                                        {
                                                                            workTime.from
                                                                        }{" "}
                                                                        -{" "}
                                                                        {
                                                                            workTime.to
                                                                        }
                                                                    </div>
                                                                )
                                                            )}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col>
                                <iframe
                                    src={
                                        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2350.7768896912726!2d27.49461111197239!3d53.900169398173226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbc5528b42fbfd%3A0x6073bd9964b8ccee!2z0L_RgNC-0YHQv9C10LrRgiDQn9GD0YjQutC40L3QsCAyNSwg0JzQuNC90YHQuiwg0JzQuNC90YHQutCw0Y8g0L7QsdC70LDRgdGC0Yw!5e0!3m2!1sru!2sby!4v1702322306264!5m2!1sru!2sby"
                                    }
                                    loading={"lazy"}
                                    referrerPolicy={"no-referrer"}
                                    className={styles["map"]}
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
            </PageComponent>
        </ErrorHandlerComponent>
    );
}
