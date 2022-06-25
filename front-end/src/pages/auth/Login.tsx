import React, {FormEvent, useState} from 'react'
import './Auth.css'
import { useTypedDispatch } from '../../Redux/Hooks'
import { authStart, loginSuccess, authFailure } from '../../Redux/userSlice'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import {Link} from 'react-router-dom'
import { GoogleLogin } from 'react-google-login';



const Login : React.FC = () => {

    const dispatch = useTypedDispatch()
    const navigate = useNavigate()

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        dispatch(authStart())
        try {
            const res = await axios.post(`/api/auth/login`, {email, password})
            dispatch(loginSuccess(res.data))
            console.log(res.data)
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
<div>
<div className='back' style={{position: 'absolute'}} onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
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
            <Link to="/forgot-password"><p className='login-link'>Forgot Password ?</p></Link>
        </div>
        <div className='or'>OR</div>
        <div className='google-login'>
            <GoogleLogin
            clientId="496829602002-2k01fdl4q3l8ljnjgeroqvkq4e6iv2go.apps.googleusercontent.com"
            buttonText="Sign In With Google"
            //onSuccess={googleSuccess}
            onFailure={() => console.log('Google Sign In Unsuccessful. Try Again Later')}
            cookiePolicy={'single_host_origin'}
            />
        </div>
    </div>
    
</div>
</div>
)}

export default Login