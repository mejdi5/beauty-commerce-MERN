import React, {useEffect, useState} from 'react'
import "./Profile.css"
import Sidebar from '../../adminComponents/sidebar/Sidebar'
import { logoutUser, UserType } from '../../Redux/userSlice';
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTypedDispatch, useTypedSelector } from '../../Redux/Hooks'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Navbar from '../../components/navbar/Navbar'


const Profile: React.FC = () => {

    const currentUser = useTypedSelector<UserType | null>(state => state.userSlice.user)
    const users = useTypedSelector<UserType[] | never[]>(state => state.userSlice.users)
    const dispatch = useTypedDispatch()
    const [msg, setMsg] = useState<string | null>(null)
    const navigate = useNavigate()

    const userId = useParams().userId
    const user = users && users.find((user: UserType) => user?._id === userId)


    const handleDelete = async (id: string) => {
    try {
        const res = await axios.delete(`/api/users/${id}`)
        setMsg(res.data.msg)
        setTimeout(() =>  dispatch(logoutUser()), 2000)
    } catch (error) {
        console.log(error.message)
    }
};

useEffect(() => {
if( user?._id !== currentUser?._id && !currentUser?.isAdmin) {
    navigate('/')
} 
}, [user, currentUser])


return (
<div className='App'>
{currentUser && !currentUser?.isAdmin && <Navbar/>}
<div className="admin-profile">
    {currentUser && currentUser?.isAdmin && <Sidebar/>}
    {currentUser && !currentUser?.isAdmin && <div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>}
<div className="admin-profile-container">
    {msg && <div className='user-delete-msg'>{msg}</div>}
    <div className="admin-profile-wrapper">
        <img src={user?.image} className="admin-profile-image"/>
        <div className='admin-profile-info'>
            <div className='admin-profile-info-item'>
                <span>First Name:</span><h6>{user?.firstName}</h6>
            </div>
            <div className='admin-profile-info-item'>
                <span>Last Name:</span><h6>{user?.lastName}</h6>
            </div>
            <div className='admin-profile-info-item'>
                <span>Email:</span><h6>{user?.email}</h6>
            </div>
            {user && user?.isAdmin && 
            <div className='admin-profile-info-item'>
                <span>Status:</span><h6>{user?.isAdmin && "Admin"}</h6>
            </div>
            }
        </div>
        <div className='admin-profile-icons'>
            <Link to={user?.isAdmin ? `/user/${user?._id}` : `/edit-profile/${user?._id}`}><EditIcon color="success" className='admin-profile-icon'/></Link>
            <DeleteIcon color="error" className='admin-profile-icon' onClick={() => user?._id && handleDelete(user?._id)}/>
        </div>
    </div>
</div>
</div>
</div>
)}

export default Profile