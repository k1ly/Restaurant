import Link from "next/link";
import { useEffect, useState } from "react";

export function InternalServerErrorComponent() {
    const [timestamp, setTimestamp] = useState<Date>();
    useEffect(() => {
        setTimestamp(new Date());
    }, []);
    return (
        <div
            className={
                "d-flex justify-content-center align-items-center flex-fill"
            }
        >
            <div>
                <h1>Непредвиденная ошибка :(</h1>
                {timestamp && <h3>{timestamp.toLocaleString()}</h3>}
                <div className={"d-flex justify-content-center fw-bold fs-4"}>
                    <Link href={"/"}>Назад</Link>
                </div>
            </div>
        </div>
    );
}
