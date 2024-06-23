import { CreateUserDto } from "@/common/dto/users/create-user.dto";
import { BadRequestError } from "@/common/error/bad-request.error";
import { ConflictError } from "@/common/error/conflict.error";
import api from "@/common/util/api";
import session from "@/common/util/session";
import { ErrorHandlerComponent } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import styles from "@/styles/register.module.sass";
import clsx from "classnames";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createRef, useEffect, useState } from "react";
import { Card, Collapse, Form, InputGroup, Toast } from "react-bootstrap";

export default function Register() {
    const [error, setError] = useState<Error>();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordCheck, setPasswordCheck] = useState(false);
    const [matchingPassword, setMatchingPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [validated, setValidated] = useState(false);
    const [feedback, setFeedback] = useState<string>();
    const [alertPrompt, setAlertPrompt] = useState(false);
    const [offset, setOffset] = useState<number>();
    const register = createRef<HTMLDivElement>();
    const router = useRouter();
    const handleSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (!e.currentTarget.form?.checkValidity()) {
            setValidated(true);
            return;
        }
        try {
            const userDto: CreateUserDto = {
                login,
                password,
                matchingPassword,
                name,
                email,
                phone: phone !== "" ? phone : undefined,
            };
            await api.post("/auth/register", userDto);
            await session.login({
                login,
                password,
            });
            setAlertPrompt(true);
        } catch (error: any) {
            if (error instanceof BadRequestError) {
                console.error(error);
                setFeedback("Неверно введены данные для регистрации!");
                return;
            }
            if (error instanceof ConflictError) {
                console.error(error);
                setFeedback("Такой пользователь уже существует!");
                return;
            }
            setError(error);
        }
    };
    useEffect(() => {
        if (register.current)
            setOffset(
                register.current.offsetLeft + register.current.clientWidth + 50
            );
    }, []);
    return (
        <ErrorHandlerComponent error={error}>
            <Head>
                <title>Register</title>
            </Head>
            <div className={styles["register-container"]}>
                <div className={styles["alert"]}>
                    <Toast
                        show={alertPrompt}
                        delay={3000}
                        onClose={() => router.push("/")}
                    >
                        <Toast.Header
                            closeButton={false}
                            className={"justify-content-center"}
                        >
                            <div className={"fs-5"}>Регистрация</div>
                        </Toast.Header>
                        <Toast.Body>
                            <div className={"text-center"}>
                                Регистрация выполнена успешно!
                            </div>
                            <div className={"d-flex justify-content-center"}>
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
                <div ref={register} className={styles["register"]}>
                    <div className={"text-center fs-3 fw-semibold"}>
                        Регистрация
                    </div>
                    <Form validated={validated}>
                        <Form.Floating className={"my-1"}>
                            <Form.Control
                                size={"lg"}
                                id={"login"}
                                name={"login"}
                                required
                                autoComplete={"off"}
                                minLength={4}
                                maxLength={20}
                                pattern={"^[A-Za-z]\\w*$"}
                                placeholder={"Введите логин"}
                                title={
                                    "Должен начинаться с латинского символа и содержать от 4 до 20 символов"
                                }
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                            />
                            <Form.Label htmlFor={"login"} className={"fs-6"}>
                                Логин
                            </Form.Label>
                            <div className={"invalid-feedback"}>
                                Неверно указан логин
                            </div>
                        </Form.Floating>
                        <InputGroup className={"my-1"}>
                            <Form.Floating>
                                <Form.Control
                                    size={"lg"}
                                    id={"password"}
                                    type={showPassword ? "text" : "password"}
                                    name={"password"}
                                    required
                                    autoComplete={"off"}
                                    minLength={8}
                                    maxLength={16}
                                    pattern={
                                        "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*$"
                                    }
                                    placeholder={"Введите пароль"}
                                    title={
                                        "Должен содержать не менее одной цифры и одной прописной и строчной буквы, а также от 8 до 16 символов"
                                    }
                                    value={password}
                                    onFocus={() => setPasswordCheck(true)}
                                    onBlur={() => setPasswordCheck(false)}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <Form.Label
                                    htmlFor={"password"}
                                    className={"fs-6"}
                                >
                                    Пароль
                                </Form.Label>
                            </Form.Floating>
                            <Button
                                variant={"outline-secondary"}
                                className={styles["show-password"]}
                                onMouseDown={() => setShowPassword(true)}
                                onMouseUp={() => setShowPassword(false)}
                                onMouseLeave={() => setShowPassword(false)}
                            >
                                👁
                            </Button>
                        </InputGroup>
                        <div
                            className={
                                "d-flex align-items-center position-absolute top-0 h-100"
                            }
                            style={{ left: offset }}
                        >
                            <Collapse in={passwordCheck} dimension={"width"}>
                                <Card>
                                    <div className={styles["password-check"]}>
                                        <div className={"p-3 fw-semibold"}>
                                            Пароль должен содержать:
                                        </div>
                                        <div
                                            className={clsx(
                                                styles["password-constraint"],
                                                {
                                                    [styles["valid"]]:
                                                        password.match("[a-z]"),
                                                }
                                            )}
                                        >
                                            <b>Строчную</b> букву
                                        </div>
                                        <div
                                            className={clsx(
                                                styles["password-constraint"],
                                                {
                                                    [styles["valid"]]:
                                                        password.match("[A-Z]"),
                                                }
                                            )}
                                        >
                                            <b>Заглавную</b> букву
                                        </div>
                                        <div
                                            className={clsx(
                                                styles["password-constraint"],
                                                {
                                                    [styles["valid"]]:
                                                        password.match("[0-9]"),
                                                }
                                            )}
                                        >
                                            <b>Число</b>
                                        </div>
                                        <div
                                            className={clsx(
                                                styles["password-constraint"],
                                                {
                                                    [styles["valid"]]:
                                                        password.length >= 8,
                                                }
                                            )}
                                        >
                                            Минимум <b>8 символов</b>
                                        </div>
                                    </div>
                                </Card>
                            </Collapse>
                        </div>
                        <Form.Floating className={"my-1"}>
                            <Form.Control
                                size={"lg"}
                                id={"matchingPassword"}
                                type={showPassword ? "text" : "password"}
                                name={"matchingPassword"}
                                required
                                autoComplete={"off"}
                                pattern={`^${password}$`}
                                placeholder={"Повторите пароль"}
                                value={matchingPassword}
                                onChange={(e) =>
                                    setMatchingPassword(e.target.value)
                                }
                            />
                            <Form.Label
                                htmlFor={"matchingPassword"}
                                className={"fs-6"}
                            >
                                Повторите пароль
                            </Form.Label>
                            <div className={"invalid-feedback"}>
                                Пароли должны совпадать
                            </div>
                        </Form.Floating>
                        <Form.Floating className={"my-1"}>
                            <Form.Control
                                size={"lg"}
                                id={"name"}
                                name={"name"}
                                required
                                minLength={4}
                                maxLength={40}
                                pattern={"^[A-Za-z]+([. '\\-][A-Za-z]+)*$"}
                                placeholder={"Введите имя"}
                                title={
                                    "Не должно содержать цифр или специальных знаков"
                                }
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Form.Label htmlFor={"name"} className={"fs-6"}>
                                Имя
                            </Form.Label>
                            <div className={"invalid-feedback"}>
                                Неверно указано имя
                            </div>
                        </Form.Floating>
                        <Form.Floating className={"my-1"}>
                            <Form.Control
                                size={"lg"}
                                id={"email"}
                                type={"email"}
                                name={"email"}
                                required
                                minLength={3}
                                maxLength={320}
                                placeholder={"Введите свою почту"}
                                title={
                                    "Должен содержать символ @, а также не менее 8 символов"
                                }
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Form.Label htmlFor={"email"} className={"fs-6"}>
                                Почта
                            </Form.Label>
                            <div className={"invalid-feedback"}>
                                Неверно указана почта
                            </div>
                        </Form.Floating>
                        <Form.Floating className={"my-1"}>
                            <Form.Control
                                size={"lg"}
                                id={"phone"}
                                type={"tel"}
                                name={"phone"}
                                pattern={
                                    "^((\\+\\d{1,3}( )?)?((\\(\\d{1,3}\\))|\\d{1,3})[\\- ]?\\d{3,4}[\\- ]?\\d{4})?$"
                                }
                                placeholder={"Введите свой телефон"}
                                title={
                                    "Должен быть введен номер телефона с кодом страны"
                                }
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <Form.Label htmlFor={"phone"} className={"fs-6"}>
                                Телефон
                            </Form.Label>
                            <div className={"invalid-feedback"}>
                                Неверно указан телефон
                            </div>
                        </Form.Floating>
                        <div>
                            {feedback && (
                                <div
                                    className={"text-danger fw-bold fst-italic"}
                                >
                                    {feedback}
                                </div>
                            )}
                            <Button
                                variant={"success"}
                                className={"w-100 fs-5"}
                                onClick={handleSubmit}
                            >
                                Зарегистрироваться
                            </Button>
                        </div>
                    </Form>
                    <div className={"d-flex justify-content-between mt-2"}>
                        <Link href={"/"}>
                            <Button variant={"outline-dark"}>Назад</Button>
                        </Link>
                        <div className={"fs-5 fst-italic"}>
                            Уже есть аккаунт? <Link href={"/login"}>Войти</Link>
                        </div>
                    </div>
                </div>
            </div>
        </ErrorHandlerComponent>
    );
}
