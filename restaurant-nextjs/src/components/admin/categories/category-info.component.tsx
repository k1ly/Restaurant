import { CategoryDto } from "@/common/dto/categories/category.dto";
import { Button } from "@/components/page/button.component";

export interface CategoryInfoComponentProps {
    category: CategoryDto;
    updateCategory: () => void;
    deleteCategory: () => void;
}

export function CategoryInfoComponent({
    category,
    updateCategory,
    deleteCategory,
}: CategoryInfoComponentProps) {
    return (
        <tr>
            <td className={"fw-semibold"}>{category.id}</td>
            <td>{category.name}</td>
            <td>
                <div>
                    <div className={"d-flex justify-content-around float-end"}>
                        <Button
                            variant={"outline-primary"}
                            className={"mx-2"}
                            onClick={updateCategory}
                        >
                            Изменить
                        </Button>
                        <Button
                            variant={"outline-danger"}
                            className={"mx-2"}
                            onClick={deleteCategory}
                        >
                            Удалить
                        </Button>
                    </div>
                </div>
            </td>
        </tr>
    );
}
