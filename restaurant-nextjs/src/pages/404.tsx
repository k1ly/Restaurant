import { NotFoundComponent } from "@/components/error/404";
import Head from "next/head";

export default function NotFound() {
    return (
        <>
            <Head>
                <title>Not found</title>
            </Head>
            <NotFoundComponent />
        </>
    );
}
