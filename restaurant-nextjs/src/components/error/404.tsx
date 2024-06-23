import Link from "next/link";

export function NotFoundComponent() {
    return (
        <div
            className={
                "d-flex justify-content-center align-items-center flex-fill"
            }
        >
            <div>
                <h1>Ой, страница не найдена!</h1>
                <div className={"d-flex justify-content-center fw-bold fs-4"}>
                    <Link href={"/"}>Назад</Link>
                </div>
            </div>
        </div>
    );
}
