import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Pageable, SortOrder } from "./pagination.pageable";

export const Pagination = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const [sort, order] = request.query.sort?.split(",") ?? [];
    const pageable: Pageable = {
      page: Number(request.query.page) || 0,
      size: Number(request.query.size) || 4,
      sort: sort || "id",
      order: order === SortOrder.Desc ? SortOrder.Desc : SortOrder.Asc,
    };
    return pageable;
  }
);
