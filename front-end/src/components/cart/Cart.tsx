import React from 'react'
import './Cart.css'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useTypedSelector, useTypedDispatch } from '../../Redux/Hooks'
import { ProductType } from '../../Redux/productSlice';
import { increase, decrease, reset } from '../../Redux/cartSlice';


const Cart = () => {

    const cartProducts = useTypedSelector<ProductType[]>(state => state.cartSlice.cartProducts)
    const productQuantity = useTypedSelector<number>(state => state.cartSlice.productQuantity)
    const dispatch = useTypedDispatch()

    console.log(cartProducts)
    console.log(productQuantity)

    const decreaseQuantity = () => {
        productQuantity > 1 && dispatch(decrease())
    }

    const increaseQuantity = () => {
        dispatch(increase())
    }


return (
<div className='cart-container'>
    <div className='cart-wrapper'>
        {cartProducts.map((cartProduct, index) => (
        <div className='cart-item-wrapper' key={index}>
            <h3 className='cart-item-title'>{cartProduct.title}</h3>
            <div className='cart-item'>
                <div className='cart-item-info'>
                    <p>{cartProduct.price}$</p>
                    <p>{cartProduct.price*productQuantity}$</p>
                </div>
                <div className='cart-item-icons'>
                    <div className='cart-remove-icon' onClick={decreaseQuantity}><RemoveIcon/></div>
                    <p>{productQuantity}</p>
                    <div className='cart-add-icon' onClick={increaseQuantity}><AddIcon/></div>
                </div>
                <img src={cartProduct.image} className='cart-item-image'/>
            </div>
        </div>
        ))}
        
        <h2>Total: 100$</h2>
        <button className='submit-cart-btn'>Submit</button>
    </div>
</div>
)}

export default Cart