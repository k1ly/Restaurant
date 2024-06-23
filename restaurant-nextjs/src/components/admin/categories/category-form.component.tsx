import { CreateCategoryDto } from "@/common/dto/categories/create-category.dto";
import { BadRequestError } from "@/common/error/bad-request.error";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { FormCategoryDto } from "./category-list.component";

export interface CategoryFormComponentProps {
    setError: ErrorHandler;
    category: FormCategoryDto;
    addCategory: (categoryDto: CreateCategoryDto) => Promise<void>;
    updateCategory: (categoryDto: CreateCategoryDto) => Promise<void>;
    onClose: () => void;
}

export function CategoryFormComponent({
    setError,
    category,
    addCategory,
    updateCategory,
    onClose,
}: CategoryFormComponentProps) {
    const [name, setName] = useState("");
    const [validated, setValidated] = useState(false);
    const [feedback, setFeedback] = useState<string>();
    const handleSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (!e.currentTarget.form?.checkValidity()) {
            setValidated(true);
            return;
        }
        try {
            category.id
                ? await updateCategory({ name })
                : await addCategory({ name });
        } catch (error: any) {
            if (error instanceof BadRequestError) {
                console.error(error);
                setFeedback("Неверно введены данные!");
                return;
            }
            setError(error);
        }
    };
    useEffect(() => {
        if (category) {
            setName(category.name);
            setValidated(false);
            setFeedback(null);
        }
    }, [category]);
    return (
        <Modal
            show={!!category}
            onHide={onClose}
            backdrop={"static"}
            keyboard={false}
            centered={true}
        >
            {category && (
                <Form validated={validated}>
                    <Modal.Header closeButton={true}>
                        <Modal.Title className={"fs-4"}>
                            {category.name !== ""
                                ? category.name
                                : "Новая категория"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label
                                htmlFor={"categoryName"}
                                className={"fs-5"}
                            >
                                Название
                            </Form.Label>
                            <Form.Control
                                id={"categoryName"}
                                name={"name"}
                                required
                                minLength={1}
                                maxLength={30}
                                title={
                                    "Введите название категории от 1 до 30 символов"
                                }
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <div className={"invalid-feedback"}>
                                Неверно указано название
                            </div>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        {feedback && (
                            <div className={"text-danger fw-bold fst-italic"}>
                                {feedback}
                            </div>
                        )}
                        <Button
                            variant={"primary"}
                            className={"w-100"}
                            onClick={handleSubmit}
                        >
                            {category.id ? "Изменить" : "Добавить"}
                        </Button>
                    </Modal.Footer>
                </Form>
            )}
        </Modal>
    );
}
