export interface CreateAddressDto {
    country: string;
    locality: string;
    street?: string;
    house: string;
    apartment?: string;
    user: number;
}
