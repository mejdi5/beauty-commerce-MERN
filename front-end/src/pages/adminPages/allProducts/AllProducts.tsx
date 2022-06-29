import React, {useEffect} from 'react'
import "./AllProducts.css"
import Sidebar from '../../../adminComponents/sidebar/Sidebar'
import { DataGrid } from '@mui/x-data-grid';
import { UserType } from '../../../Redux/userSlice';
import axios from 'axios'
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {  useTypedDispatch, useTypedSelector } from '../../../Redux/Hooks'
import { ProductType, getProducts } from '../../../Redux/productSlice';


const AllProducts: React.FC = () => {

    const users = useTypedSelector<UserType[] | never[]>(state => state.userSlice.users)
    const products = useTypedSelector<ProductType[] | never[]>(state => state.productSlice.products)
    const dispatch = useTypedDispatch()

    const handleDelete = async (id: string) => {
        try {
            const res = await axios.delete(`/api/products/${id}`)
        } catch (error) {
            console.log(error.message)
        }
    };

    const columns = [
        { field: "id", 
            headerName: "PRODUCT ID", 
            width: 220 },
        {
            field: "title",
            headerName: "PRODUCT NAME",
            width: 600,
            renderCell: (params: any) => {
            return (
                <div>
                    <img className="admin-productImg" src={params.row.image} alt="" />
                    {params.row.title}
                </div>
            );
            },
        },
        {
        field: "categories",
        headerName: "PRODUCT CATEGORIES",
        width: 180,
        },
        {
        field: "price",
        headerName: "PRICE",
        width: 70,
        },
        {
        field: "inStock",
        headerName: "IN STOCK",
        width: 80,
        },
        {
        field: "action",
        headerName: "ACTION",
        width: 100,
        renderCell: (params: any) => {
            return (
                <div className='product-action'>
                    <Link to={"/product/" + params.row.id}>
                        <EditIcon className="product-edit"/>
                    </Link>
                    <DeleteIcon
                    className="product-delete"
                    onClick={() => handleDelete(params.row.id)}
                    />
                </div>
            );
        },
        },
    ];
    
    
    const productRows = products.map((product: ProductType) => {
        return {
        id: product._id,
        title: product.title,
        image: product.image,
        categories: product.categories?.join(' / ').toUpperCase(),
        price: `${product.price}$`,
        inStock: product.inStock,
    }})


    useEffect(() => {
        const getAllProducts = async () => {
            try {
                const res = await axios.get("/api/products");
                dispatch(getProducts(res.data));
            } catch (error) {
                console.log(error.message)
            }
        };
        getAllProducts();
    }, [products]);
    
return (
<div className="allProducts">
    <Sidebar/>
    <div className="allProducts-container">
    {productRows.length > 0
        ?
        <DataGrid
        rows={productRows}
        columns={columns}
        />
        :
        "No Products"
    }
    </div>
</div>
)}

export default AllProducts 
