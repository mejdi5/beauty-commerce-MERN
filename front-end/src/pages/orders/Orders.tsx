import React,{useEffect} from 'react'
import './Orders.css'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useNavigate, Link} from 'react-router-dom'
import { useTypedSelector, useTypedDispatch } from '../../Redux/Hooks'
import {  OrderType, getOrders } from '../../Redux/orderSlice';
import { UserType } from '../../Redux/userSlice';
import axios from 'axios';


const Orders : React.FC = () => {

    const navigate = useNavigate()
    const orders = useTypedSelector<OrderType[] | null>(state => state.orderSlice.orders)
    const user = useTypedSelector<UserType | null>(state => state.userSlice.user)
    const dispatch = useTypedDispatch()

    useEffect(() => {
    const fetchOrders = async() => {
    if (user) {
        try {
            const res = await axios.get(`http://localhost:5000/api/orders/${user?._id}`)
            dispatch(getOrders(res.data))
        } catch (error) {
            console.log(error)
        }
    }}
    user && fetchOrders()
    }, [])
    

return (
<div className="App">
    <div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
    <div className="container-fluid">
    <h1 className='order-title'>All Orders</h1>
    {orders?.map(order => 
        <ul className="list-group" key={order?._id}>
            <Link to={`/order/${order?._id}`}>
            <li className="list-group-item">
                <p>Products: {order?.products.length}</p>
                <p>{order?.address}</p>
                <p>{order?.amount}$</p>
                <p>{order?.createdAt.substr(0, 10)}</p>
            </li>
            </Link>
        </ul>
    )}
</div>
</div>

)
}

export default Orders