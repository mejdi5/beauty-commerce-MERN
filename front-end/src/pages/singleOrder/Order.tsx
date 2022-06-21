import React from 'react'
import './Order.css'
import { useNavigate, useParams } from 'react-router-dom'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useTypedSelector } from '../../Redux/Hooks'
import { OrderType } from '../../Redux/orderSlice';
import { CartProduct } from '../../Redux/cartSlice';


const Order : React.FC = () => {

    const navigate = useNavigate() 
    const orders = useTypedSelector<OrderType[] | null>(state => state.orderSlice.orders)
    const orderId = useParams().orderId
    const order = orders?.find(order => order._id === orderId)

return (
<div className='App'>
    <div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
    <h5>ID: {orderId}</h5>
    <div className='order-container'>
        <div className='order-wrapper'>
            {order?.products?.map((item: CartProduct) => 
            <div className='order-item-wrapper' key={item?.product?._id}>
                <div className='order-header'>
                    <h3 className='order-item-title'>{item?.product?.title}</h3>
                </div>
                <img src={item?.product?.image} className='order-item-image'/>
                <div className='order-item'>
                    <div className='order-item-info'>
                        <p>Unit Price: {item?.product?.price}$</p>
                        <div>Quantity: {item?.productQuantity}</div>
                        <p>Price: {item?.product?.price*item?.productQuantity}$</p>
                    </div>
                </div>
            </div>
        )}
            <div className='order-footer'>
                <h2>Total Price: {order?.amount}$</h2>
            </div>
        </div>
    </div>
</div>
)
}

export default Order