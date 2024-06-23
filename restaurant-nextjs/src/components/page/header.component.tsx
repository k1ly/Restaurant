import { RoleName } from "@/common/dto/roles/role.name";
import { UserDto } from "@/common/dto/users/user.dto";
import session from "@/common/util/session";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import styles from "@/styles/page.module.sass";
import clsx from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createRef, useEffect } from "react";
import { Dropdown, Image, Nav, Navbar } from "react-bootstrap";

export interface HeaderComponentProps {
    setError: ErrorHandler;
    auth: UserDto;
    scrollOffset: number;
    headerHeight: number;
    setHeaderHeight: (headerHeight: number) => void;
}

export function HeaderComponent({
    setError,
    auth,
    scrollOffset,
    headerHeight,
    setHeaderHeight,
}: HeaderComponentProps) {
    const header = createRef<HTMLElement>();
    const router = useRouter();
    const handleLogout = async () => {
        try {
            await session.logout();
            router.push("/");
        } catch (error: any) {
            setError(error);
        }
    };
    useEffect(() => {
        setHeaderHeight(header.current.clientHeight);
    }, [scrollOffset]);
    return (
        <header
            ref={header}
            className={clsx(styles["header-container"], {
                [styles["scrolled"]]: scrollOffset > headerHeight,
            })}
        >
            <Navbar className={styles["header"]}>
                <Navbar.Brand>
                    <Link href={"/"} className={styles["logo"]}>
                        The Restaurant
                    </Link>
                </Navbar.Brand>
                <Nav className={styles["header-nav-bar"]}>
                    <Nav.Item>
                        <Link href={"/"} className={styles["nav-bar-link"]}>
                            ГЛАВНАЯ
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link href={"/menu"} className={styles["nav-bar-link"]}>
                            МЕНЮ
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link
                            href={"/reservation"}
                            className={styles["nav-bar-link"]}
                        >
                            БРОНИРОВАНИЕ
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link
                            href={"/contacts"}
                            className={styles["nav-bar-link"]}
                        >
                            КОНТАКТЫ
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link
                            href={"/about"}
                            className={styles["nav-bar-link"]}
                        >
                            О НАС
                        </Link>
                    </Nav.Item>
                </Nav>
                <div className={styles["header-actions"]}>
                    {auth && (
                        <>
                            <div className={styles["cart"]}>
                                <Link href={"/cart"}>
                                    <Image src={"/img/icon/cart.svg"} />
                                </Link>
                            </div>
                            {RoleName.Guest === auth.role && (
                                <div className={styles["guest-actions"]}>
                                    <Link href={"/register"}>
                                        <Button variant={"success"}>
                                            Регистрация
                                        </Button>
                                    </Link>
                                    <Link href={"/login"}>
                                        <Button variant={"outline-success"}>
                                            Вход
                                        </Button>
                                    </Link>
                                </div>
                            )}
                            {[
                                RoleName.Client,
                                RoleName.Manager,
                                RoleName.Admin,
                            ].includes(auth.role) && (
                                <Dropdown>
                                    <Dropdown.Toggle variant={"outline-light"}>
                                        <div
                                            className={
                                                "d-inline-flex fs-5 fw-semibold"
                                            }
                                        >
                                            <div
                                                className={
                                                    styles["user-avatar"]
                                                }
                                            >
                                                {auth.name[0].toUpperCase()}
                                            </div>
                                            <span className={"mx-2 pt-1"}>
                                                {auth.name}
                                            </span>
                                        </div>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            href={"/account"}
                                            className={
                                                "fw-semibold text-center text-decoration-none"
                                            }
                                        >
                                            Личный кабинет
                                        </Dropdown.Item>
                                        {[
                                            RoleName.Manager,
                                            RoleName.Admin,
                                        ].includes(auth.role) && (
                                            <Dropdown.Item
                                                href={"/managing"}
                                                className={
                                                    "fw-semibold text-center text-decoration-none"
                                                }
                                            >
                                                Управление
                                            </Dropdown.Item>
                                        )}
                                        {RoleName.Admin === auth.role && (
                                            <Dropdown.Item
                                                href={"/admin"}
                                                className={
                                                    "fw-semibold text-center text-decoration-none"
                                                }
                                            >
                                                Администрация
                                            </Dropdown.Item>
                                        )}
                                        <Dropdown.Item>
                                            <Button
                                                variant={"outline-danger"}
                                                size={"sm"}
                                                onClick={handleLogout}
                                            >
                                                Выйти из аккаунта
                                            </Button>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}
                        </>
                    )}
                </div>
            </Navbar>
        </header>
    );
}
