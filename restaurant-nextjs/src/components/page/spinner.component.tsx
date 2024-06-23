import styles from "@/styles/page.module.sass";
import { Spinner } from "react-bootstrap";

export interface SpinnerComponentProps {
    variant?: string;
    size?: "sm" | "md" | "lg";
}

export function SpinnerComponent({ variant, size }: SpinnerComponentProps) {
    return (
        <div
            className={
                "d-flex justify-content-center align-items-center flex-fill"
            }
        >
            <Spinner
                variant={variant}
                className={size ? styles[`spinner-${size}`] : ""}
            />
        </div>
    );
}
