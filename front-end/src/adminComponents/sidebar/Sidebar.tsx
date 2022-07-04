import "./Sidebar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import { logoutUser, UserType } from '../../Redux/userSlice';
import {  useTypedDispatch, useTypedSelector } from '../../Redux/Hooks'
import { getImage, ImageType } from '../../Redux/imageSlice';


const Sidebar = () => {

    const user = useTypedSelector<UserType | null>(state => state.userSlice.user)
    const image = useTypedSelector<ImageType | null>(state => state.imageSlice.image)
    const dispatch = useTypedDispatch()

    const handleLogout = () => {
        dispatch(logoutUser())
    }

return (
<div className="sidebar">
    <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
            <img src={image?.path} className="navbar-user-image"/>
            <span className="logo">Beauty Commerce</span>
        </Link>
    </div>
    <hr />
    <div className="center">
    <ul className="sidebar-links">
        <p className="title">MAIN</p>
        <Link to="/" style={{ textDecoration: "none" }}>
        <li>
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
        </li>
        </Link>
        <p className="title">LISTS</p>
        <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
                <PersonOutlineIcon className="icon" />
                <span>Users</span>
            </li>
        </Link>
        <Link to="/allProducts" style={{ textDecoration: "none" }}>
            <li>
                <StoreIcon className="icon" />
                <span>Products</span>
            </li>
        </Link>
        <Link to="/allOrders" style={{ textDecoration: "none" }}>
        <li>
            <CreditCardIcon className="icon" />
            <span>Orders</span>
        </li>
        </Link>
        
        <p className="title">USER</p>
        <Link to={`/user-profile/${user?._id}`} style={{ textDecoration: "none" }}>
            <li>
                <AccountCircleOutlinedIcon className="icon" />
                <span>Profile</span>
            </li>
        </Link>
        <li onClick={handleLogout}>
            <ExitToAppIcon className="icon" />
            <span>Logout</span>
        </li>
    </ul>
    </div>
</div>
)};

export default Sidebar;