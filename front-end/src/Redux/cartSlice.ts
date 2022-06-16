import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductType } from "./productSlice";

export interface CartType {
    userId : String,
    products: [{productId: String, quantity: Number}]
}

interface State {
    cartProducts: ProductType[],
    productQuantity: number,
    quantity: number,
    total: number
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartProducts: [],
        productQuantity: 1,
        quantity: 0,
        total: 0
    },
    reducers: {
    addToCart: (state: State, action: PayloadAction<any>) => {
        state.cartProducts = [...state.cartProducts, action.payload]
        state.quantity += 1
        state.total += action.payload.quantity * action.payload.price
    },
    increase: (state: State) => {
        state.productQuantity += 1
    },
    decrease: (state: State) => {
        state.productQuantity -= 1
    },
    reset: (state: State) => {
        state.productQuantity = 1
    }
    }
})

const { actions, reducer } = cartSlice

export const { addToCart,
    increase,
    decrease,
    reset 
} = actions;

export default reducer