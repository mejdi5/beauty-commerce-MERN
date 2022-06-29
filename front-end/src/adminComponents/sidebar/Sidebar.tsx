import "./Sidebar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import { logoutUser } from '../../Redux/userSlice';
import {  useTypedDispatch } from '../../Redux/Hooks'


const Sidebar = () => {

    const dispatch = useTypedDispatch()

    const handleLogout = () => {
        dispatch(logoutUser())
    }

return (
<div className="sidebar">
    <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
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
        <li>
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profile</span>
        </li>
        <li onClick={handleLogout}>
            <ExitToAppIcon className="icon" />
            <span>Logout</span>
        </li>
    </ul>
    </div>
    <div className="bottom">
        <div
            className="colorOption"
          //onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
            className="colorOption"
          //onClick={() => dispatch({ type: "DARK" })}
        ></div>
    </div>
</div>
)};

export default Sidebar;