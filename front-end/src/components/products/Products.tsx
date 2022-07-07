import React,{useEffect} from 'react'
import './Products.css'
import { useTypedSelector, useTypedDispatch } from '../../Redux/Hooks'
import { getCategory, getProducts } from '../../Redux/productSlice';
import { ProductType } from '../../Redux/productSlice'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import {UserType} from "../../Redux/userSlice"
import {getAllProductImages, ProductImageType} from '../../Redux/productImageSlice'

interface Props {
    filterProductsWord: string,
}

const Products : React.FC<Props> = ({filterProductsWord}) => {

    const user = useTypedSelector<UserType | null>(state => state.userSlice.user)
    const products = useTypedSelector<ProductType[]>(state => state.productSlice.products)
    const productImages = useTypedSelector<ProductImageType[] | never[]>(state => state.productImageSlice.productImages)
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
        const getProductImages = async () => {
            try {
            const res = await axios.get("/api/product-images"); 
            dispatch(getAllProductImages(res.data));
            } catch (error) {
                console.log(error.message)
            }
        };
        fetchProducts();
        getProductImages()
    }, [category, sort])

    let filteredProducts = 
    //filter products by title or category
        products.filter(product => 
            product.categories.some(cat => cat.toLowerCase().trim().startsWith(filterProductsWord.toLowerCase().trim())) 
            || 
            product.title.toLowerCase().trim().startsWith(filterProductsWord.toLowerCase().trim()))

    if ((!category && !user?.isAdmin)) {
        filteredProducts = filteredProducts.slice(0,6)
    }


return (
<div className='products-container row-md-8'>
    {filteredProducts.map((product:ProductType, index ) => {
        const productImage = productImages.find((img: ProductImageType) => img?.productId === product?._id)
    return (
        <div className='product-wrapper' key={index}>
            <small className='product-categories'>{product.categories.join(' / ').toUpperCase()}</small>
            <div className='product-title'>{product.title}</div>
            <small className='out-of-stock'>{!product.inStock && "Out Of Stock"}</small>
            <Link to={`/product/${product._id}`}>
                <img src={`/images/${productImage?.path}`} className='product-image'/>
            </Link>
            <div className='product-price'>
                {product.price}$   
            </div>
        </div>
    )})}
</div>
)}

export default Products