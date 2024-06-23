import { AdminUpdateUserDto } from "@/common/dto/users/admin-update-user.dto";
import { UserDto } from "@/common/dto/users/user.dto";
import api from "@/common/util/api";
import { UserFormComponent } from "@/components/admin/users/user-form.component";
import { UserInfoComponent } from "@/components/admin/users/user-info.component";
import { ErrorHandler } from "@/components/error/error-handler.component";
import {
    Pageable,
    PageableData,
    PaginationComponent,
    SortOrder,
} from "@/components/page/pagination.component";
import { SearchComponent } from "@/components/page/search.component";
import { SpinnerComponent } from "@/components/page/spinner.component";
import styles from "@/styles/admin.module.sass";
import { useEffect, useState } from "react";
import { Table, Toast } from "react-bootstrap";

export enum UserSort {
    Id = "id",
    Name = "name",
    Email = "email",
    Phone = "phone",
    Blocked = "blocked",
    Role = "role.id",
}

export interface UserListComponentProps {
    setError: ErrorHandler;
}

export function UserListComponent({ setError }: UserListComponentProps) {
    const [users, setUsers] = useState<UserDto[]>();
    const [total, setTotal] = useState<number>();
    const [pageable, setPageable] = useState<Pageable>({ size: 10 });
    const [user, setUser] = useState<UserDto>();
    const [search, setSearch] = useState("");
    const [notification, setNotification] = useState<string>();
    const loadUsers = async () => {
        try {
            const usersData: PageableData<UserDto> = await api.get(
                "/api/users",
                {
                    params: {
                        filter: search !== "" ? search : undefined,
                        page: pageable.page,
                        size: pageable.size,
                        sort:
                            pageable.sort && pageable.order
                                ? `${pageable.sort},${pageable.order}`
                                : undefined,
                    },
                }
            );
            setUsers(usersData.content);
            setTotal(usersData.total);
            setPageable(usersData.pageable);
        } catch (error: any) {
            setError(error);
        }
    };
    const handleSort = (sort: string) => {
        pageable.sort = sort;
        pageable.order =
            pageable.sort !== sort || pageable.order !== SortOrder.Asc
                ? SortOrder.Asc
                : SortOrder.Desc;
        loadUsers();
    };
    const editUser = async (id: number, userDto: AdminUpdateUserDto) => {
        await api.patch(`/api/users/${id}`, userDto);
        setUser(null);
        setNotification("Пользователь успешно изменен!");
        loadUsers();
    };
    useEffect(() => {
        loadUsers();
    }, []);
    return (
        <div className={"d-flex flex-column flex-fill mx-4"}>
            <Toast
                show={!!notification}
                delay={5000}
                autohide={true}
                className={styles["notification"]}
                onClose={() => setNotification(null)}
            >
                <Toast.Header className={"justify-content-center"}>
                    <div className={"fs-5"}>Администратор: пользователи</div>
                </Toast.Header>
                <Toast.Body>{notification}</Toast.Body>
            </Toast>
            <UserFormComponent
                setError={setError}
                user={user}
                editUser={(userDto) => editUser(user?.id, userDto)}
                onClose={() => setUser(null)}
            />
            <div className={"p-3"}>
                <SearchComponent
                    search={search}
                    setSearch={setSearch}
                    submit={() => {
                        pageable.page = 0;
                        loadUsers();
                    }}
                />
            </div>
            {users ? (
                total > 0 ? (
                    <>
                        <PaginationComponent
                            total={total}
                            pageable={pageable}
                            setPage={(page) => {
                                pageable.page = page;
                                loadUsers();
                            }}
                        />
                        <div className={"d-flex flex-column flex-fill"}>
                            <Table bordered={true} striped={true} hover={true}>
                                <thead className={"table-light fw-bold"}>
                                    <tr>
                                        <th
                                            scope={"col"}
                                            className={styles["pointer"]}
                                            onClick={() =>
                                                handleSort(UserSort.Id)
                                            }
                                        >
                                            ID
                                            {pageable.sort === UserSort.Id
                                                ? pageable.order ===
                                                  SortOrder.Asc
                                                    ? " ▲"
                                                    : " ▼"
                                                : ""}
                                        </th>
                                        <th
                                            scope={"col"}
                                            className={styles["pointer"]}
                                            onClick={() =>
                                                handleSort(UserSort.Name)
                                            }
                                        >
                                            Имя
                                            {pageable.sort === UserSort.Name
                                                ? pageable.order ===
                                                  SortOrder.Asc
                                                    ? " ▲"
                                                    : " ▼"
                                                : ""}
                                        </th>
                                        <th
                                            scope={"col"}
                                            className={styles["pointer"]}
                                            onClick={() =>
                                                handleSort(UserSort.Email)
                                            }
                                        >
                                            Почта
                                            {pageable.sort === UserSort.Email
                                                ? pageable.order ===
                                                  SortOrder.Asc
                                                    ? " ▲"
                                                    : " ▼"
                                                : ""}
                                        </th>
                                        <th
                                            scope={"col"}
                                            className={styles["pointer"]}
                                            onClick={() =>
                                                handleSort(UserSort.Phone)
                                            }
                                        >
                                            Телефон
                                            {pageable.sort === UserSort.Phone
                                                ? pageable.order ===
                                                  SortOrder.Asc
                                                    ? " ▲"
                                                    : " ▼"
                                                : ""}
                                        </th>
                                        <th
                                            scope={"col"}
                                            className={styles["pointer"]}
                                            onClick={() =>
                                                handleSort(UserSort.Blocked)
                                            }
                                        >
                                            Статус
                                            {pageable.sort === UserSort.Blocked
                                                ? pageable.order ===
                                                  SortOrder.Asc
                                                    ? " ▲"
                                                    : " ▼"
                                                : ""}
                                        </th>
                                        <th
                                            scope={"col"}
                                            className={styles["pointer"]}
                                            onClick={() =>
                                                handleSort(UserSort.Role)
                                            }
                                        >
                                            Роль
                                            {pageable.sort === UserSort.Role
                                                ? pageable.order ===
                                                  SortOrder.Asc
                                                    ? " ▲"
                                                    : " ▼"
                                                : ""}
                                        </th>
                                        <th scope={"col"}></th>
                                    </tr>
                                </thead>
                                <tbody className={"table-group-divider"}>
                                    {users.map((user) => (
                                        <UserInfoComponent
                                            key={user.id}
                                            user={user}
                                            editUser={() => setUser(user)}
                                        />
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </>
                ) : (
                    <div
                        className={
                            "d-flex justify-content-center align-items-center flex-fill"
                        }
                    >
                        <div className={"fs-3"}>Список пользователей пуст</div>
                    </div>
                )
            ) : (
                <SpinnerComponent size={"lg"} />
            )}
        </div>
    );
}
