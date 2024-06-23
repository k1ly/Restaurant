import { Pagination } from "react-bootstrap";

export enum SortOrder {
    Asc = "asc",
    Desc = "desc",
}

export interface Pageable {
    page?: number;
    size?: number;
    sort?: string;
    order?: SortOrder;
}

export interface PageableData<T> {
    content: T[];
    total: number;
    pageable: Pageable;
}

export interface PaginationComponentProps {
    total: number;
    pageable: Pageable;
    setPage: (page) => void;
}

export function PaginationComponent({
    total,
    pageable,
    setPage,
}: PaginationComponentProps) {
    return (
        <Pagination className={"ms-4"}>
            {pageable.page > 0 && (
                <Pagination.Item onClick={() => setPage(0)}>
                    {1}
                </Pagination.Item>
            )}
            {pageable.page > 2 && <Pagination.Ellipsis disabled={true} />}
            {pageable.page > 1 && (
                <Pagination.Item onClick={() => setPage(pageable.page - 1)}>
                    {pageable.page}
                </Pagination.Item>
            )}
            <Pagination.Item
                active={true}
                onClick={() => setPage(pageable.page ?? 0)}
            >
                {(pageable.page ?? 0) + 1}
            </Pagination.Item>
            {pageable.page < total - 1 && (
                <Pagination.Item onClick={() => setPage(pageable.page + 1)}>
                    {pageable.page + 2}
                </Pagination.Item>
            )}
            {pageable.page < total - 3 && (
                <Pagination.Ellipsis disabled={true} />
            )}
            {pageable.page < total - 2 && (
                <Pagination.Item onClick={() => setPage(total - 1)}>
                    {total}
                </Pagination.Item>
            )}
        </Pagination>
    );
}
