import React from 'react'
import './Cart.css'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTypedSelector, useTypedDispatch } from '../../Redux/Hooks'
import axios from 'axios'
import { CartProduct, getUserCart } from '../../Redux/cartSlice';


const Cart : React.FC = () => {

    const cart = useTypedSelector(state => state.cartSlice.cart)
    const dispatch = useTypedDispatch()


const decreaseProductQuantity = async (productId: string) => {
    if(cart?._id) {
        const editedCart = {
            cartProducts: cart.cartProducts.map((item: CartProduct) => 
                item?.product?._id === productId 
                ? {...item, productQuantity: item?.productQuantity - 1}
                : item),
            quantity: cart.cartProducts.length > 0 ? cart.cartProducts.map((item: CartProduct) => item?.productQuantity).reduce((a,b) => a + b) : 0,
            total: cart.cartProducts.length > 0 ? cart.cartProducts.map((item: CartProduct) => item?.product.price*item.productQuantity).reduce((a,b) => a + b) : 0
        }
        try {
            const res = await axios.put(`http://localhost:5000/api/carts/${cart._id}`, editedCart)
            dispatch(getUserCart(res.data)) 
        } catch (error) {
            console.log(error)
        }
    }
}

const increaseProductQuantity = async (productId: string) => {
    if(cart?._id) {
        const editedCart = {
            cartProducts: cart.cartProducts.map((item: CartProduct) => 
                item?.product?._id === productId 
                ? {...item, productQuantity: item?.productQuantity + 1}
                : item),
            quantity: cart.cartProducts.length > 0 ? cart.cartProducts.map((item: CartProduct) => item?.productQuantity).reduce((a,b) => a + b) : 0,
            total: cart.cartProducts.length > 0 ? cart.cartProducts.map((item: CartProduct) => item?.product.price*item.productQuantity).reduce((a,b) => a + b) : 0
        }
        try {
            const res = await axios.put(`http://localhost:5000/api/carts/${cart._id}`, editedCart)
            dispatch(getUserCart(res.data)) 
        } catch (error) {
            console.log(error)
        }
    }
}

const removeProductFromCart = async (productId: string) => {
    if(cart?._id) {
        const editedCart = {
            cartProducts: cart.cartProducts.filter((item: CartProduct) => item?.product?._id !== productId),
            quantity: cart.cartProducts.length > 0 ? cart.cartProducts.map((item: CartProduct) => item?.productQuantity).reduce((a,b) => a + b) : 0,
            total: cart.cartProducts.length > 0 ? cart.cartProducts.map((item: CartProduct) => item?.product.price*item.productQuantity).reduce((a,b) => a + b) : 0
        }
        try {
            const res = await axios.put(`http://localhost:5000/api/carts/${cart._id}`, editedCart)
            dispatch(getUserCart(res.data)) 
        } catch (error) {
            console.log(error)
        }
    }
}

const resetCart = async () => {
    if(cart?._id) {
        const resettedCart = {
            cartProducts: [],
            quantity: 0,
            total: 0
        }
        try {
            const res = await axios.put(`http://localhost:5000/api/carts/${cart._id}`, resettedCart)
            dispatch(getUserCart(res.data)) 
        } catch (error) {
            console.log(error)
        }
    }
}

return (
<div className='cart-container'>
<div className='cart-wrapper'>
    {cart.cartProducts.length > 0 && cart.cartProducts.map((item: CartProduct) => 
    <div className='cart-item-wrapper' key={item?.product?._id}>
        <div className='cart-header'>
            <h3 className='cart-item-title'>{item?.product?.title}</h3>
            <button 
            className="btn-close" 
            onClick={() => removeProductFromCart(item.product._id)}
            ></button>
        </div>
        <div className='cart-item'>
            <div className='cart-item-info'>
                <p>{item?.product?.price}$</p>
                <p>{item?.product?.price*item?.productQuantity}$</p>
            </div>
            <div className='cart-item-icons'>
                <div className='cart-remove-icon' onClick={() => item?.productQuantity > 1 && decreaseProductQuantity(item.product._id)}><RemoveIcon/></div>
                <div>{item?.productQuantity}</div>
                <div className='cart-add-icon' onClick={() => increaseProductQuantity(item.product._id)}><AddIcon/></div>
            </div>
            <img src={item?.product?.image} className='cart-item-image'/>
        </div>
    </div>
    )}
    {cart.cartProducts.length > 0 && 
    <div className='cart-footer'>
        <h2>Total: {cart.total}$</h2>
        <div className='reset-cart' onClick={() => resetCart()}><DeleteIcon/></div>
    </div>
    }
    {cart.cartProducts.length > 0 && <button className='submit-cart-btn' /*onClick={() => dispatch(resetCart())}*/>Submit</button>}
</div>
    {cart.cartProducts.length === 0 && <div className='cart-wrapper empty'>Cart is empty</div>}
</div>
)}

export default Cart