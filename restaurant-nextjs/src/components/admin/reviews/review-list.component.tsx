import { ReviewDto } from "@/common/dto/reviews/review.dto";
import api from "@/common/util/api";
import { ReviewInfoComponent } from "@/components/admin/reviews/review-info.component";
import { ErrorHandler } from "@/components/error/error-handler.component";
import {
    Pageable,
    PageableData,
    PaginationComponent,
    SortOrder,
} from "@/components/page/pagination.component";
import { SearchComponent } from "@/components/page/search.component";
import { SpinnerComponent } from "@/components/page/spinner.component";
import styles from "@/styles/admin.module.sass";
import { useEffect, useState } from "react";
import { Table, Toast } from "react-bootstrap";

export enum ReviewSort {
    Id = "id",
    Grade = "grade",
    Comment = "comment",
    Date = "date",
    User = "user.id",
}

export interface ReviewListComponentProps {
    setError: ErrorHandler;
}

export function ReviewListComponent({ setError }: ReviewListComponentProps) {
    const [reviews, setReviews] = useState<ReviewDto[]>();
    const [total, setTotal] = useState<number>();
    const [pageable, setPageable] = useState<Pageable>({ size: 10 });
    const [search, setSearch] = useState("");
    const [notification, setNotification] = useState<string>();
    const loadReviews = async () => {
        try {
            const reviewsData: PageableData<ReviewDto> = await api.get(
                "/api/reviews",
                {
                    params: {
                        filter: search !== "" ? search : undefined,
                        page: pageable.page,
                        size: pageable.size,
                        sort:
                            pageable.sort && pageable.order
                                ? `${pageable.sort},${pageable.order}`
                                : undefined,
                    },
                }
            );
            setReviews(reviewsData.content);
            setTotal(reviewsData.total);
            setPageable(reviewsData.pageable);
        } catch (error: any) {
            setError(error);
        }
    };
    const handleSort = (sort: string) => {
        pageable.sort = sort;
        pageable.order =
            pageable.sort !== sort || pageable.order !== SortOrder.Asc
                ? SortOrder.Asc
                : SortOrder.Desc;
        loadReviews();
    };
    const deleteReview = async (id: number) => {
        try {
            await api.delete(`/api/reviews/${id}`);
            setNotification("Отзыв успешно удален!");
            loadReviews();
        } catch (error: any) {
            setError(error);
        }
    };
    useEffect(() => {
        loadReviews();
    }, []);
    return (
        <div className={"d-flex flex-column flex-fill mx-4"}>
            <Toast
                show={!!notification}
                delay={5000}
                autohide={true}
                className={styles["notification"]}
                onClose={() => setNotification(null)}
            >
                <Toast.Header className={"justify-content-center"}>
                    <div className={"fs-5"}>Администратор: отзывы</div>
                </Toast.Header>
                <Toast.Body>{notification}</Toast.Body>
            </Toast>
            <div className={"p-3"}>
                <SearchComponent
                    search={search}
                    setSearch={setSearch}
                    submit={() => {
                        pageable.page = 0;
                        loadReviews();
                    }}
                />
            </div>
            {reviews ? (
                total > 0 ? (
                    <>
                        <PaginationComponent
                            total={total}
                            pageable={pageable}
                            setPage={(page) => {
                                pageable.page = page;
                                loadReviews();
                            }}
                        />
                        <div className={"d-flex flex-column flex-fill"}>
                            <Table bordered={true} striped={true} hover={true}>
                                <thead className={"table-light fw-bold"}>
                                    <tr>
                                        <th
                                            scope={"col"}
                                            className={styles["pointer"]}
                                            onClick={() =>
                                                handleSort(ReviewSort.Id)
                                            }
                                        >
                                            ID
                                            {pageable.sort === ReviewSort.Id
                                                ? pageable.order ===
                                                  SortOrder.Asc
                                                    ? " ▲"
                                                    : " ▼"
                                                : ""}
                                        </th>
                                        <th
                                            scope={"col"}
                                            className={styles["pointer"]}
                                            onClick={() =>
                                                handleSort(ReviewSort.Grade)
                                            }
                                        >
                                            Оценка
                                            {pageable.sort === ReviewSort.Grade
                                                ? pageable.order ===
                                                  SortOrder.Asc
                                                    ? " ▲"
                                                    : " ▼"
                                                : ""}
                                        </th>
                                        <th
                                            scope={"col"}
                                            className={styles["pointer"]}
                                            onClick={() =>
                                                handleSort(ReviewSort.Comment)
                                            }
                                        >
                                            Комментарий
                                            {pageable.sort ===
                                            ReviewSort.Comment
                                                ? pageable.order ===
                                                  SortOrder.Asc
                                                    ? " ▲"
                                                    : " ▼"
                                                : ""}
                                        </th>
                                        <th
                                            scope={"col"}
                                            className={styles["pointer"]}
                                            onClick={() =>
                                                handleSort(ReviewSort.Date)
                                            }
                                        >
                                            Дата
                                            {pageable.sort === ReviewSort.Date
                                                ? pageable.order ===
                                                  SortOrder.Asc
                                                    ? " ▲"
                                                    : " ▼"
                                                : ""}
                                        </th>
                                        <th
                                            scope={"col"}
                                            className={styles["pointer"]}
                                            onClick={() =>
                                                handleSort(ReviewSort.User)
                                            }
                                        >
                                            Пользователь
                                            {pageable.sort === ReviewSort.User
                                                ? pageable.order ===
                                                  SortOrder.Asc
                                                    ? " ▲"
                                                    : " ▼"
                                                : ""}
                                        </th>
                                        <th scope={"col"}></th>
                                    </tr>
                                </thead>
                                <tbody className={"table-group-divider"}>
                                    {reviews.map((review) => (
                                        <ReviewInfoComponent
                                            key={review.id}
                                            review={review}
                                            deleteReview={() =>
                                                deleteReview(review.id)
                                            }
                                        />
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </>
                ) : (
                    <div
                        className={
                            "d-flex justify-content-center align-items-center flex-fill"
                        }
                    >
                        <div className={"fs-3"}>Список отзывов пуст</div>
                    </div>
                )
            ) : (
                <SpinnerComponent size={"lg"} />
            )}
        </div>
    );
}
