import React from 'react'
import './App.css';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home'
import ProductList from './pages/productList/ProductList';
import Product from './pages/singleProduct/Product';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import { useTypedSelector } from './Redux/Hooks'

const App : React.FC = () => {

  const user = useTypedSelector(state => state.userSlice.user)
  const isLoading = useTypedSelector(state => state.userSlice.isLoading)

  if (isLoading) {
    return (
      <div className="spinner-border" role="status" style={{ textAlign: 'center', marginTop: '50px' }}>
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
          <Route path='/login' element={user ? <Navigate to="/"/> : <Login/>}/>
          <Route path='/register' element={user ? <Navigate to="/"/> : <Register/>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
