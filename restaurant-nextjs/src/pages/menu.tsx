import { CategoryDto } from "@/common/dto/categories/category.dto";
import { UserDto } from "@/common/dto/users/user.dto";
import api from "@/common/util/api";
import session from "@/common/util/session";
import { ErrorHandlerComponent } from "@/components/error/error-handler.component";
import { CategoryListComponent } from "@/components/menu/category-list.component";
import { DishListComponent } from "@/components/menu/dish-list.component";
import { PageComponent } from "@/components/page/page.component";
import { SortOrder } from "@/components/page/pagination.component";
import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

export enum DishSort {
    Name = "name",
    Price = "price",
    Discount = "discount",
}

export type Sort = `${string},${SortOrder}`;

export default function Menu() {
    const [error, setError] = useState<Error>();
    const [auth, setAuth] = useState<UserDto>();
    const [category, setCategory] = useState<CategoryDto>();
    const [filter, setFilter] = useState<string>();
    const [page, setPage] = useState<number>();
    const [size, setSize] = useState<number>();
    const [sort, setSort] = useState<Sort>();
    const router = useRouter();
    const query = useSearchParams();
    const loadCategory = async () => {
        try {
            const categoryData: CategoryDto = await api.get(
                `/api/categories/${query.get("category")}`
            );
            setCategory(categoryData);
        } catch (error: any) {
            setError(error);
        }
    };
    const authenticate = async () => {
        try {
            const authData: UserDto = await session.authenticate();
            setAuth(authData);
        } catch (error: any) {
            setError(error);
        }
    };
    useEffect(() => {
        authenticate();
    }, []);
    useEffect(() => {
        const category = query.get("category")
            ? Number(query.get("category"))
            : undefined;
        const page = query.get("page") ? Number(query.get("page")) : undefined;
        const size = query.get("size") ? Number(query.get("size")) : undefined;
        const [sort, order] = (query.get("sort")?.split(",") || []) as [
            string,
            SortOrder
        ];
        if (
            (query.get("category") &&
                (Number.isNaN(category) || category < 1)) ||
            (query.get("page") && (Number.isNaN(page) || page < 0)) ||
            (query.get("size") && (Number.isNaN(size) || size < 0)) ||
            (query.get("sort") &&
                (!Object.values(DishSort).includes(sort as DishSort) ||
                    !Object.values(SortOrder).includes(order as SortOrder)))
        ) {
            router.push(
                `?${queryString.stringify({
                    category: 1,
                })}`
            );
            return;
        }
        setCategory(null);
        setFilter(null);
        setPage(page);
        setSize(size);
        setSort(sort && order ? `${sort},${order}` : undefined);
        if (query.get("category")) {
            if (query.get("filter")) {
                router.push(
                    `?${queryString.stringify({
                        category,
                        size,
                        sort: sort && order ? `${sort},${order}` : undefined,
                    })}`
                );
                return;
            }
            loadCategory();
            return;
        }
        if (query.get("filter")) setFilter(query.get("filter"));
    }, [query]);
    return (
        <ErrorHandlerComponent error={error}>
            <Head>
                <title>Menu</title>
            </Head>
            <PageComponent setError={setError} auth={auth}>
                <Row className={"flex-nowrap flex-fill g-0"}>
                    <Col md={3} className={"d-flex flex-column flex-fill"}>
                        <CategoryListComponent
                            setError={setError}
                            category={category}
                            size={size}
                            sort={sort}
                        />
                    </Col>
                    <Col className={"d-flex flex-column flex-fill"}>
                        <DishListComponent
                            setError={setError}
                            auth={auth}
                            category={category}
                            filter={filter}
                            page={page}
                            size={size}
                            sort={sort}
                        />
                    </Col>
                </Row>
            </PageComponent>
        </ErrorHandlerComponent>
    );
}
