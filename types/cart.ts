// ==========================================
// 1. Tầng dưới cùng: Các Kiểu Dữ Liệu Bổ Trợ (Helper Types)
// ==========================================

export type ProductInCart = {
    id: number;
    title: string;
    price: number;
    quantity: number;
    total: number;
    discountPercentage: number;
    discountedTotal: number; 
};

// Kiểu dữ liệu đầu vào cho mảng products khi Add/Update
export type CartProductInput = {
    id: number;
    quantity: number;
};

// ==========================================
// 2. Tầng giữa: Đối tượng Giỏ hàng & Response chính
// ==========================================

export type Cart = {
    id: number;
    products: ProductInCart[]; 
    total: number;
    discountedTotal: number;
    userId: number;
    totalProducts: number; 
    totalQuantity: number;
};


export type CartList = {
    carts: Cart[]; 
    total: number;
    skip: number;
    limit: number;
};

// ==========================================
// 3. Tầng trên cùng: Request Bodys & Mở rộng Response
// ==========================================

export type AddCartRequest = {
    userId?: number; 
    products: CartProductInput[]; 
};

export type UpdateCartRequest = {
    merge?: boolean;
    products: CartProductInput[];
};


export type DeleteCartResponse = Cart & {
    isDeleted: boolean;
    deletedOn: string;  
};