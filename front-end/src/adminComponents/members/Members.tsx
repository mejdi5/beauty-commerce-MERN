import "./Members.css";
import VisibilityIcon from '@mui/icons-material/Visibility';
import React, { useEffect } from "react";
import axios from 'axios'
import { getAllUsers, UserType } from "../../Redux/userSlice";
import {  useTypedDispatch, useTypedSelector } from '../../Redux/Hooks'
import { Link } from "react-router-dom";
import { getAllImages, ImageType } from '../../Redux/imageSlice'


const Members : React.FC = () => {

    const images = useTypedSelector<ImageType[] | never[]>(state => state.imageSlice.images)
    const users = useTypedSelector<UserType[] | never[]>(state => state.userSlice.users)
    const dispatch = useTypedDispatch()

    useEffect(() => {
    const getUsers = async () => {
        try {
        const res = await axios.get("/api/users?new=true"); 
        dispatch(getAllUsers(res.data));
        } catch (error) {
            console.log(error.message)
        }
    };
    const getImages = async () => {
        try {
        const res = await axios.get("/api/images"); 
        dispatch(getAllImages(res.data));
        } catch (error) {
            console.log(error.message)
        }
    };
    getUsers();
    getImages();
    }, []);


return (
<div className="members">
    <span className="membersTitle">Members</span>
    <ul className="membersList">
        {users.filter((user: UserType) => !user.isAdmin).map((user, index) => {
        const userImage = images.find((img: ImageType) => img?.userId === user?._id)
        return (
        <li className="membersListItem" key={index}>
            <img
            src={userImage ? `/images/${userImage.path}` : "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"}
            alt=""
            className="membersImg"
            />
            <div className="membersUser">
                <span className="membersUsername">{user.firstName} {user.lastName}</span>
            </div>
            <Link to={`/user-profile/${user?._id}`} style={{ textDecoration: "none" }}>
            <button className="membersButton">
            <VisibilityIcon className="membersIcon" />
            See
            </button>
            </Link>
        </li>)
        })}
    </ul>
</div>
)}

export default Members