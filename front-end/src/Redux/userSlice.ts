import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserType {
    firstName: String,
    lastName: String | undefined,
    email: String,
    password: String,
    isAdmin?: Boolean
}

interface State {
    token: String | null,
    msg: String | null,
    user: UserType | null,
    isLoading: Boolean,
}


const userSlice = createSlice({
    name: 'user',
    initialState: {
        token: localStorage.getItem('token'), 
        msg: null,
        user: null, 
        isLoading: false,
    },
    reducers: {
        authStart : (state: State) => {
            state.isLoading = true;
        },
        loginSuccess : (state: State, action: PayloadAction<any>) => {
            state.isLoading = false
            localStorage.setItem('token', action.payload.token);
            state.user = action.payload.user;
            state.msg = action.payload.msg;
        },
        registerSuccess : (state: State, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.user = action.payload.savedUser;
            state.msg = action.payload.msg;
        },
        authFailure : (state: State) => {
            state.isLoading = false
            state.msg = "Something went wrong"
        },
        logoutUser: (state: State) => {
            state.isLoading = false;
            localStorage.removeItem('token');
            state.token = null;
            state.user = null
        }
    }
})

const { actions, reducer } = userSlice


export const { authStart,
    loginSuccess,
    registerSuccess,
    authFailure,
    logoutUser,
} = actions;

export default reducer




