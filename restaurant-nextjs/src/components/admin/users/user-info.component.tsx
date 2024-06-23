import { RoleName } from "@/common/dto/roles/role.name";
import { UserDto } from "@/common/dto/users/user.dto";
import { Button } from "@/components/page/button.component";
import styles from "@/styles/admin.module.sass";

export interface UserInfoComponentProps {
    user: UserDto;
    editUser: () => void;
}

export function UserInfoComponent({ user, editUser }: UserInfoComponentProps) {
    return (
        <tr>
            <td className={"fw-semibold"}>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
                {user.phone ?? (
                    <span className={styles["null-table-cell"]}></span>
                )}
            </td>
            <td>{user.blocked ? "Заблокирован" : ""}</td>
            <td>{user.role}</td>
            <td>
                <div>
                    <div className={"d-flex justify-content-around float-end"}>
                        <Button
                            variant={"outline-primary"}
                            className={"mx-2"}
                            disabled={RoleName.Admin === user.role}
                            onClick={editUser}
                        >
                            Изменить
                        </Button>
                    </div>
                </div>
            </td>
        </tr>
    );
}
