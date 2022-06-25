import React,{useState, useEffect} from 'react'
import './Slider.css'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import axios from 'axios'
import { ProductType } from '../../Redux/productSlice'
import {Link} from 'react-router-dom'
import { useTypedSelector } from '../../Redux/Hooks'


const Slider : React.FC = () => {

    const [slideIndex, setSlideIndex] = useState(1)
    const [slideProducts, setSlideProducts] = useState([])
    const products = useTypedSelector<ProductType[]>(state => state.productSlice.products)

    //move to next slide
    const nextSlide = () => {
        if(slideIndex !== slideProducts.length){
            setSlideIndex(slideIndex + 1)
        } 
        else if (slideIndex === slideProducts.length){
            setSlideIndex(1)
        }
    }

    //move to previous slide
    const prevSlide = () => {
        if(slideIndex !== 1){
            setSlideIndex(slideIndex - 1)
        }
        else if (slideIndex === 1){
            setSlideIndex(slideProducts.length)
        }
    }

    //move slides by dots
    const moveDot = (index : number) => {
        setSlideIndex(index)
    }

    useEffect(() => {
        const getSlideProducts = async () => {
            try {
                const res = await axios.get('/api/products')
                setSlideProducts(res.data.slice(0,10))
            } catch (error: any) {
                console.log('error', error.message)
            }}
        getSlideProducts()
    }, [products])
    

    //automatic slide move
    useEffect(() => {
    setTimeout(() => {
        nextSlide()
    }, 10000)
    }, [slideIndex])
    

return (
<div className='slider-container'>
    <div 
    className='slider-arrow left-arrow'
    onClick={prevSlide}
    >
        <NavigateBeforeIcon />
    </div>
    <div className='slide-wrapper'>
    {slideProducts.map((slideProduct: ProductType, index) => {
                return (
                    <div 
                    className={slideIndex === index + 1 ? "slide active" : "slide"}
                    key={index}
                    >
                        <img className='slide-image' src={slideProduct.image} />
                        <div className='slide-info'>
                            <h1 className='slide-title'>{slideProduct.title}</h1>
                            <p className='slide-description'>{slideProduct.description}</p>
                        </div>
                    </div>
                )
    })}
        <div className="slide-dots">
                {Array.from({length: slideProducts.length}).map((item, index) => (
                    <div 
                    key={index}
                    onClick={() => moveDot(index + 1)}
                    className={slideIndex === index + 1 ? "dot active" : "dot"}
                    ></div>
                ))}
        </div>
    </div>
    <div 
    className='slider-arrow right-arrow'
    onClick={nextSlide}
    >
        <NavigateNextIcon/>
    </div>
</div>
)
}

export default Slider