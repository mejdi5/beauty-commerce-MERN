import React from 'react'
import Announcement from '../components/announcement/Announcement'
import Categories from '../components/categories/Categories'
import Footer from '../components/footer/Footer'
import Navbar from '../components/navbar/Navbar'
import Newsletter from '../components/newsletter/Newsletter'
import Products from '../components/products/Products'
import Slider from '../components/slider/Slider'
import { useTypedSelector } from '../Redux/Hooks'



const Home : React.FC = () => {

  const isLoading = useTypedSelector(state => state.userSlice.isLoading)
  const isFetching = useTypedSelector(state => state.productSlice.isFetching)

return (
<div className='App' style={(isLoading || isFetching) ? {opacity: 0.2} : {opacity: 1}}>
  <div>
    <Announcement/>
    <Navbar />
    <Slider/>
    <Categories/>
    <Products/>
    <Newsletter/>
    <Footer/>
  </div>
</div>
  )
}

export default Home