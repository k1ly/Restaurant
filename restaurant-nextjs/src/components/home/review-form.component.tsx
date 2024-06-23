import { CreateReviewDto } from "@/common/dto/reviews/create-review.dto";
import { UserDto } from "@/common/dto/users/user.dto";
import { BadRequestError } from "@/common/error/bad-request.error";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import styles from "@/styles/home.module.sass";
import clsx from "classnames";
import { useState } from "react";
import { Form } from "react-bootstrap";

export interface ReviewFormComponentProps {
    setError: ErrorHandler;
    auth: UserDto;
    addReview: (reiewDto: CreateReviewDto) => Promise<void>;
}

export function ReviewFormComponent({
    setError,
    auth,
    addReview,
}: ReviewFormComponentProps) {
    const [review, setReview] = useState(false);
    const [temp, setTemp] = useState(0);
    const [grade, setGrade] = useState(0);
    const [comment, setComment] = useState("");
    const [validated, setValidated] = useState(false);
    const [feedback, setFeedback] = useState<string>();
    const resetFormData = () => {
        setReview(false);
        setTemp(0);
        setGrade(0);
        setComment("");
        setValidated(false);
        setFeedback(null);
    };
    const isSubmitAllowed = () => grade > 0 && comment !== "";
    const handleSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (!e.currentTarget.form?.checkValidity()) {
            setValidated(true);
            return;
        }
        try {
            await addReview({
                grade,
                comment,
                user: auth.id,
            });
            resetFormData();
        } catch (error) {
            if (error instanceof BadRequestError) {
                console.error(error);
                setFeedback("Неверно введены данные!");
                return;
            }
            setError(error);
        }
    };
    return (
        <div className={"my-5"}>
            {review ? (
                <Form validated={validated} className={"mx-5 bg-light"}>
                    <div className={"m-2"}>
                        {Array.from(Array(5).keys()).map((i) => (
                            <span
                                key={i}
                                className={clsx(styles["star"], {
                                    [styles["active"]]: temp > i || grade > i,
                                })}
                                onClick={() => {
                                    setTemp(i + 1);
                                    setGrade(i + 1);
                                }}
                                onMouseEnter={() => setTemp(i + 1)}
                                onMouseLeave={() => setTemp(grade)}
                            >
                                ★
                            </span>
                        ))}
                        <Form.Control
                            type={"hidden"}
                            name={"grade"}
                            required
                            min={1}
                            max={5}
                            value={grade}
                        />
                    </div>
                    <div className={"d-flex justify-content-center px-4"}>
                        <Form.Control
                            size={"lg"}
                            as={"textarea"}
                            name={"comment"}
                            required
                            maxLength={1000}
                            title={
                                "Введите комментарий отзыва до 1000 символов"
                            }
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                    <div className={"d-flex justify-content-end py-3"}>
                        {feedback && (
                            <div className={"text-danger fw-bold fst-italic"}>
                                {feedback}
                            </div>
                        )}
                        <Button
                            variant={"success"}
                            disabled={!isSubmitAllowed()}
                            onClick={handleSubmit}
                            className={"mx-3"}
                        >
                            Отправить
                        </Button>
                        <Button
                            variant={"outline-dark"}
                            className={"mx-3"}
                            onClick={resetFormData}
                        >
                            Отменить
                        </Button>
                    </div>
                </Form>
            ) : (
                <div className={"mx-3"}>
                    <Button variant={"danger"} onClick={() => setReview(true)}>
                        Оставить отзыв
                    </Button>
                </div>
            )}
        </div>
    );
}
