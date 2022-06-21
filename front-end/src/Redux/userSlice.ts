import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserType {
    _id: String,
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
            localStorage.setItem('token', action.payload.token);
            state.isLoading = false
            state.user = action.payload.user;
            state.msg = action.payload.msg;
        },
        registerSuccess : (state: State, action: PayloadAction<any>) => {
            localStorage.setItem('token', action.payload.token);
            state.isLoading = false;
            state.user = action.payload.savedUser;
            state.msg = action.payload.msg;
        },
        authFailure : (state: State) => {
            state.isLoading = false
            state.msg = "Something went wrong"
        },
        
        logoutUser: (state: State) => {
            localStorage.removeItem('token');
            state.isLoading = false;
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




