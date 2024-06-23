import { RoleDto } from "@/common/dto/roles/role.dto";
import { AdminUpdateUserDto } from "@/common/dto/users/admin-update-user.dto";
import { UserDto } from "@/common/dto/users/user.dto";
import { BadRequestError } from "@/common/error/bad-request.error";
import api from "@/common/util/api";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";

export interface UserFormComponentProps {
    setError: ErrorHandler;
    user: UserDto;
    editUser: (userDto: AdminUpdateUserDto) => void;
    onClose: () => void;
}

export function UserFormComponent({
    setError,
    user,
    editUser,
    onClose,
}: UserFormComponentProps) {
    const [roles, setRoles] = useState<RoleDto[]>();
    const [role, setRole] = useState(0);
    const [blocked, setBlocked] = useState(false);
    const [validated, setValidated] = useState(false);
    const [feedback, setFeedback] = useState<string>();
    const loadRoles = async () => {
        try {
            const rolesData: RoleDto[] = await api.get("/api/roles");
            setRoles(rolesData);
        } catch (error: any) {
            setError(error);
        }
    };
    const loadRole = async () => {
        try {
            const roleData: RoleDto = await api.get("/api/roles/find", {
                params: {
                    name: user.role,
                },
            });
            setRole(roleData.id);
        } catch (error: any) {
            setError(error);
        }
    };
    const isSubmitAllowed = () => role > 0;
    const handleSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (!e.currentTarget.form?.checkValidity()) {
            setValidated(true);
            return;
        }
        try {
            editUser({ blocked, role });
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
        loadRoles();
    }, []);
    useEffect(() => {
        if (user) {
            loadRole();
            setBlocked(user.blocked);
            setValidated(false);
            setFeedback(null);
        }
    }, [user]);
    return (
        <Modal
            show={!!user}
            onHide={onClose}
            backdrop={"static"}
            keyboard={false}
            centered={true}
        >
            {user && (
                <Form validated={validated}>
                    <Modal.Header closeButton={true}>
                        <Modal.Title className={"fs-4"}>
                            {user.name}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {roles && (
                            <Form.Group>
                                <Form.Label
                                    htmlFor={"userRole"}
                                    className={"fs-5"}
                                >
                                    Роль
                                </Form.Label>
                                <Form.Select
                                    id={"userRole"}
                                    name={"role"}
                                    required
                                    title={"Выберите роль пользователя"}
                                    value={role}
                                    onChange={(e) =>
                                        setRole(Number(e.target.value))
                                    }
                                >
                                    <option value={0} disabled={true}>
                                        ...
                                    </option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        )}
                        <Form.Check className={"my-2"}>
                            <Form.Check.Input
                                id={"userBlocked"}
                                type={"checkbox"}
                                name={"blocked"}
                                value={"true"}
                                checked={blocked}
                                onChange={(e) => setBlocked(e.target.checked)}
                            />
                            <Form.Check.Label
                                htmlFor={"userBlocked"}
                                className={"fs-5"}
                            >
                                Пользователь заблокирован
                            </Form.Check.Label>
                        </Form.Check>
                    </Modal.Body>
                    <Modal.Footer>
                        {feedback && (
                            <div className={"text-danger fw-bold fst-italic"}>
                                {feedback}
                            </div>
                        )}
                        <Button
                            variant={"primary"}
                            className={"w-100"}
                            disabled={!isSubmitAllowed()}
                            onClick={handleSubmit}
                        >
                            Изменить
                        </Button>
                    </Modal.Footer>
                </Form>
            )}
        </Modal>
    );
}
