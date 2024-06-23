import { RoleName } from "@/common/dto/roles/role.name";
import { UserDto } from "@/common/dto/users/user.dto";
import { ForbiddenError } from "@/common/error/forbidden.error";
import session from "@/common/util/session";
import { ErrorHandlerComponent } from "@/components/error/error-handler.component";
import { ManagingLayoutComponent } from "@/components/managing/managing-layout.component";
import { ReservationListComponent } from "@/components/managing/reservation-list.component";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Reservation() {
    const [error, setError] = useState<Error>();
    const [auth, setAuth] = useState<UserDto>();
    const authenticate = async () => {
        try {
            const authData: UserDto = await session.authenticate();
            [RoleName.Manager, RoleName.Admin].includes(authData.role)
                ? setAuth(authData)
                : setError(new ForbiddenError("Managing"));
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
                <title>Reservation</title>
            </Head>
            <ManagingLayoutComponent setError={setError} auth={auth}>
                <ReservationListComponent setError={setError} auth={auth} />
            </ManagingLayoutComponent>
        </ErrorHandlerComponent>
    );
}
