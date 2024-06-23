import Link from "next/link";

export function UnauthorizedComponent() {
    return (
        <div
            className={
                "d-flex justify-content-center align-items-center flex-fill"
            }
        >
            <div className={"text-center"}>
                <h1>Ой, кажется вы не авторизовались...</h1>
                <div className={"d-flex justify-content-center fw-bold fs-4"}>
                    <Link href={"/"}>Назад</Link>
                </div>
            </div>
        </div>
    );
}
