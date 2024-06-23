import { CreateReviewDto } from "@/common/dto/reviews/create-review.dto";
import { ReviewDto } from "@/common/dto/reviews/review.dto";
import { RoleName } from "@/common/dto/roles/role.name";
import { UserDto } from "@/common/dto/users/user.dto";
import api from "@/common/util/api";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { ReviewFormComponent } from "@/components/home/review-form.component";
import { ReviewInfoComponent } from "@/components/home/review-info.component";
import {
    Pageable,
    PageableData,
    PaginationComponent,
    SortOrder,
} from "@/components/page/pagination.component";
import { SpinnerComponent } from "@/components/page/spinner.component";
import styles from "@/styles/home.module.sass";
import { useEffect, useState } from "react";
import { Stack, Toast } from "react-bootstrap";

export interface ReviewListComponentProps {
    setError: ErrorHandler;
    auth: UserDto;
}

export function ReviewListComponent({
    setError,
    auth,
}: ReviewListComponentProps) {
    const [reviews, setReviews] = useState<ReviewDto[]>();
    const [total, setTotal] = useState<number>();
    const [pageable, setPageable] = useState<Pageable>({
        sort: "date",
        order: SortOrder.Desc,
    });
    const [notification, setNotification] = useState<string>();
    const loadReviews = async () => {
        try {
            const reviewsData: PageableData<ReviewDto> = await api.get(
                "/api/reviews",
                {
                    params: {
                        page: pageable.page,
                        sort: `${pageable.sort},${pageable.order}`,
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
    const addReview = async (reviewDto: CreateReviewDto) => {
        await api.post("/api/reviews", reviewDto);
        setNotification("Отзыв успешно добавлен!");
        loadReviews();
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
                    <div className={"fs-5"}>Новый отзыв</div>
                </Toast.Header>
                <Toast.Body>{notification}</Toast.Body>
            </Toast>
            <div
                className={
                    "mt-3 border-3 border-top border-bottom text-white fs-2"
                }
            >
                Отзывы
            </div>
            <div className={styles["review-list-wrap"]}>
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
                            <Stack>
                                {reviews.map((review) => (
                                    <ReviewInfoComponent
                                        key={review.id}
                                        review={review}
                                    />
                                ))}
                            </Stack>
                        </>
                    ) : (
                        <div
                            className={
                                "d-flex justify-content-center align-items-center m-5"
                            }
                        >
                            <div className={"text-center text-white fs-4"}>
                                Отзывов пока нет, будьте первыми!
                            </div>
                        </div>
                    )
                ) : (
                    <div className={"m-5"}>
                        <SpinnerComponent variant={"light"} />
                    </div>
                )}
                {[RoleName.Client, RoleName.Manager, RoleName.Admin].includes(
                    auth.role
                ) && (
                    <ReviewFormComponent
                        setError={setError}
                        auth={auth}
                        addReview={addReview}
                    />
                )}
            </div>
        </div>
    );
}
