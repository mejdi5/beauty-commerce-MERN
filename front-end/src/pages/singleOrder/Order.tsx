import React,{useState, useEffect} from 'react'
import './Order.css'
import { useNavigate, useParams } from 'react-router-dom'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useTypedSelector, useTypedDispatch } from '../../Redux/Hooks'
import { OrderType } from '../../Redux/orderSlice';
import { CartProduct } from '../../Redux/cartSlice';
import StripeCheckout from "react-stripe-checkout";
import axios from 'axios'
import { getOrder } from '../../Redux/orderSlice';

const Order : React.FC = () => {

    const navigate = useNavigate() 
    const orders = useTypedSelector<OrderType[] | null>(state => state.orderSlice.orders)
    const orderId = useParams().orderId
    const order = orders?.find(order => order._id === orderId)
    const [stripeToken, setStripeToken] = useState<any>(null);
    const dispatch = useTypedDispatch()

    const setPaidOrder = async () => {
        try {
            const res = await axios.put(`/api/orders/${orderId}`, {status: 'paid'})
            dispatch(getOrder(res.data))
        } catch (error) {
            console.log(error)
        }
    }

    const handleToken: StripeCheckout['props']['token'] = (token) => {
        setStripeToken(token)
    }
    console.log('stripeToken', stripeToken)
    
    
    useEffect(() => {
        const makePayment = async () => {
        if (stripeToken) {
            try {
                const res = await axios.post("/api/checkout/payment", {
                    tokenId: stripeToken?.id,
                    amount: order?.amount,
                });
                console.log('res.data', res.data)
                setPaidOrder()
            } catch (error) {
                console.log(error)
            }
        }
        };
        stripeToken && makePayment();
    }, [stripeToken, order?.amount]);


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
                {order?.status !== 'paid' 
                ? 
                    <StripeCheckout
                    name="SHOP"
                    currency="USD"
                    description={`Your total is $${order?.amount}`}
                    token={handleToken}
                    stripeKey='pk_test_51LCvZ0Joau4C3cg0NnbWAzIZlzVcFSMxg64k4av2Xm2cKSSY4cFlFY5QQ3JyWOoGWCVLe2jffVCxquFRpfEnbiya00piblEe3q' //stripe public key
                    />
                : 
                <p className='order-paid'>Order Paid</p>
                }
            </div>
        </div>
    </div>
</div>
)
}

export default Order