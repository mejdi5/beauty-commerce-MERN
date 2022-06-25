import React,{useEffect} from 'react'
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
import { UserType } from './Redux/userSlice';
import  { getUserCart }  from './Redux/cartSlice';
import ForgotPassword from './pages/auth/forgotPassword/ForgotPassword';
import PasswordReset from './pages/auth/passwordReset/PasswordReset';


const App : React.FC = () => {

  const user = useTypedSelector<UserType | null>(state => state.userSlice.user)
  const isLoading = useTypedSelector(state => state.userSlice.isLoading)
  const dispatch = useTypedDispatch()

  const postCart = async () => {
    if (user && user?.verified) {
      try {
        const newCart = {
          userId: user?._id,
          cartProducts: [],
          quantity: 0,
          total: 0
      }
        const res = await axios.post(`http://localhost:5000/api/carts`, newCart)
        dispatch(getUserCart(res.data)) 
      } catch (error) {
        console.log(error)
      }
    }
  }

  const getCart = async () => {
    if (user && user?.verified) {
      try {
        const res = await axios.get(`http://localhost:5000/api/carts/${user._id}`)
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

  if (isLoading) {
    return (
      <div className="spinner-border" role="status" >
          <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/products/:category" element={user ? <ProductList/> : <Navigate to="/"/>}/>
          <Route path="/products" element={user ? <ProductList/> : <Navigate to="/"/>}/>
          <Route path='/product/:productId' element={user ? <Product/> : <Navigate to="/"/>}/>
          <Route path='/orders/:userId' element={(user && user?.verified) ? <Orders/> : <Navigate to="/"/>}/>
          <Route path='/order/:orderId' element={(user && user?.verified) ? <Order/> : <Navigate to="/"/>}/>
          <Route path='/login' element={user ? <Navigate to="/"/> : <Login/>}/>
          <Route path='/register' element={user ? <Navigate to="/"/> : <Register/>}/>
          <Route path="/verify/:id/:token" element={<EmailVerify />} />
          <Route path='/forgot-password' element={user ? <Navigate to="/"/> : <ForgotPassword/>}/>
          <Route path='/password-reset/:id/:token' element={user ? <Navigate to="/"/> : <PasswordReset/>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
