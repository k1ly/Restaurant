import { RoleName } from "@/common/dto/roles/role.name";
import { UpdateUserDto } from "@/common/dto/users/update-user.dto";
import { UserDto } from "@/common/dto/users/user.dto";
import { ForbiddenError } from "@/common/error/forbidden.error";
import api from "@/common/util/api";
import session from "@/common/util/session";
import { AccountLayoutComponent } from "@/components/account/account-layout.component";
import { ProfileComponent } from "@/components/account/profile.component";
import { ErrorHandlerComponent } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import styles from "@/styles/account.module.sass";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toast } from "react-bootstrap";

export default function Profile() {
    const [error, setError] = useState<Error>();
    const [auth, setAuth] = useState<UserDto>();
    const [alertPrompt, setAlertPrompt] = useState(false);
    const router = useRouter();
    const updateUser = async (userDto: UpdateUserDto) => {
        await api.put(`/api/users/${auth.id}`, userDto);
        setAlertPrompt(true);
    };
    const authenticate = async () => {
        try {
            const authData: UserDto = await session.authenticate();
            [RoleName.Client, RoleName.Manager, RoleName.Admin].includes(
                authData.role
            )
                ? setAuth(authData)
                : setError(new ForbiddenError("Account"));
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
                <title>Profile</title>
            </Head>
            <AccountLayoutComponent setError={setError} auth={auth}>
                <div className={styles["alert"]}>
                    <Toast
                        show={alertPrompt}
                        delay={3000}
                        onClose={() => router.push("/account")}
                    >
                        <Toast.Header
                            closeButton={false}
                            className={"justify-content-center"}
                        >
                            <div className={"fs-5"}>Профиль</div>
                        </Toast.Header>
                        <Toast.Body>
                            <div className={"text-center"}>
                                Данные изменены!
                            </div>
                            <div className={"d-flex justify-content-center"}>
                                <Button
                                    variant={"primary"}
                                    size={"sm"}
                                    onClick={() => router.push("/account")}
                                >
                                    ОК
                                </Button>
                            </div>
                        </Toast.Body>
                    </Toast>
                </div>
                <ProfileComponent
                    setError={setError}
                    auth={auth}
                    updateUser={updateUser}
                />
            </AccountLayoutComponent>
        </ErrorHandlerComponent>
    );
}
