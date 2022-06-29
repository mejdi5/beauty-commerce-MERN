import React,{FormEvent, useState} from 'react'
import "./Users.css"
import Sidebar from '../../../adminComponents/sidebar/Sidebar'
import {  useTypedDispatch, useTypedSelector } from '../../../Redux/Hooks'
import { useParams } from 'react-router-dom';
import { UserType } from '../../../Redux/userSlice';
import axios from 'axios'


const EditUser: React.FC = () => {

    const users = useTypedSelector<UserType[] | never[]>(state => state.userSlice.users)
    const userId = useParams().userId
    const editedUser = users && users.find((user: UserType) => user?._id === userId)

    const [firstName, setFirstName] = useState(editedUser?.firstName || '')
    const [lastName, setLastName] = useState(editedUser?.lastName || '')
    const [email, setEmail] = useState(editedUser?.email || '')
    const [image, setImage] = useState(editedUser?.image || 'https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif')

    const handleEditUser = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.put(`/api/users/${userId}`, editedUser)
            console.log(res.data)
        } catch (error) {
            const errors = error?.response?.data?.errors;
            const msg = error?.response?.data?.msg;
            if (Array.isArray(errors)) {
                errors.forEach((err) => alert(err.msg));
            }
            console.log('errors',errors);
            if (msg) {
                alert(msg);
            }
        }
    }

return (
<div className="add-edit-user">
    <Sidebar/>
    <div className="add-edit-user-container edit">
        <div className="form-group add-edit-user-form-group">
            <label className="form-group add-edit-user-label">First Name</label>
            <input 
            type="text" 
            className="form-control add-edit-user-input"  
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            />
        </div>
        <div className="form-group add-edit-user-form-group">
            <label className="form-group add-edit-user-label">Last Name</label>
            <input 
            type="text" 
            className="form-control add-edit-user-input" 
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            />
        </div>
        <div className="form-group add-edit-user-form-group">
            <label className="form-group add-edit-user-label">Email Address</label>
            <input 
            type="email" 
            className="form-control add-edit-user-input" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            />
        </div>
        <div className="form-group add-edit-user-form-group">
            <label className="form-group add-edit-user-label">Image</label>
            <input 
            type="text" 
            className="form-control add-edit-user-input" 
            value={image}
            onChange={e => setImage(e.target.value)}
            />
        </div>
        <button 
        type="submit" 
        className="btn btn-primary"
        onClick={e => handleEditUser(e)}
        >Update</button>
    </div>
</div>
)}

export default EditUser