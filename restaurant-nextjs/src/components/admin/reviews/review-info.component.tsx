import { ReviewDto } from "@/common/dto/reviews/review.dto";
import { Button } from "@/components/page/button.component";

interface ReviewInfoComponentProps {
    review: ReviewDto;
    deleteReview: () => void;
}

export function ReviewInfoComponent({
    review,
    deleteReview,
}: ReviewInfoComponentProps) {
    return (
        <tr>
            <td className={"fw-semibold"}>{review.id}</td>
            <td>{review.grade}</td>
            <td>{review.comment}</td>
            <td>{new Date(Date.parse(review.date)).toLocaleString()}</td>
            <td>{review.user}</td>
            <td>
                <div>
                    <div className={"d-flex justify-content-around float-end"}>
                        <Button
                            variant={"outline-danger"}
                            className={"mx-2"}
                            onClick={deleteReview}
                        >
                            Удалить
                        </Button>
                    </div>
                </div>
            </td>
        </tr>
    );
}
