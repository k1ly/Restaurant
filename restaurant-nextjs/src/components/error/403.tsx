import Link from "next/link";

export function ForbiddenComponent() {
    return (
        <div
            className={
                "d-flex justify-content-center align-items-center flex-fill"
            }
        >
            <div>
                <h1>Доступ запрещен!</h1>
                <div className={"d-flex justify-content-center fw-bold fs-4"}>
                    <Link href={"/"}>Назад</Link>
                </div>
            </div>
        </div>
    );
}
