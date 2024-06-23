import { InternalServerErrorComponent } from "@/components/error/500";
import Head from "next/head";

export default function Error() {
    return (
        <>
            <Head>
                <title>Error</title>
            </Head>
            <InternalServerErrorComponent />
        </>
    );
}
