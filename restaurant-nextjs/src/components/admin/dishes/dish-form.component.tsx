import { CategoryDto } from "@/common/dto/categories/category.dto";
import { CreateDishDto } from "@/common/dto/dishes/create-dish.dto";
import { BadRequestError } from "@/common/error/bad-request.error";
import { UnprocessableEntityError } from "@/common/error/unprocessable-entity.error";
import api from "@/common/util/api";
import config, { ConfigKey } from "@/common/util/config";
import { FormDishDto } from "@/components/admin/dishes/dish-list.component";
import { ImageUploadComponent } from "@/components/admin/dishes/image-upload.component";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import { Pageable, PageableData } from "@/components/page/pagination.component";
import { useEffect, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";

export interface DishFormComponentProps {
    setError: ErrorHandler;
    dish: FormDishDto;
    addDish: (dishDto: CreateDishDto, image?: File) => Promise<void>;
    updateDish: (dishDto: CreateDishDto, image?: File) => Promise<void>;
    onClose: () => void;
}

export function DishFormComponent({
    setError,
    dish,
    addDish,
    updateDish,
    onClose,
}: DishFormComponentProps) {
    const [categories, setCategories] = useState<CategoryDto[]>();
    const [pageable, setPageable] = useState<Pageable>({ size: 20 });
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [weight, setWeight] = useState(0);
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [category, setCategory] = useState(0);
    const [image, setImage] = useState<File>();
    const [validated, setValidated] = useState(false);
    const [feedback, setFeedback] = useState<string>();
    const loadCategories = async () => {
        try {
            const categoriesData: PageableData<CategoryDto> = await api.get(
                "/api/categories",
                {
                    params: { size: pageable.size },
                }
            );
            setCategories(categoriesData.content);
            setPageable(categoriesData.pageable);
        } catch (error: any) {
            setError(error);
        }
    };
    const isSubmitAllowed = () => category > 0;
    const handleSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (!e.currentTarget.form?.checkValidity()) {
            setValidated(true);
            return;
        }
        try {
            dish.id
                ? await updateDish(
                      {
                          name,
                          description,
                          weight,
                          price,
                          discount,
                          category,
                      },
                      image
                  )
                : await addDish(
                      {
                          name,
                          description,
                          weight,
                          price,
                          discount,
                          category,
                      },
                      image
                  );
        } catch (error: any) {
            if (error instanceof BadRequestError) {
                console.error(error);
                setFeedback("Неверно введены данные!");
                return;
            }
            if (error instanceof UnprocessableEntityError) {
                console.error(error);
                setFeedback("Неверный формат или размер изображения!");
                return;
            }
            setError(error);
        }
    };
    useEffect(() => {
        loadCategories();
    }, []);
    useEffect(() => {
        if (dish) {
            setName(dish.name);
            setDescription(dish.description);
            setWeight(dish.weight);
            setPrice(dish.price);
            setDiscount(dish.discount);
            setCategory(dish.category);
            setValidated(false);
            setFeedback(null);
        }
    }, [dish]);
    return (
        <Modal
            show={!!dish}
            onHide={onClose}
            size={"lg"}
            backdrop={"static"}
            keyboard={false}
            centered={true}
        >
            {dish && (
                <Form validated={validated}>
                    <Modal.Header closeButton={true}>
                        <Modal.Title className={"fs-4"}>
                            {dish.name !== "" ? dish.name : "Новое блюдо"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <ImageUploadComponent
                                    imageUrl={
                                        dish.imageUrl &&
                                        `${config.get(ConfigKey.ApiUrl)}/${
                                            dish.imageUrl
                                        }`
                                    }
                                    setImage={setImage}
                                />
                                <Form.Group>
                                    <Form.Label
                                        htmlFor={"dishName"}
                                        className={"fs-5"}
                                    >
                                        Название
                                    </Form.Label>
                                    <Form.Control
                                        id={"dishName"}
                                        name={"name"}
                                        required
                                        minLength={1}
                                        maxLength={100}
                                        title={
                                            "Введите название блюда от 1 до 100 символов"
                                        }
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                    <div className={"invalid-feedback"}>
                                        Неверно указано название
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label
                                        htmlFor={"dishDescription"}
                                        className={"fs-5"}
                                    >
                                        Описание
                                    </Form.Label>
                                    <Form.Control
                                        id={"dishDescription"}
                                        as={"textarea"}
                                        name={"description"}
                                        maxLength={200}
                                        title={
                                            "Введите описание блюда до 200 символов"
                                        }
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                    />
                                    <div className={"invalid-feedback"}>
                                        Неверно указано описание
                                    </div>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label
                                        htmlFor={"dishWeight"}
                                        className={"fs-5"}
                                    >
                                        Вес{" "}
                                        <span className={"fs-6"}>(грамм)</span>
                                    </Form.Label>
                                    <Form.Control
                                        id={"dishWeight"}
                                        type={"number"}
                                        name={"weight"}
                                        required
                                        min={1}
                                        title={"Введите вес блюда в граммах"}
                                        value={weight}
                                        onChange={(e) =>
                                            setWeight(Number(e.target.value))
                                        }
                                    />
                                    <div className={"invalid-feedback"}>
                                        Неверно указан вес
                                    </div>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label
                                        htmlFor={"dishPrice"}
                                        className={"fs-5"}
                                    >
                                        Цена{" "}
                                        <span className={"fs-6"}>(руб.)</span>
                                    </Form.Label>
                                    <Form.Control
                                        id={"dishPrice"}
                                        type={"number"}
                                        step={0.01}
                                        name={"price"}
                                        required
                                        min={0}
                                        title={"Введите цену блюда в рублях"}
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(Number(e.target.value))
                                        }
                                    />
                                    <div className={"invalid-feedback"}>
                                        Неверно указана цена
                                    </div>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label
                                        htmlFor={"dishDiscount"}
                                        className={"fs-5"}
                                    >
                                        Скидка{" "}
                                        <span className={"fs-6"}>( % )</span>
                                    </Form.Label>
                                    <Form.Control
                                        id={"dishDiscount"}
                                        type={"number"}
                                        name={"discount"}
                                        required
                                        min={0}
                                        max={100}
                                        title={
                                            "Введите скидку на блюдо в процентах"
                                        }
                                        value={discount}
                                        onChange={(e) =>
                                            setDiscount(Number(e.target.value))
                                        }
                                    />
                                    <div className={"invalid-feedback"}>
                                        Неверно указана скидка
                                    </div>
                                </Form.Group>
                                {categories && (
                                    <Form.Group>
                                        <Form.Label
                                            htmlFor={"dishCategory"}
                                            className={"fs-5"}
                                        >
                                            Категория
                                        </Form.Label>
                                        <Form.Select
                                            id={"dishCategory"}
                                            name={"category"}
                                            required
                                            title={"Выберите категорию блюда"}
                                            value={category}
                                            onChange={(e) =>
                                                setCategory(
                                                    Number(e.target.value)
                                                )
                                            }
                                        >
                                            <option value={0} disabled={true}>
                                                ...
                                            </option>
                                            {categories.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}
                            </Col>
                        </Row>
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
                            disabled={!isSubmitAllowed()}
                            onClick={handleSubmit}
                        >
                            {dish.id ? "Изменить" : "Добавить"}
                        </Button>
                    </Modal.Footer>
                </Form>
            )}
        </Modal>
    );
}
