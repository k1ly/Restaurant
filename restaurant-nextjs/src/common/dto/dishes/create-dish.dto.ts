export interface CreateDishDto {
    name: string;
    description: string;
    imageUrl?: string;
    weight: number;
    price: number;
    discount: number;
    category: number;
}
