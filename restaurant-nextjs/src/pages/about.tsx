import { UserDto } from "@/common/dto/users/user.dto";
import session from "@/common/util/session";
import { ErrorHandlerComponent } from "@/components/error/error-handler.component";
import { PageComponent } from "@/components/page/page.component";
import styles from "@/styles/about.module.sass";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";

export default function About() {
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
                <title>About</title>
            </Head>
            <PageComponent setError={setError} auth={auth}>
                <div className={"d-flex flex-column flex-fill"}>
                    <div
                        className={
                            "d-flex justify-content-center align-items-center flex-fill m-5"
                        }
                    >
                        <div className={styles["about"]}>
                            <Row>
                                <Col md={7}>
                                    <div>
                                        Открывайте для себя не просто ресторан,
                                        а настоящую кулинарную гавань в сердце
                                        города. Наше заведение сочетает в себе
                                        шик современного дизайна, теплоту
                                        домашней атмосферы и эксклюзивные виды
                                        на набережную, создавая идеальное место
                                        для встреч с друзьями, романтических
                                        ужинов или деловых переговоров.
                                    </div>
                                </Col>
                                <Col md={5}>
                                    <Image
                                        className={"mt-3 rounded shadow"}
                                        src={"/img/cook.jpg"}
                                        rounded
                                        width={300}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    Мы стремимся к тому, чтобы каждый гость
                                    чувствовал себя как дома, наслаждаясь
                                    блюдами, которые созданы из самых
                                    качественных продуктов. Наш шеф-повар с
                                    мировым именем приглашает вас в путешествие
                                    по миру вкусов, где каждое блюдо
                                    рассказывает свою уникальную историю.
                                    Приходите и убедитесь, что качество и
                                    постоянство наших блюд действительно не
                                    имеют аналогов во всем мире.
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </PageComponent>
        </ErrorHandlerComponent>
    );
}
