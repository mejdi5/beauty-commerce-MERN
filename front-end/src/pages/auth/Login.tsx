import React, {FormEvent, useState} from 'react'
import './Auth.css'
import { useTypedDispatch } from '../../Redux/Hooks'
import { authStart, loginSuccess, authFailure } from '../../Redux/userSlice'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import {Link} from 'react-router-dom'


const Login : React.FC = () => {

    const dispatch = useTypedDispatch()
    const navigate = useNavigate()

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        dispatch(authStart())
        try {
            const res = await axios.post(`http://localhost:5000/api/auth/login`, {email, password})
            dispatch(loginSuccess(res.data))
            navigate(`/`);
        } catch (error: any) {
            const errors = error?.response?.data?.errors;
            const msg = error?.response?.data?.msg;
            if (Array.isArray(errors)) {
                errors.forEach((err) => alert(err.msg));
            }
            if (msg) {
                alert(msg);
            }
            dispatch(authFailure())
        }
        setEmail('')
        setPassword('')
    }


return (
<div className='login-container'>
    <h1>Sign In</h1>
    <div className='login-wrapper'>
        <div className="mb-3">
            <label className="form-label">Email address <span className='required'>*</span></label>
            <input 
            type="email" 
            className="form-control" 
            placeholder="name@example.com"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            />
        </div>
        <div className="mb-3">
            <label className="form-label">Password <span className='required'>*</span></label>
            <input 
            type="password" 
            className="form-control" 
            placeholder="Password.."
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            />
        </div>
        <button className='login-btn' onClick={e => handleLogin(e)}>Login</button>
        <div className='login-links'>
            <Link to="/register"><p className='login-link'>New Account</p></Link>
            <Link to=""><p className='login-link'>Forgot Password ?</p></Link>
        </div>
    </div>
</div>
)}

export default Login