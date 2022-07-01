import React,{FormEvent, useState} from 'react'
import "./Users.css"
import Sidebar from '../../adminComponents/sidebar/Sidebar'
import {  useTypedDispatch, useTypedSelector } from '../../Redux/Hooks'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { getAllUsers, registerSuccess } from '../../Redux/userSlice'


const AddUser = () => {


    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    const [image, setImage] = useState('https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif')
    const navigate = useNavigate() 
    const [msg, setMsg] = useState<string | null>(null)
    const dispatch = useTypedDispatch()

    const handleAddUser = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const newUser = {firstName, lastName, email, password, isAdmin, image}
            const res = await axios.post(`/api/users`, newUser)
            setMsg(res.data.msg)
        } catch (error) {
            const errors = error?.response?.data?.errors;
            const errorMsg = error?.response?.data?.msg;
            if (Array.isArray(errors)) {
                errors.forEach((err) => alert(err.msg));
            }
            if (errorMsg) {
                alert(errorMsg);
            }
        }
        setEmail('')
        setFirstName('')
        setLastName('')
        setPassword('')
        setIsAdmin(false)
        setImage('https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif')
        setTimeout(() => navigate(-1), 2000)
    }


return (
<div className="add-edit-user">
    <Sidebar/>
    <div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
    <div className="add-user-container">
        {msg && <div className='add-user-msg'>{msg}</div>}
        <div className="form-group add-edit-user-form-group">
            <label className="form-group add-edit-user-label">First Name</label>
            <input 
            type="text" 
            className="form-control add-edit-user-input" 
            placeholder="Enter First Name.." 
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            />
        </div>
        <div className="form-group add-edit-user-form-group">
            <label className="form-group add-edit-user-label">Last Name</label>
            <input 
            type="text" 
            className="form-control add-edit-user-input" 
            placeholder="Enter Last Name.." 
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            />
        </div>
        <div className="form-group add-edit-user-form-group">
            <label className="form-group add-edit-user-label">Email Address</label>
            <input 
            type="email" 
            className="form-control add-edit-user-input" 
            placeholder="Enter Email.." 
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            />
        </div>
        <div className="form-group add-edit-user-form-group">
            <label className="form-group add-edit-user-label">Password</label>
            <input 
            type="password" 
            className="form-control add-edit-user-input"
            placeholder="Enter Password.."  
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            />
        </div>
        <div className="form-group add-edit-user-form-group">
            <label className="form-group add-edit-user-label">Image</label>
            <input 
            type="text" 
            className="form-control add-edit-user-input" 
            placeholder="Enter image" 
            value={image}
            onChange={e => setImage(e.target.value)}
            />
        </div>
        <div className="form-group add-edit-user-form-group">
            <label className="form-group add-edit-user-label">Admin ?</label>
            <input 
            type="checkbox" 
            checked={isAdmin}
            onChange={() => setIsAdmin(!isAdmin)}
            />
        </div>
        <button 
        type="submit" 
        className="btn btn-success"
        onClick={e => handleAddUser(e)}
        >Submit</button>
    </div>
</div>
)}

export default AddUser