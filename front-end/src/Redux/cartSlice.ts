import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductType } from "./productSlice";

export interface CartProduct {
    product: ProductType,
    productQuantity: number
}

export interface CartType {
    _id?: string | null,
    userId : string | null,
    cartProducts: CartProduct[] | never[],
    quantity: number ,
    total: number ,
    cratedAt?: any,
    updatedAt?: any
}

interface State {
    cart: CartType | null,
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: {
            _id: null,
            userId: null,
            cartProducts: [],
            quantity: 0,
            total: 0,
        } ,
    },
    reducers: {
    getUserCart: (state: State, action: PayloadAction<CartType>) => {
        state.cart = action.payload
    }
}})

const { actions, reducer } = cartSlice

export const { getUserCart } = actions;

export default reducer