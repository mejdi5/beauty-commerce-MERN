import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProductType {
    _id: string,
    title: string,
    description: string,
    image: string,
    categories: string[],
    price: number,
    inStock: boolean, 
    createdAt?: any,
    updatedAt?: any
}

interface State {
    products : ProductType[],
    isFetching: Boolean,
    category: String | undefined,
    sort: String ,
    allCategories: String[]
}

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        isFetching: false,
        category: "",
        sort: "recent",
        allCategories: []
    },
    reducers: {
    getProducts: (state: State, action: PayloadAction<any>) => {
        state.isFetching = true
        state.products = action.payload
        state.isFetching = false
    },
    getCategory: (state: State, action: PayloadAction<any>) => {
        state.category = action.payload
    },
    getSort: (state: State, action: PayloadAction<any>) => {
        state.sort = action.payload
    },
    getAllCategories: (state: State, action: PayloadAction<any>) => {
        state.allCategories = action.payload
    }, 
    }
})

const { actions, reducer } = productSlice

export const { 
    getProducts,
    getCategory,
    getSort,
    getAllCategories
} = actions;

export default reducer