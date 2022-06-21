import React,{useEffect} from 'react'
import './Products.css'
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useTypedSelector, useTypedDispatch } from '../../Redux/Hooks'
import { getCategory, getProducts } from '../../Redux/productSlice';
import { ProductType } from '../../Redux/productSlice'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const Products : React.FC = () => {

    const products = useTypedSelector<ProductType[]>(state => state.productSlice.products)
    const sort = useTypedSelector<string>(state => state.productSlice.sort)
    const category = useTypedSelector(state => state.productSlice.category)
    const dispatch = useTypedDispatch()
    const paramsCategory = useParams()?.category

    useEffect(() => {
        const fetchProducts = async () => {
        try {
            dispatch(getCategory(paramsCategory));

            const res = await axios.get(category
                ? `http://localhost:5000/api/products?category=${category}`
                : `http://localhost:5000/api/products`);
    
            let sortedProducts = 
                sort === "price" ? res.data.sort((a: ProductType, b: ProductType) => a.price - b.price)
                : sort === "alphabetical order" ? res.data.sort((a: ProductType, b: ProductType) => a.title.toLowerCase().localeCompare(b.title))
                : res.data.sort((a: ProductType, b: ProductType) => a.price - b.price);

            dispatch(getProducts(sortedProducts));

        } catch (error: any) {
            console.log('error', error.message)
        }}
        fetchProducts()
    }, [category, sort])


    const filteredProducts = category
        ? products
        : products.slice(0,8)

return (
<div className='products-container row-md-8'>
    {filteredProducts.map((product:ProductType, index )=> (
        <div className='product-wrapper' key={index}>
            <div className='product-title'>{product.title}</div>
            <Link to={`/product/${product._id}`}>
                <img src={product.image} className='product-image'/>
            </Link>
            <div className='product-price'>
                {product.price}$
            </div>
        </div>
    ))}
</div>
)}

export default Products