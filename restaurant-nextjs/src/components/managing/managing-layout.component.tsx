import { RoleName } from "@/common/dto/roles/role.name";
import { UserDto } from "@/common/dto/users/user.dto";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { PageComponent } from "@/components/page/page.component";
import styles from "@/styles/managing.module.sass";
import clsx from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav } from "react-bootstrap";

export interface ManagingLayoutProps {
    setError: ErrorHandler;
    auth: UserDto;
    children: React.ReactNode;
}

export function ManagingLayoutComponent({
    setError,
    auth,
    children,
}: ManagingLayoutProps) {
    const path = usePathname();
    return (
        <PageComponent setError={setError} auth={auth}>
            {[RoleName.Manager, RoleName.Admin].includes(auth?.role) ? (
                <div className={"d-flex flex-column flex-fill mx-4"}>
                    <div
                        className={
                            "mt-3 border-3 border-bottom text-start text-white fs-2 rounded-top"
                        }
                    >
                        Управление
                    </div>
                    <div className={"d-flex flex-column flex-fill pt-3"}>
                        <Nav
                            className={clsx(
                                "nav-tabs",
                                styles["nav-tab-header"]
                            )}
                        >
                            <Nav.Item>
                                <Link
                                    href={"/managing/orders"}
                                    className={"text-decoration-none"}
                                >
                                    <Nav.Link
                                        as={"div"}
                                        className={clsx(
                                            styles["nav-tab-link"],
                                            {
                                                [styles["active"]]:
                                                    path === "/managing/orders",
                                            }
                                        )}
                                    >
                                        Заказы
                                    </Nav.Link>
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link
                                    href={"/managing/reservation"}
                                    className={"text-decoration-none"}
                                >
                                    <Nav.Link
                                        as={"div"}
                                        className={clsx(
                                            styles["nav-tab-link"],
                                            {
                                                [styles["active"]]:
                                                    path ===
                                                    "/managing/reservation",
                                            }
                                        )}
                                    >
                                        Бронирование
                                    </Nav.Link>
                                </Link>
                            </Nav.Item>
                        </Nav>
                        <div className={styles["list-wrap"]}>{children}</div>
                    </div>
                </div>
            ) : (
                <div
                    className={
                        "d-flex justify-content-center align-items-center flex-fill"
                    }
                >
                    <div className={"text-center text-white fs-4"}>
                        У вас недостаточно привелегий просматривать эту страницу
                    </div>
                </div>
            )}
        </PageComponent>
    );
}
