import { CreateTableDto } from "@/common/dto/tables/create-table.dto";
import { TableDto } from "@/common/dto/tables/table.dto";
import { BadRequestError } from "@/common/error/bad-request.error";
import { RestaurantSceneComponent } from "@/components/admin/tables/restaurant-scene.component";
import { FormTableDto } from "@/components/admin/tables/table-list.component";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import { useEffect, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";

export interface TableFormComponentProps {
    setError: ErrorHandler;
    tables: TableDto[];
    table: FormTableDto;
    addTable: (tableDto: CreateTableDto) => Promise<void>;
    updateTable: (tableDto: CreateTableDto) => Promise<void>;
    onClose: () => void;
}

export function TableFormComponent({
    setError,
    tables,
    table,
    addTable,
    updateTable,
    onClose,
}: TableFormComponentProps) {
    const [places, setPlaces] = useState(0);
    const [price, setPrice] = useState(0);
    const [positionX, setPositionX] = useState(0);
    const [positionY, setPositionY] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [scaleX, setScaleX] = useState(1);
    const [scaleY, setScaleY] = useState(1);
    const [isPositionValid, setPositionValid] = useState(false);
    const [validated, setValidated] = useState(false);
    const [feedback, setFeedback] = useState<string>();
    const calculateRotatedCorners = (
        centerX: number,
        centerY: number,
        scaleX: number,
        scaleY: number,
        rotation: number
    ): [number, number][] => {
        const halfWidth = (scaleX * 0.7) / 2;
        const halfHeight = (scaleY * 0.7) / 2;
        const radians = rotation * (Math.PI / 180);
        const cosAngle = Math.cos(radians);
        const sinAngle = Math.sin(radians);
        return [
            [-halfWidth, -halfHeight],
            [halfWidth, -halfHeight],
            [halfWidth, halfHeight],
            [-halfWidth, halfHeight],
        ].map(([x, y]) => [
            centerX + (x * cosAngle + y * sinAngle),
            centerY + (x * -sinAngle + y * cosAngle),
        ]);
    };
    const isSubmitAllowed = () => !isPositionValid;
    const handleSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (!e.currentTarget.form?.checkValidity()) {
            setValidated(true);
            return;
        }
        try {
            table.id
                ? await updateTable({
                      places,
                      price,
                      positionX,
                      positionY,
                      rotation,
                      scaleX,
                      scaleY,
                  })
                : await addTable({
                      places,
                      price,
                      positionX,
                      positionY,
                      rotation,
                      scaleX,
                      scaleY,
                  });
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
        if (table) {
            setPlaces(table.places);
            setPrice(table.price);
            setPositionX(table.positionX);
            setPositionY(table.positionY);
            setRotation(table.rotation);
            setScaleX(table.scaleX);
            setScaleY(table.scaleY);
            setValidated(false);
            setFeedback(null);
        }
    }, [table]);
    useEffect(() => {
        if (tables) {
            const corners = calculateRotatedCorners(
                positionX,
                positionY,
                scaleX,
                scaleY,
                rotation
            );
            setPositionValid(
                corners.some(
                    ([x, y]) => x < -3.9 || x > 3.9 || y < -3.5 || y > 2.5
                ) ||
                    tables.some((table) => {
                        const tableCorners = calculateRotatedCorners(
                            table.positionX,
                            table.positionY,
                            table.scaleX,
                            table.scaleY,
                            table.rotation
                        );
                        for (let i = 0; i < 4; i++) {
                            const [x1, y1] = corners[i];
                            const [x2, y2] = corners[(i + 1) % 4];
                            for (let j = 0; j < 4; j++) {
                                const [x3, y3] = tableCorners[j];
                                const [x4, y4] = tableCorners[(j + 1) % 4];
                                const ua =
                                    ((x4 - x3) * (y1 - y3) -
                                        (y4 - y3) * (x1 - x3)) /
                                    ((y4 - y3) * (x2 - x1) -
                                        (x4 - x3) * (y2 - y1));
                                const ub =
                                    ((x2 - x1) * (y1 - y3) -
                                        (y2 - y1) * (x1 - x3)) /
                                    ((y4 - y3) * (x2 - x1) -
                                        (x4 - x3) * (y2 - y1));
                                if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1)
                                    return true;
                            }
                        }
                        return false;
                    })
            );
        }
    }, [tables, positionX, positionY, rotation, scaleX, scaleY]);
    return (
        <Modal
            show={!!table}
            onHide={onClose}
            size={"lg"}
            backdrop={"static"}
            keyboard={false}
            centered={true}
        >
            {table && (
                <Form validated={validated}>
                    <Modal.Header closeButton={true}>
                        <Modal.Title className={"fs-4"}>
                            {table.id ? `Столик №${table.id}` : "Новый столик"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <RestaurantSceneComponent
                                    tables={tables}
                                    table={{
                                        id: table.id,
                                        places,
                                        price,
                                        positionX,
                                        positionY,
                                        rotation,
                                        scaleX,
                                        scaleY,
                                    }}
                                    isPositionValid={isPositionValid}
                                />
                                <Form.Group>
                                    <Form.Label
                                        htmlFor={"tablePlaces"}
                                        className={"fs-5"}
                                    >
                                        Количество мест
                                    </Form.Label>
                                    <Form.Control
                                        id={"tablePlaces"}
                                        type={"number"}
                                        name={"places"}
                                        required
                                        min={1}
                                        title={
                                            "Введите количество мест"
                                        }
                                        value={places}
                                        onChange={(e) =>
                                            setPlaces(Number(e.target.value))
                                        }
                                    />
                                    <div className={"invalid-feedback"}>
                                        Неверно указано количество мест
                                    </div>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label
                                        htmlFor={"tablePrice"}
                                        className={"fs-5"}
                                    >
                                        Стоимость бронирования{" "}
                                        <span className={"fs-6"}>
                                            (руб./час)
                                        </span>
                                    </Form.Label>
                                    <Form.Control
                                        id={"tablePrice"}
                                        type={"number"}
                                        step={0.01}
                                        name={"price"}
                                        required
                                        min={0}
                                        title={
                                            "Введите стоимость бронирования (руб./час)"
                                        }
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(Number(e.target.value))
                                        }
                                    />
                                    <div className={"invalid-feedback"}>
                                        Неверно указана стоимость бронирования
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label
                                        htmlFor={"tablePositionX"}
                                        className={"fs-5"}
                                    >
                                        Позиция{" "}
                                        <span className={"fs-6"}>X</span>
                                    </Form.Label>
                                    <Form.Control
                                        id={"tablePositionX"}
                                        type={"number"}
                                        step={0.1}
                                        name={"positionX"}
                                        required
                                        title={
                                            "Введите позицию столика по оси X"
                                        }
                                        value={positionX}
                                        onChange={(e) =>
                                            setPositionX(Number(e.target.value))
                                        }
                                    />
                                    <div className={"invalid-feedback"}>
                                        Неверно указана позиция X
                                    </div>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label
                                        htmlFor={"tablePositionY"}
                                        className={"fs-5"}
                                    >
                                        Позиция{" "}
                                        <span className={"fs-6"}>Y</span>
                                    </Form.Label>
                                    <Form.Control
                                        id={"tablePositionY"}
                                        type={"number"}
                                        step={0.1}
                                        name={"positionY"}
                                        required
                                        title={
                                            "Введите позицию столика по оси Y"
                                        }
                                        value={positionY}
                                        onChange={(e) =>
                                            setPositionY(Number(e.target.value))
                                        }
                                    />
                                    <div className={"invalid-feedback"}>
                                        Неверно указана позиция Y
                                    </div>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label
                                        htmlFor={"tableRotation"}
                                        className={"fs-5"}
                                    >
                                        Угол поворота{" "}
                                        <span className={"fs-6"}>
                                            (градусы)
                                        </span>
                                    </Form.Label>
                                    <Form.Control
                                        id={"tableRotation"}
                                        type={"number"}
                                        step={15}
                                        name={"rotation"}
                                        required
                                        min={0}
                                        max={75}
                                        title={
                                            "Введите угол поворота столика в градусах"
                                        }
                                        value={rotation}
                                        onChange={(e) =>
                                            setRotation(Number(e.target.value))
                                        }
                                    />
                                    <div className={"invalid-feedback"}>
                                        Неверно указан угол поворота
                                    </div>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label
                                        htmlFor={"tableScaleX"}
                                        className={"fs-5"}
                                    >
                                        Масштаб{" "}
                                        <span className={"fs-6"}>X</span>
                                    </Form.Label>
                                    <Form.Control
                                        id={"tableScaleX"}
                                        type={"number"}
                                        step={0.1}
                                        name={"scaleX"}
                                        required
                                        min={0.1}
                                        title={
                                            "Введите масштаб столика по оси X"
                                        }
                                        value={scaleX}
                                        onChange={(e) =>
                                            setScaleX(Number(e.target.value))
                                        }
                                    />
                                    <div className={"invalid-feedback"}>
                                        Неверно указан масштаб X
                                    </div>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label
                                        htmlFor={"tableScaleY"}
                                        className={"fs-5"}
                                    >
                                        Масштаб{" "}
                                        <span className={"fs-6"}>Y</span>
                                    </Form.Label>
                                    <Form.Control
                                        id={"tableScaleY"}
                                        type={"number"}
                                        step={0.1}
                                        name={"scaleY"}
                                        required
                                        min={0.1}
                                        title={
                                            "Введите масштаб столика по оси Y"
                                        }
                                        value={scaleY}
                                        onChange={(e) =>
                                            setScaleY(Number(e.target.value))
                                        }
                                    />
                                    <div className={"invalid-feedback"}>
                                        Неверно указан масштаб Y
                                    </div>
                                </Form.Group>
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
                            {table.id ? "Изменить" : "Добавить"}
                        </Button>
                    </Modal.Footer>
                </Form>
            )}
        </Modal>
    );
}
