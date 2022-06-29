import React,{useEffect, useState} from 'react'
import './App.css';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import EmailVerify from './pages/auth/emailVerifcation/EmailVerify'
import Home from './pages/Home'
import ProductList from './pages/productList/ProductList';
import Product from './pages/singleProduct/Product';
import Orders from './pages/orders/Orders'
import Order from './pages/singleOrder/Order'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import { useTypedSelector } from './Redux/Hooks'
import axios from 'axios'
import { useTypedDispatch } from './Redux/Hooks'
import {  UserType } from './Redux/userSlice';
import  { getUserCart }  from './Redux/cartSlice';
import ForgotPassword from './pages/auth/forgotPassword/ForgotPassword';
import PasswordReset from './pages/auth/passwordReset/PasswordReset';
import AdminHome from './pages/adminPages/adminHome/AdminHome'
import Users from './pages/adminPages/users/Users';
import AllOrders from './pages/adminPages/allOrders/AllOrders';
import AllProducts from './pages/adminPages/allProducts/AllProducts'
import EditUser from './pages/adminPages/users/EditUser';
import AddUser from './pages/adminPages/users/AddUser';


const App: React.FC = () => {

  const user = useTypedSelector<UserType | null>(state => state.userSlice.user)
  const isLoading = useTypedSelector(state => state.userSlice.isLoading)
  const dispatch = useTypedDispatch()

  const [filterProductsWord, setFilterProductsWord] = useState("")

  const postCart = async () => {
    if (user && user?.verified) {
      try {
        const newCart = {
          userId: user?._id,
          cartProducts: [],
          quantity: 0,
          total: 0
      }
        const res = await axios.post(`/api/carts`, newCart)
        dispatch(getUserCart(res.data)) 
      } catch (error) {
        console.log(error)
      }
    }
  }

  const getCart = async () => {
    if (user && user?.verified) {
      try {
        const res = await axios.get(`/api/carts/${user._id}`)
        if(res.data?._id) {
          dispatch(getUserCart(res.data))
        } else {
            postCart()
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    user && user?.verified && getCart()
  }, [user])
  
/*
  if (isLoading) {
    return (
      <div className="spinner-border" role="status" >
          <span className="sr-only">Loading...</span>
      </div>
    );
  }
*/
  return (
    <BrowserRouter>
        <Routes>

          <Route path="/" element={(user && user.isAdmin) 
            ? 
            <AdminHome/> 
            : 
            <Home 
            filterProductsWord={filterProductsWord} 
            setFilterProductsWord={setFilterProductsWord} 
            />} 
          />

          <Route path="/products/:category" element={
            user 
            ? 
            <ProductList 
            filterProductsWord={filterProductsWord} 
            setFilterProductsWord={setFilterProductsWord} 
            /> 
            : <Navigate to="/"/>
            }
            />

          <Route path="/products" element={
            user 
            ? 
            <ProductList 
            filterProductsWord={filterProductsWord} 
            setFilterProductsWord={setFilterProductsWord} 
            /> 
            : 
            <Navigate to="/"/>
          }
          />

          <Route path='/product/:productId' element={
            user 
            ? 
            <Product/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path='/orders/:userId' element={
            (user && user?.verified) 
            ? 
            <Orders/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path='/order/:orderId' element={
            (user && user?.verified) 
            ? 
            <Order/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path='/login' element={
            user 
            ? 
            <Navigate to="/"/> 
            : 
            <Login/>
          }/>

          <Route path='/register' element={
            user 
            ? 
            <Navigate to="/"/> 
            : 
            <Register/>
          }/>

          <Route path="/verify/:id/:token" element={<EmailVerify />} />

          <Route path='/forgot-password' element={
            user 
            ? 
            <Navigate to="/"/> 
            : 
            <ForgotPassword/>
          }/>

          <Route path='/password-reset/:id/:token' element={
            user 
            ? 
            <Navigate to="/"/> 
            : 
            <PasswordReset/>
          }/>

          <Route path="/users" element={
            (user && user.isAdmin) 
            ? 
            <Users/> 
            : 
            <Navigate to="/"/>
          }/> 

          <Route path="/newUser" element={
            (user && user.isAdmin) 
            ? 
            <AddUser/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path="/user/:userId" element={
            (user && user.isAdmin) 
            ? 
            <EditUser/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path="/allOrders" element={
            (user && user.isAdmin) 
            ? 
            <AllOrders/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path="/allProducts" element={
            (user && user.isAdmin) 
            ? 
            <AllProducts/> 
            : 
            <Navigate to="/"/>
          }/>
          
        </Routes>
    </BrowserRouter>
  )
}



export default App;
