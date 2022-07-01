import React, {useEffect, useState} from 'react'
import "./AllOrders.css"
import Sidebar from '../../adminComponents/sidebar/Sidebar'
import { DataGrid } from '@mui/x-data-grid';
import { getAllUsers, UserType } from '../../Redux/userSlice';
import { getOrders } from '../../Redux/orderSlice'
import { OrderType } from '../../Redux/orderSlice';
import axios from 'axios'
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {  useTypedDispatch, useTypedSelector } from '../../Redux/Hooks'


const AllOrders: React.FC = () => {

    const users = useTypedSelector<UserType[] | never[]>(state => state.userSlice.users)
    const orders = useTypedSelector<OrderType[] | never[]>(state => state.orderSlice.orders)
    const dispatch = useTypedDispatch()
    const [msg, setMsg] = useState<string | null>(null)


    const columns = [
        { field: "id", 
            headerName: "ORDER ID", 
            width: 220 },
        {
            field: "name",
            headerName: "CUSTOMER",
            width: 220,
            renderCell: (params: any) => {
            return (
                <div className="orderUser">
                    <img className="orderUserImg" src={params.row.image} alt="" />
                    {params.row.name}
                </div>
            );
            },
        },
        {
        field: "address",
        headerName: "ADDRESS",
        width: 400,
        },
        {
        field: "amount",
        headerName: "AMOUNT",
        width: 120,
        },
        {
        field: "status",
        headerName: "STATUS",
        width: 120,
        },
        {
        field: "action",
        headerName: "ACTION",
        width: 150,
        renderCell: (params: any) => {
            return (
                <div className='order-action'>
                    <Link to={`/edit-order/${params.row.id}`}>
                        <EditIcon className="order-edit"/>
                    </Link>
                    <Link to={`/order/${params.row.id}`}>
                        <VisibilityIcon
                        className="order-visibility"
                        />
                    </Link>
                    <DeleteIcon
                    className="order-delete"
                    onClick={() => handleDelete(params.row.id)}
                    />
                </div>
            );
        },
        },
    ];
    
    
    const orderRows = orders.map((order: OrderType) => {
        const userOrder = users.find((user: UserType) => user._id === order.userId)
        return {
        id: order._id,
        name: userOrder &&  userOrder.firstName + ' ' + userOrder.lastName,
        image: userOrder ? userOrder.image : "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif",
        amount: `${order.amount}$`,
        address: order.address,
        status: order.status
    }})

    const handleDelete = async (id: string) => {
        try {
            const res = await axios.delete(`/api/orders/${id}`)
            setMsg(res.data.msg)
        } catch (error) {
            console.log(error.message)
        }
    };


    useEffect(() => {
        const getUsersOrders = async () => {
            try {
                const res = await axios.get("/api/orders");
                dispatch(getOrders(res.data));
            } catch (error) {
                console.log(error.message)
            }
        };
        getUsersOrders();
    }, [orders]);
    
return (
<div className="allOrders">
    <Sidebar/>
    <div className="allOrders-container">
    {msg && <div className='order-delete-msg'>{msg}</div>}
    {orderRows.length > 0
        ?
        <DataGrid
        rows={orderRows}
        columns={columns}
        />
        :
        <div className='no-orders'>No Orders</div>
    }
    </div>
</div>
)}

export default AllOrders    

