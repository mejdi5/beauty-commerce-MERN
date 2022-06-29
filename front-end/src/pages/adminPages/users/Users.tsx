import React, {useEffect, useState} from 'react'
import "./Users.css"
import Sidebar from '../../../adminComponents/sidebar/Sidebar'
import { DataGrid } from '@mui/x-data-grid';
import { getAllUsers, UserType } from '../../../Redux/userSlice';
import { getOrders } from '../../../Redux/orderSlice'
import { OrderType } from '../../../Redux/orderSlice';
import axios from 'axios'
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import {  useTypedDispatch, useTypedSelector } from '../../../Redux/Hooks'


const Users: React.FC = () => {

  const users = useTypedSelector<UserType[] | never[]>(state => state.userSlice.users)
  const orders = useTypedSelector<OrderType[] | never[]>(state => state.orderSlice.orders)
  const dispatch = useTypedDispatch()


  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/users/${id}`)
      alert(`${res.data.msg}`)
    } catch (error) {
      console.log(error.message)
    }
  };

  const columns = [
    { field: "id", 
      headerName: "CUSTOMER ID", 
      width: 220 },
    {
      field: "name",
      headerName: "CUSTOMER NAME",
      width: 220,
      renderCell: (params: any) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row.image} alt="" />
            {params.row.name}
          </div>
        );
      },
    },
    { field: "email", 
      headerName: "EMAIL",
      width: 220 
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 120,
    },
    {
      field: "transaction",
      headerName: "TRANSACTION",
      width: 160,
    },
    {
      field: "action",
      headerName: "ACTION",
      width: 150,
      renderCell: (params: any) => {
        return (
          <div className='user-action'>
            <Link to="/newUser">
                <AddIcon className="user-new"/>
            </Link>
            <Link to={`/user/${params.row.id}`}>
              <EditIcon className="user-edit"/>
            </Link>
            <DeleteIcon
              className="user-delete"
              onClick={() => handleDelete(params.row.id)}
            />
          </div>
        );
      },
    },
  ];


  useEffect(() => {
    const getUsers = async () => {
        try {
        const res = await axios.get("/api/users"); 
        dispatch(getAllUsers(res.data));
        } catch (error) {
            console.log(error.message)
        }
    };
    const getUsersOrders = async () => {
      try {
          const res = await axios.get("/api/orders");
          dispatch(getOrders(res.data));
      } catch (error) {
          console.log(error.message)
      }
      };
    getUsersOrders();
    getUsers();
    }, [users, orders]);


    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1));
    const userRows = users.filter((user: UserType) => !user.isAdmin).map((user: UserType) => {
      return {
      id: user._id,
      name: user.firstName + ' ' + user.lastName,
      email: user.email,
      image: user.image || "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif",
      status: orders.some((order: OrderType) => order.userId === user._id && new Date(order.createdAt) > lastMonth) ? "Active" : 'Inactive',
      transaction: orders.some((order: OrderType) => order.userId === user._id)
      ? `${orders.filter((order: OrderType) => order.userId === user._id).map(order => order.amount)?.reduce((a,b) => a + b)}$`
      : ''
}})

return (
<div className="users">
    <Sidebar/>
    <div className="users-container">
      {userRows.length > 0
        ?
        <DataGrid
        rows={userRows}
        columns={columns}
        />
        :
        "No Users"
        }
    </div>
</div>
)}

export default Users