export interface CreateUserDto {
    login: string;
    name: string;
    password: string;
    matchingPassword: string;
    email: string;
    phone?: string;
}
