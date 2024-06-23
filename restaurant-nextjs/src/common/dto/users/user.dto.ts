import { RoleName } from "@/common/dto/roles/role.name";

export interface UserDto {
    id: number;
    login: string;
    name: string;
    email: string;
    phone: string;
    blocked: boolean;
    role: RoleName;
    order: number;
}
