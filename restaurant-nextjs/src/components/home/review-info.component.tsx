import { ReviewDto } from "@/common/dto/reviews/review.dto";
import styles from "@/styles/home.module.sass";
import clsx from "classnames";
import { Card } from "react-bootstrap";

export interface ReviewInfoComponentProps {
    review: ReviewDto;
}

export function ReviewInfoComponent({ review }: ReviewInfoComponentProps) {
    return (
        <Card className={"mx-2"}>
            <Card.Header className={"p-1 rounded-top bg-light"}>
                <div className={"d-flex justify-content-start"}>
                    <Card.Title className={styles["review-user"]}>
                        <div className={styles["review-user-avatar"]}>
                            {review.user[0].toUpperCase()}
                        </div>
                        {review.user}
                    </Card.Title>
                    <div className={"mx-2"}>
                        {Array.from(Array(5).keys()).map((i) => (
                            <span
                                key={i}
                                className={clsx(styles["star"], {
                                    [styles["active"]]: i < review.grade,
                                })}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>
                <div className={"text-secondary"}>
                    {new Date(Date.parse(review.date)).toLocaleString()}
                </div>
            </Card.Header>
            <Card.Body>
                <Card.Text>{review.comment}</Card.Text>
            </Card.Body>
        </Card>
    );
}
