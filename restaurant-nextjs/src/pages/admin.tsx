import { RoleName } from "@/common/dto/roles/role.name";
import { UserDto } from "@/common/dto/users/user.dto";
import { ForbiddenError } from "@/common/error/forbidden.error";
import session from "@/common/util/session";
import { CategoryListComponent } from "@/components/admin/categories/category-list.component";
import { DishListComponent } from "@/components/admin/dishes/dish-list.component";
import { ReviewListComponent } from "@/components/admin/reviews/review-list.component";
import { TableListComponent } from "@/components/admin/tables/table-list.component";
import { UserListComponent } from "@/components/admin/users/user-list.component";
import { ErrorHandlerComponent } from "@/components/error/error-handler.component";
import { PageComponent } from "@/components/page/page.component";
import styles from "@/styles/admin.module.sass";
import clsx from "classnames";
import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { Col, Nav, Row } from "react-bootstrap";

export enum Tab {
    Dishes = "dishes",
    Categories = "categories",
    Users = "users",
    Reviews = "reviews",
    Tables = "tables",
}

export default function Admin() {
    const [error, setError] = useState<Error>();
    const [auth, setAuth] = useState<UserDto>();
    const query = useSearchParams();
    const authenticate = async () => {
        try {
            const authData: UserDto = await session.authenticate();
            RoleName.Admin === authData.role
                ? setAuth(authData)
                : setError(new ForbiddenError("Admin"));
        } catch (error: any) {
            setError(error);
        }
    };
    useEffect(() => {
        authenticate();
    }, []);
    return (
        <ErrorHandlerComponent error={error}>
            <Head>
                <title>Admin</title>
            </Head>
            <PageComponent setError={setError} auth={auth}>
                {RoleName.Admin === auth?.role ? (
                    <Row className={"flex-nowrap flex-fill g-0"}>
                        <Col md={3} className={"d-flex flex-column flex-fill"}>
                            <div className={styles["tab-list"]}>
                                <Nav className={"flex-column"}>
                                    <Nav.Item>
                                        <Link
                                            href={`?${queryString.stringify({
                                                tab: Tab.Dishes,
                                            })}`}
                                            className={"text-decoration-none"}
                                        >
                                            <Nav.Link
                                                as={"div"}
                                                className={clsx(
                                                    styles["admin-nav-link"],
                                                    {
                                                        [styles["active"]]:
                                                            query.get("tab") ===
                                                            Tab.Dishes,
                                                    }
                                                )}
                                            >
                                                Блюда
                                            </Nav.Link>
                                        </Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Link
                                            href={`?${queryString.stringify({
                                                tab: Tab.Categories,
                                            })}`}
                                            className={"text-decoration-none"}
                                        >
                                            <Nav.Link
                                                as={"div"}
                                                className={clsx(
                                                    styles["admin-nav-link"],
                                                    {
                                                        [styles["active"]]:
                                                            query.get("tab") ===
                                                            Tab.Categories,
                                                    }
                                                )}
                                            >
                                                Категории
                                            </Nav.Link>
                                        </Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Link
                                            href={`?${queryString.stringify({
                                                tab: Tab.Users,
                                            })}`}
                                            className={"text-decoration-none"}
                                        >
                                            <Nav.Link
                                                as={"div"}
                                                className={clsx(
                                                    styles["admin-nav-link"],
                                                    {
                                                        [styles["active"]]:
                                                            query.get("tab") ===
                                                            Tab.Users,
                                                    }
                                                )}
                                            >
                                                Пользователи
                                            </Nav.Link>
                                        </Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Link
                                            href={`?${queryString.stringify({
                                                tab: Tab.Reviews,
                                            })}`}
                                            className={"text-decoration-none"}
                                        >
                                            <Nav.Link
                                                as={"div"}
                                                className={clsx(
                                                    styles["admin-nav-link"],
                                                    {
                                                        [styles["active"]]:
                                                            query.get("tab") ===
                                                            Tab.Reviews,
                                                    }
                                                )}
                                            >
                                                Отзывы
                                            </Nav.Link>
                                        </Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Link
                                            href={`?${queryString.stringify({
                                                tab: Tab.Tables,
                                            })}`}
                                            className={"text-decoration-none"}
                                        >
                                            <Nav.Link
                                                as={"div"}
                                                className={clsx(
                                                    styles["admin-nav-link"],
                                                    {
                                                        [styles["active"]]:
                                                            query.get("tab") ===
                                                            Tab.Tables,
                                                    }
                                                )}
                                            >
                                                Столики
                                            </Nav.Link>
                                        </Link>
                                    </Nav.Item>
                                </Nav>
                                <div
                                    className={styles["tab-list-footer"]}
                                ></div>
                            </div>
                        </Col>
                        <Col className={"d-flex flex-column flex-fill"}>
                            {query.get("tab") ? (
                                <div className={styles["admin-content"]}>
                                    {
                                        {
                                            dishes: (
                                                <DishListComponent
                                                    setError={setError}
                                                />
                                            ),
                                            categories: (
                                                <CategoryListComponent
                                                    setError={setError}
                                                />
                                            ),
                                            users: (
                                                <UserListComponent
                                                    setError={setError}
                                                />
                                            ),
                                            reviews: (
                                                <ReviewListComponent
                                                    setError={setError}
                                                />
                                            ),
                                            tables: (
                                                <TableListComponent
                                                    setError={setError}
                                                />
                                            ),
                                        }[query.get("tab")]
                                    }
                                </div>
                            ) : (
                                <div
                                    className={
                                        "d-flex justify-content-center align-items-center flex-fill"
                                    }
                                >
                                    <div
                                        className={
                                            "text-center text-white fs-4"
                                        }
                                    >
                                        Выберите вкладку для просмотра
                                    </div>
                                </div>
                            )}
                        </Col>
                    </Row>
                ) : (
                    <div
                        className={
                            "d-flex justify-content-center align-items-center flex-fill"
                        }
                    >
                        <div className={"text-center text-white fs-4"}>
                            У вас недостаточно привелегий просматривать эту
                            страницу
                        </div>
                    </div>
                )}
            </PageComponent>
        </ErrorHandlerComponent>
    );
}
