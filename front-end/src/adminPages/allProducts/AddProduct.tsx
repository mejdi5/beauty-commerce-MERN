import React,{FormEvent, useState, useEffect, KeyboardEvent} from 'react'
import "./AllProducts.css"
import Sidebar from '../../adminComponents/sidebar/Sidebar'
import {  useTypedDispatch, useTypedSelector } from '../../Redux/Hooks'
import { useNavigate, useParams } from 'react-router-dom'
import { ProductType } from '../../Redux/productSlice';
import axios from 'axios'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';


const AddProduct = () => {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [category, setCategory] = useState<string | null>(null)
    const [categories, setCategories] = useState<string[] | never[]>([])
    const [price, setPrice] = useState(0)
    const [inStock, setInStock] = useState(true)
    const navigate = useNavigate() 
    const [msg, setMsg] = useState<string | null>(null)

    const handleAddProduct = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const newProduct = {title, description, image, categories, price, inStock}
            const res = await axios.post(`/api/products`, newProduct)
            setMsg(res.data.msg)
        } catch (error) {
            console.log(error)
        }
        setTitle('')
        setDescription('')
        setImage('')
        setCategories([])
        setCategory('')
        setPrice(0)
        setInStock(true)
        setTimeout(() => navigate(-1), 1500)
    }
    


return (
<div className="add-edit-product">
    <Sidebar/>
    <div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
    <div className="add-product-container">
        {msg && <div className='add-product-msg'>{msg}</div>}
        <div className="form-group add-edit-product-form-group">
            <label className="form-group add-edit-product-label">Title</label>
            <input 
            type="text" 
            className="form-control add-edit-product-input" 
            placeholder="Enter Product Title.." 
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            />
        </div>
        <div className="form-group add-edit-product-form-group">
            <label className="form-group add-edit-product-label">Description</label>
            <textarea 
            className="form-control add-edit-product-input" 
            placeholder="Enter Product Description.." 
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            />
        </div>
        <div className="form-group add-edit-product-form-group">
            <label className="form-group add-edit-product-label">Categories</label>
            <div className="add-edit-product-category">
                <input
                type="text"
                className="form-control add-edit-product-category-input"
                placeholder="New Category.." 
                value={category || ''}
                onChange={e => setCategory(e.target.value)}
                />
                <AddIcon
                color="action"
                className='add-edit-product-category-icon'
                onClick={() => {
                    category && setCategories(prev => [...prev, category]);
                    setCategory(null)
                    }
                }
                />
            </div>
            <div className='add-edit-category-display'>
            {categories.map((categ, index) => 
                <div className='category-display' key={index}>
                    <span className="category-text-display">{categ}</span>
                    <CloseIcon 
                    className='delete-product-category-icon'
                    onClick={() => setCategories(prev => prev.filter(cat => cat !== categ))}
                    />
                </div>
            )}
            </div>
        </div>
        <div className="form-group add-edit-product-form-group-price">
            <label className="form-group add-edit-product-label">Price</label>
            <input 
            type="number" 
            className="form-control add-edit-product-input-price" 
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
            required
            />
        </div>
        <div className="form-group add-edit-product-form-group">
            <label className="form-group add-edit-product-label">Image</label>
            <input 
            type="text" 
            className="form-control add-edit-product-input" 
            placeholder="Enter Product Image.." 
            value={image}
            onChange={e => setImage(e.target.value)}
            required
            />
        </div>
        <div className="form-group add-edit-product-form-group">
            <label className="form-group add-edit-product-label">In Stock ?</label>
            <input 
            type="checkbox" 
            checked={inStock}
            onChange={() => setInStock(!inStock)}
            />
        </div>
        
        <button 
        type="submit" 
        className="btn btn-primary"
        onClick={e => handleAddProduct(e)}
        >Submit</button>
    </div>
</div>
)}

export default AddProduct