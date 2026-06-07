import { ID } from './common';
export type LoginRequest = {
    username: string;
    password: string;
};

export type LoginResponse = {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
};

export type GetCurrentUserResponse = {
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    birthDate: string;
    image: string;
    bloodGroup: string;
    height: number;
    weight: number;
    eyeColor: string;

    hair: {
        color: string;
        type: string;
    };

    ip: string;

    address: {
        address: string;
        city: string;
        state: string;
        stateCode: string;
        postalCode: string;
        coordinates: {
            lat: number;
            lng: number;
        };
        country: string;
    };

    macAddress: string;
    university: string;

    bank: {
        cardExpire: string;
        cardNumber: string;
        cardType: string;
        currency: string;
        iban: string;
    };

    company: {
        department: string;
        name: string;
        title: string;
        address: {
            address: string;
            city: string;
            state: string;
            stateCode: string;
            postalCode: string;
            coordinates: {
                lat: number;
                lng: number;
            };
            country: string;
        };
    };

    ein: string;
    ssn: string;
    userAgent: string;

    crypto: {
        coin: string;
        wallet: string;
        network: string;
    };

    role: string;
};

export type UserRole = 'admin' | 'user' | 'guest';

export type UserProfile = {
    id: ID;
    username: string;
    email: string;
    role: UserRole;
    createdAt?: string;
    updatedAt?: string;
};

export type CreateUserRequest = {
    username: string;
    email: string;
    password: string;
    role?: UserRole;
};

export type UpdateUserRequest = {
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
};

export type UserListQuery = {
    page?: number;
    limit?: number;
    search?: string;
};

export type UserListResponse = {
    users: UserProfile[];
    total: number;
};

export type RefreshTokenRequest = {
    refreshToken?: string;     // optional
    expiresInMins?: number;    // optional (default: 60)
};

export type RefreshTokenResponse = {
    accessToken: string;
    refreshToken?: string; // có thể có hoặc không
    expiresIn: number;     // thời gian hết hạn (giây hoặc phút tùy API)
}