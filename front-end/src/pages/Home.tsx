import React,{useEffect} from 'react'
import ActivateAccount from '../components/activateAccount/ActivateAccount'
import Announcement from '../components/announcement/Announcement'
import Categories from '../components/categories/Categories'
import Footer from '../components/footer/Footer'
import Navbar from '../components/navbar/Navbar'
import Products from '../components/products/Products'
import Slider from '../components/slider/Slider'
import { useTypedSelector } from '../Redux/Hooks'
import { UserType } from '../Redux/userSlice'

interface Props {
  filterProductsWord: string,
  setFilterProductsWord: React.Dispatch<React.SetStateAction<string>>,
}

const Home : React.FC<Props> = ({filterProductsWord, setFilterProductsWord}) => {

  const isLoading = useTypedSelector(state => state.userSlice.isLoading)
  const isFetching = useTypedSelector(state => state.productSlice.isFetching)
  const user = useTypedSelector<UserType | null>(state => state.userSlice.user)

  useEffect(() => {
    setFilterProductsWord("")
  }, [])
  
  

return (
<div className='App' style={(isLoading || isFetching) ? {opacity: 0.2} : {opacity: 1}}>
  <div>
    <Announcement/>
    <Navbar />
    {(user && !user.verified) && <ActivateAccount/>}
    <Slider/>
    <Categories/>
    <Products filterProductsWord={filterProductsWord}/>
    <Footer/>
  </div>
</div>
  )
}

export default Home