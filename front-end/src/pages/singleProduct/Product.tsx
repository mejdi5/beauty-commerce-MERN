import React,{useState} from 'react'
import Footer from '../../components/footer/Footer'
import Navbar from '../../components/navbar/Navbar'
import './Product.css'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useNavigate, useParams } from 'react-router-dom';
import { useTypedSelector, useTypedDispatch } from '../../Redux/Hooks'
import { ProductType } from '../../Redux/productSlice';
import { addToCart, increase, decrease, reset } from '../../Redux/cartSlice';


const Product : React.FC = () => {

    const dispatch = useTypedDispatch()
    const products = useTypedSelector<ProductType[]>(state => state.productSlice.products)
    const navigate = useNavigate()
    const productId = useParams().productId
    const product = products.find(p => p._id === productId)

    const productQuantity = useTypedSelector<number>(state => state.cartSlice.productQuantity)

    const increaseQuantity = () => {
        dispatch(increase())
    }

    const decreaseQuantity = () => {
        productQuantity > 1 && dispatch(decrease())
    }

    const AddProductToCart = () => {
        dispatch(addToCart({...product, productQuantity}));
        reset();
    }
    
return (
<div className='App'>
<div>
    <Navbar/>
    <div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
    <div className='product-wrapper'>
        <div className='product-info'>
            <h1 className='product-title'>{product?.title} </h1>
            <img src={product?.image} className='product-image'/>
            <span className='product-price'>{product?.price}$</span>
            <p className='product-description'>{product?.description}</p>
        </div>
        <div className='product-amount'>
            <div className='amount'>
                <div className='set-amount' onClick={decreaseQuantity}><RemoveIcon/></div>
                <span className='amount-number'>{productQuantity}</span>
                <div className='set-amount' onClick={increaseQuantity}><AddIcon/></div>
            </div>
            <button className='amount-btn' onClick={AddProductToCart}>Add to cart</button>
        </div>
    </div>
    <Footer/>
</div>
</div>
)}

export default Product