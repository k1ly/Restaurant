import { UpdateUserDto } from "@/common/dto/users/update-user.dto";
import { UserDto } from "@/common/dto/users/user.dto";
import { BadRequestError } from "@/common/error/bad-request.error";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import clsx from "classnames";
import { useState } from "react";
import { Card, Form, InputGroup, Table } from "react-bootstrap";

export interface ProfileComponentProps {
    setError: ErrorHandler;
    auth: UserDto;
    updateUser: (userDto: UpdateUserDto) => Promise<void>;
}

export function ProfileComponent({
    setError,
    auth,
    updateUser,
}: ProfileComponentProps) {
    const [name, setName] = useState<string>(auth.name);
    const [email, setEmail] = useState<string>(auth.email);
    const [phone, setPhone] = useState<string>(auth.phone ?? "");
    const [editName, setEditName] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [editPhone, setEditPhone] = useState(false);
    const [validated, setValidated] = useState(false);
    const [feedback, setFeedback] = useState<string>();
    const isSubmitAllowed = () =>
        name !== auth.name || email !== auth.email || phone !== auth.phone;
    const handleSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (!e.currentTarget.form?.checkValidity()) {
            setValidated(true);
            return;
        }
        try {
            await updateUser({
                name,
                email,
                phone: phone !== "" ? phone : undefined,
            });
        } catch (error: any) {
            if (error instanceof BadRequestError) {
                console.error(error);
                setFeedback("Неверно введены данные!");
                return;
            }
            setError(error);
        }
    };
    return (
        <div
            className={
                "d-flex justify-content-center align-items-center flex-fill"
            }
        >
            <Card className={"mt-4 w-50 shadow"}>
                <Card.Body>
                    <Form validated={validated}>
                        <Table striped={true}>
                            <tbody>
                                <tr>
                                    <td>
                                        <Form.Label
                                            htmlFor={"login"}
                                            className={"fs-5"}
                                        >
                                            Логин
                                        </Form.Label>
                                    </td>
                                    <td>
                                        <Form.Control
                                            id={"login"}
                                            plaintext={true}
                                            name={"login"}
                                            value={auth.login}
                                            disabled={true}
                                            className={"ps-2"}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Form.Label
                                            htmlFor={"name"}
                                            className={"fs-5"}
                                        >
                                            Имя
                                        </Form.Label>
                                    </td>
                                    <td>
                                        <InputGroup>
                                            <Form.Control
                                                id={"name"}
                                                type={"text"}
                                                name={"name"}
                                                required
                                                minLength={4}
                                                maxLength={40}
                                                pattern={
                                                    "^[a-zA-Z]+([. '\\-][a-zA-Z]+)*$"
                                                }
                                                title={
                                                    "Не должно содержать цифр или специальных знаков"
                                                }
                                                value={name}
                                                disabled={!editName}
                                                className={clsx({
                                                    "ps-2": !editName,
                                                })}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                            />
                                            <Button
                                                variant={"outline-secondary"}
                                                onClick={() =>
                                                    setEditName(!editName)
                                                }
                                            >
                                                Изменить имя
                                            </Button>
                                        </InputGroup>
                                        <div className={"invalid-feedback"}>
                                            Неверно указано имя
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Form.Label
                                            htmlFor={"email"}
                                            className={"fs-5"}
                                        >
                                            Почта
                                        </Form.Label>
                                    </td>
                                    <td>
                                        <InputGroup>
                                            <Form.Control
                                                id={"email"}
                                                type={"email"}
                                                name={"email"}
                                                required
                                                minLength={3}
                                                maxLength={320}
                                                title={
                                                    "Должен содержать символ @, а также не менее 8 символов"
                                                }
                                                value={email}
                                                disabled={!editEmail}
                                                className={clsx({
                                                    "ps-2": !editEmail,
                                                })}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                            />
                                            <Button
                                                variant={"outline-secondary"}
                                                onClick={() =>
                                                    setEditEmail(!editEmail)
                                                }
                                            >
                                                Изменить почту
                                            </Button>
                                        </InputGroup>
                                        <div className={"invalid-feedback"}>
                                            Неверно указана почта
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Form.Label
                                            htmlFor={"phone"}
                                            className={"fs-5"}
                                        >
                                            Телефон
                                        </Form.Label>
                                    </td>
                                    <td>
                                        <InputGroup>
                                            <Form.Control
                                                id={"phone"}
                                                type={"tel"}
                                                name={"phone"}
                                                pattern={
                                                    "^((\\+\\d{1,3}( )?)?((\\(\\d{1,3}\\))|\\d{1,3})[\\- ]?\\d{3,4}[\\- ]?\\d{4})?$"
                                                }
                                                title={
                                                    "Должен быть введен номер телефона с кодом страны"
                                                }
                                                value={phone}
                                                disabled={!editPhone}
                                                className={clsx({
                                                    "ps-2": !editPhone,
                                                })}
                                                onChange={(e) =>
                                                    setPhone(e.target.value)
                                                }
                                            />
                                            <Button
                                                variant={"outline-secondary"}
                                                onClick={() =>
                                                    setEditPhone(!editPhone)
                                                }
                                            >
                                                Изменить телефон
                                            </Button>
                                        </InputGroup>
                                        <div className={"invalid-feedback"}>
                                            Неверно указан телефон
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        <div>
                            {feedback && (
                                <div
                                    className={"text-danger fw-bold fst-italic"}
                                >
                                    {feedback}
                                </div>
                            )}
                            <Button
                                variant={"secondary"}
                                disabled={!isSubmitAllowed()}
                                onClick={handleSubmit}
                            >
                                Сохранить изменения
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}
