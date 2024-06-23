import { UserDto } from "@/common/dto/users/user.dto";
import session from "@/common/util/session";
import { OrderItemListComponent } from "@/components/cart/order-item-list.component";
import { ErrorHandlerComponent } from "@/components/error/error-handler.component";
import { PageComponent } from "@/components/page/page.component";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Cart() {
    const [error, setError] = useState<Error>();
    const [auth, setAuth] = useState<UserDto>();
    const authenticate = async () => {
        try {
            const authData: UserDto = await session.authenticate();
            setAuth(authData);
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
                <title>Cart</title>
            </Head>
            <PageComponent setError={setError} auth={auth}>
                <OrderItemListComponent setError={setError} auth={auth} />
            </PageComponent>
        </ErrorHandlerComponent>
    );
}
