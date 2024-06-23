import { CategoryDto } from "@/common/dto/categories/category.dto";
import { DishDto } from "@/common/dto/dishes/dish.dto";
import api from "@/common/util/api";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
import { useEffect, useState } from "react";

export interface DishInfoComponentProps {
    setError: ErrorHandler;
    dish: DishDto;
    updateDish: () => void;
    deleteDish: () => void;
}

export function DishInfoComponent({
    setError,
    dish,
    updateDish,
    deleteDish,
}: DishInfoComponentProps) {
    const [category, setCategory] = useState<CategoryDto>();
    const loadCategory = async () => {
        try {
            const categoryData: CategoryDto = await api.get(
                `/api/categories/${dish.category}`
            );
            setCategory(categoryData);
        } catch (error: any) {
            setError(error);
        }
    };
    useEffect(() => {
        loadCategory();
    }, []);
    return (
        <tr>
            <td className={"fw-semibold"}>{dish.id}</td>
            <td>{dish.name}</td>
            <td>{dish.description}</td>
            <td>{dish.weight} г.</td>
            <td>{dish.price} руб.</td>
            <td>{dish.discount} %</td>
            <td>{category?.name}</td>
            <td>
                <div>
                    <div className={"d-flex justify-content-around float-end"}>
                        <Button
                            variant={"outline-primary"}
                            className={"mx-2"}
                            onClick={updateDish}
                        >
                            Изменить
                        </Button>
                        <Button
                            variant={"outline-danger"}
                            className={"mx-2"}
                            onClick={deleteDish}
                        >
                            Удалить
                        </Button>
                    </div>
                </div>
            </td>
        </tr>
    );
}
