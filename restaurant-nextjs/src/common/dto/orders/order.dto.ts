import { StatusName } from "@/common/dto/statuses/status.name";

export interface OrderDto {
    id: number;
    price: number;
    specifiedDate: string;
    orderDate: string;
    deliveryDate: string;
    address: number;
    status: StatusName;
    customer: number;
    manager: number;
}
