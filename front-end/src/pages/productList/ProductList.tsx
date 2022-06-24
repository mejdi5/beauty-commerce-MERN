import React from 'react'
import Footer from '../../components/footer/Footer'
import Navbar from '../../components/navbar/Navbar'
import Products from '../../components/products/Products'
import './ProductList.css'
import { useNavigate} from 'react-router-dom'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useTypedSelector, useTypedDispatch } from '../../Redux/Hooks'
import { getSort } from '../../Redux/productSlice'
import { ProductType } from '../../Redux/productSlice'
import { UserType } from '../../Redux/userSlice'
import ActivateAccount from '../../components/activateAccount/ActivateAccount'


const ProductList : React.FC = () => {

    const products = useTypedSelector<ProductType[]>(state => state.productSlice.products)
    const user = useTypedSelector<UserType | null>(state => state.userSlice.user)
    const category = useTypedSelector(state => state.productSlice.category)
    const dispatch = useTypedDispatch()
    const navigate = useNavigate()
    

return (
<div className='App'>
<div>
    <Navbar/>
    {(user && !user.verified) && <ActivateAccount/>}
    <div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
    <h1 className='products-title'>{typeof category === 'string' && category?.toUpperCase()}</h1>
    <div className='products-filter'>
        <div className='filter'>
            <span className='filterText'>Filter</span>
            <select className='select'>
                <option></option>
                <option></option>
                <option></option>
            </select>
        </div>
        <div className='filter'>
            <span className='filterText'>Sort</span>
            <select className='select' onChange={e => dispatch(getSort(e.target.value))}>
                <option disabled value="sort by">Sort By</option>
                <option value="recent">Recent</option>
                <option value="price">Price</option>
                <option value="alphabetical order">Alphabetical</option>
            </select>
        </div>
    </div>
    <Products/>
    <Footer/>
</div>
</div>
)}

export default ProductList