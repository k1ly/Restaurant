import { BadRequestError } from "@/common/error/bad-request.error";
import { UnauthorizedError } from "@/common/error/unauthorized.error";
import session from "@/common/util/session";
import { ErrorHandlerComponent } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import styles from "@/styles/login.module.sass";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";

export default function Login() {
    const [error, setError] = useState<Error>();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [validated, setValidated] = useState(false);
    const [feedback, setFeedback] = useState<string>();
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
            await session.login({ login, password }, remember);
            router.push("/");
        } catch (error: any) {
            if (
                error instanceof BadRequestError ||
                error instanceof UnauthorizedError
            ) {
                console.error(error);
                setFeedback("Неверный логин или пароль");
                return;
            }
            setError(error);
        }
    };
    return (
        <ErrorHandlerComponent error={error}>
            <Head>
                <title>Login</title>
            </Head>
            <div className={styles["login-container"]}>
                <div className={styles["login"]}>
                    <div className={"text-center fs-3 fw-semibold"}>
                        Вход в систему
                    </div>
                    <Form validated={validated}>
                        <Form.Group className={"my-1"}>
                            <Form.Label htmlFor={"login"} className={"fs-5"}>
                                Логин
                            </Form.Label>
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
                            <div className={"invalid-feedback"}>
                                Неверно указан логин
                            </div>
                        </Form.Group>
                        <Form.Group className={"my-1"}>
                            <Form.Label htmlFor={"password"} className={"fs-5"}>
                                Пароль
                            </Form.Label>
                            <InputGroup>
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
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
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
                            <div className={"invalid-feedback"}>
                                Неверно указан пароль
                            </div>
                        </Form.Group>
                        <Form.Check
                            className={
                                "my-2 pt-2 border-top border-secondary border-2 border-opacity-50"
                            }
                        >
                            <Form.Check.Input
                                type={"checkbox"}
                                name={"remember"}
                                checked={remember}
                                id={"remember"}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            <Form.Check.Label
                                htmlFor={"remember"}
                                className={"fs-6"}
                            >
                                Запомнить меня
                            </Form.Check.Label>
                        </Form.Check>
                        <Form.Group>
                            {feedback && (
                                <div
                                    className={"text-danger fw-bold fst-italic"}
                                >
                                    {feedback}
                                </div>
                            )}
                            <Button
                                variant={"primary"}
                                className={"w-100 fs-5"}
                                onClick={handleSubmit}
                            >
                                Войти
                            </Button>
                        </Form.Group>
                    </Form>
                    <div className={"d-flex justify-content-between mt-2"}>
                        <Link href={"/"}>
                            <Button variant={"outline-dark"}>Назад </Button>
                        </Link>
                        <Link href={"/register"}>
                            <div className={"fs-5 fst-italic"}>
                                Зарегистрироваться
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </ErrorHandlerComponent>
    );
}
