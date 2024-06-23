import { UnauthorizedComponent } from "@/components/error/401";
import { ForbiddenComponent } from "@/components/error/403";
import { NotFoundComponent } from "@/components/error/404";
import { InternalServerErrorComponent } from "@/components/error/500";

export type ErrorHandler = (error: Error) => void;

export interface ErrorHandlerComponentProps {
    error: Error;
    children: React.ReactNode;
}

export function ErrorHandlerComponent({
    error,
    children,
}: ErrorHandlerComponentProps) {
    if (error) {
        console.error(error);
        return (
            {
                UnauthorizedError: <UnauthorizedComponent />,
                ForbiddenError: <ForbiddenComponent />,
                NotFoundError: <NotFoundComponent />,
            }[error.constructor.name] ?? <InternalServerErrorComponent />
        );
    }
    return <>{children}</>;
}
