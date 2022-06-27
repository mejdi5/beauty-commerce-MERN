import React,{useEffect} from 'react'
import './Products.css'
import { useTypedSelector, useTypedDispatch } from '../../Redux/Hooks'
import { getCategory, getProducts } from '../../Redux/productSlice';
import { ProductType } from '../../Redux/productSlice'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import {UserType} from "../../Redux/userSlice"

interface Props {
    filterProductsWord: string,
}

const Products : React.FC<Props> = ({filterProductsWord}) => {

    const user = useTypedSelector<UserType | null>(state => state.userSlice.user)
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
                ? `/api/products?category=${category}`
                : `/api/products`);
    
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


    let filteredProducts = 
    //filter products by title or category
        products.filter(product => 
            product.categories.some(cat => cat.toLowerCase().trim().startsWith(filterProductsWord.toLowerCase().trim())) 
            || 
            product.title.toLowerCase().trim().startsWith(filterProductsWord.toLowerCase().trim()))

    if ((!category && !user?.isAdmin)) {
        filteredProducts = filteredProducts.slice(0,8)
    }


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