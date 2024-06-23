import { RoleName } from "@/common/dto/roles/role.name";
import { UserDto } from "@/common/dto/users/user.dto";
import { ForbiddenError } from "@/common/error/forbidden.error";
import session from "@/common/util/session";
import { AccountLayoutComponent } from "@/components/account/account-layout.component";
import { OrderListComponent } from "@/components/account/order-list.component";
import { ErrorHandlerComponent } from "@/components/error/error-handler.component";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Orders() {
    const [error, setError] = useState<Error>();
    const [auth, setAuth] = useState<UserDto>();
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
                <title>Orders</title>
            </Head>
            <AccountLayoutComponent setError={setError} auth={auth}>
                <OrderListComponent setError={setError} auth={auth} />
            </AccountLayoutComponent>
        </ErrorHandlerComponent>
    );
}
