import { CategoryDto } from "@/common/dto/categories/category.dto";
import api from "@/common/util/api";
import { ErrorHandler } from "@/components/error/error-handler.component";
import { Pageable, PageableData } from "@/components/page/pagination.component";
import { SpinnerComponent } from "@/components/page/spinner.component";
import { Sort } from "@/pages/menu";
import styles from "@/styles/menu.module.sass";
import clsx from "classnames";
import Link from "next/link";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";

export interface CategoryListComponentProps {
    setError: ErrorHandler;
    category: CategoryDto;
    size: number;
    sort: Sort;
}

export function CategoryListComponent({
    setError,
    category,
    size,
    sort,
}: CategoryListComponentProps) {
    const [categories, setCategories] = useState<CategoryDto[]>();
    const [pageable, setPageable] = useState<Pageable>({ size: 20 });
    const loadCategories = async () => {
        try {
            const categoriesData: PageableData<CategoryDto> = await api.get(
                "/api/categories",
                {
                    params: {
                        size: pageable.size,
                    },
                }
            );
            setCategories(categoriesData.content);
            setPageable(categoriesData.pageable);
        } catch (error: any) {
            setError(error);
        }
    };
    useEffect(() => {
        loadCategories();
    }, []);
    return (
        <div className={styles["category-list"]}>
            {categories && (
                <Nav className={"flex-column"}>
                    {categories.map((c) => (
                        <Link
                            key={c.id}
                            href={`?${queryString.stringify({
                                category: c.id,
                                size,
                                sort,
                            })}`}
                            className={"text-decoration-none"}
                        >
                            <Nav.Link
                                as={"div"}
                                className={clsx(styles["category-nav-link"], {
                                    [styles["active"]]: c.id === category?.id,
                                })}
                            >
                                {c.name}
                            </Nav.Link>
                        </Link>
                    ))}
                </Nav>
            )}
            <div className={styles["category-list-footer"]}>
                {!categories && <SpinnerComponent size={"md"} />}
            </div>
        </div>
    );
}
