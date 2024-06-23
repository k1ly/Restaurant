import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Account() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/account/profile");
    }, []);
    return (
        <Head>
            <title>Account</title>
        </Head>
    );
}
