import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Managing() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/managing/orders");
    }, []);
    return (
        <Head>
            <title>Managing</title>
        </Head>
    );
}
