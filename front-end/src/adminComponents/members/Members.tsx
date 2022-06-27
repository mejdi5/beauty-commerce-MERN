import "./Members.css";
import VisibilityIcon from '@mui/icons-material/Visibility';
import React, { useEffect, useState } from "react";
import axios from 'axios'
import { UserType } from "../../Redux/userSlice";


const Members : React.FC = () => {

    const [users, setUsers] = useState<UserType[]>([]);

    useEffect(() => {
    const getUsers = async () => {
        try {
        const res = await axios.get("/api/users"); 
        console.log('users', users)
        setUsers(res.data);
        } catch (error) {
            console.log(error.message)
        }
    };
    getUsers();
    }, []);

return (
<div className="members">
    <span className="membersTitle">Members</span>
    <ul className="membersList">
        {users.filter(user => !user.isAdmin).map((user, index) => (
        <li className="membersListItem" key={index}>
            {user?.image 
            ? <img
            src={user.image}
            alt=""
            className="membersImg"
            />
            : <img
            src={"https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"}
            alt=""
            className="membersImg"
            />
            }
            <div className="membersUser">
                <span className="membersUsername">{user.firstName} {user.lastName}</span>
            </div>
            <button className="membersButton">
            <VisibilityIcon className="membersIcon" />
            Display
            </button>
        </li>
        ))}
    </ul>
</div>
)}

export default Members