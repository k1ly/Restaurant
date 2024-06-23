import { CategoryDto } from "@/common/dto/categories/category.dto";
import { CreateCategoryDto } from "@/common/dto/categories/create-category.dto";
import api from "@/common/util/api";
import { CategoryFormComponent } from "@/components/admin/categories/category-form.component";
import { CategoryInfoComponent } from "@/components/admin/categories/category-info.component";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { Button } from "@/components/page/button.component";
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

export enum CategorySort {
    Id = "id",
    Name = "name",
}

export type FormCategoryDto = Partial<CategoryDto> & CreateCategoryDto;

export const defaultCategoryDto: FormCategoryDto = {
    name: "",
};

export interface CategoryListComponentProps {
    setError: ErrorHandler;
}

export function CategoryListComponent({
    setError,
}: CategoryListComponentProps) {
    const [categories, setCategories] = useState<CategoryDto[]>();
    const [total, setTotal] = useState<number>();
    const [pageable, setPageable] = useState<Pageable>({ size: 10 });
    const [category, setCategory] = useState<FormCategoryDto>();
    const [search, setSearch] = useState("");
    const [notification, setNotification] = useState<string>();
    const loadCategories = async () => {
        try {
            const categoriesData: PageableData<CategoryDto> = await api.get(
                "/api/categories",
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
            setCategories(categoriesData.content);
            setTotal(categoriesData.total);
            setPageable(categoriesData.pageable);
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
        loadCategories();
    };
    const addCategory = async (categoryDto: CreateCategoryDto) => {
        await api.post("/api/categories", categoryDto);
        setCategory(null);
        setNotification("Категория успешно добавлена!");
        loadCategories();
    };
    const updateCategory = async (
        id: number,
        categoryDto: CreateCategoryDto
    ) => {
        await api.put(`/api/categories/${id}`, categoryDto);
        setCategory(null);
        setNotification("Категория успешно изменена!");
        loadCategories();
    };
    const deleteCategory = async (id: number) => {
        try {
            await api.delete(`/api/categories/${id}`);
            setNotification("Категория успешно удалена!");
            loadCategories();
        } catch (error: any) {
            setError(error);
        }
    };
    useEffect(() => {
        loadCategories();
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
                    <div className={"fs-5"}>Администратор: категории</div>
                </Toast.Header>
                <Toast.Body>{notification}</Toast.Body>
            </Toast>
            <CategoryFormComponent
                setError={setError}
                category={category}
                addCategory={(categoryDto) => addCategory(categoryDto)}
                updateCategory={(categoryDto) =>
                    updateCategory(category?.id, categoryDto)
                }
                onClose={() => setCategory(null)}
            />
            <div className={"p-4"}>
                <Button
                    variant={"success"}
                    className={"px-2 w-100 fs-4"}
                    onClick={() => setCategory(defaultCategoryDto)}
                >
                    Добавить категорию
                </Button>
            </div>
            <SearchComponent
                search={search}
                setSearch={setSearch}
                submit={() => {
                    pageable.page = 0;
                    loadCategories();
                }}
            />
            {categories ? (
                total > 0 ? (
                    <>
                        <PaginationComponent
                            total={total}
                            pageable={pageable}
                            setPage={(page) => {
                                pageable.page = page;
                                loadCategories();
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
                                                handleSort(CategorySort.Id)
                                            }
                                        >
                                            ID
                                            {pageable.sort === CategorySort.Id
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
                                                handleSort(CategorySort.Name)
                                            }
                                        >
                                            Название
                                            {pageable.sort === CategorySort.Name
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
                                    {categories.map((category) => (
                                        <CategoryInfoComponent
                                            key={category.id}
                                            category={category}
                                            updateCategory={() =>
                                                setCategory(category)
                                            }
                                            deleteCategory={() =>
                                                deleteCategory(category.id)
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
                        <div className={"fs-3"}>Список категорий пуст</div>
                    </div>
                )
            ) : (
                <SpinnerComponent size={"lg"} />
            )}
        </div>
    );
}
