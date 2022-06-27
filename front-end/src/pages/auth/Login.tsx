import React, {FormEvent, useState} from 'react'
import './Auth.css'
import { useTypedDispatch } from '../../Redux/Hooks'
import { authStart, loginSuccess, registerSuccess, authFailure } from '../../Redux/userSlice'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import {Link} from 'react-router-dom'
import { GoogleLogin } from 'react-google-login';
import { UserType} from '../../Redux/userSlice'



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

    const googleLoginSuccess = async (result: any) => {
        dispatch(authStart())
        try {
        const form: UserType = {
            firstName: result?.profileObj.givenName ,
            lastName: result?.profileObj.familyName,
            email: result?.profileObj.email,
            password: result?.profileObj.googleId,
        };
        const response = await axios.get(`/api/users`)
        const User = response.data?.find((u: any) => u?.email === form?.email)
        if (!User) {
            const res = await axios.post(`/api/auth/register`, form)
            dispatch(registerSuccess(res.data));
        } else {
            const res = await axios.post(`/api/auth/login`, {email: User?.email, password: User?.password})
            dispatch(loginSuccess(res.data));
        }
        navigate('/')
        } catch (error) {
            console.log(error);
            dispatch(authFailure())
        }
    };


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
            {
            process.env.REACT_APP_DEV_CLIENT_ID && process.env.REACT_APP_PROD_CLIENT_ID &&
            <GoogleLogin
            clientId={
                process.env.NODE_ENV === 'development' 
                ? process.env.REACT_APP_DEV_CLIENT_ID
                : process.env.REACT_APP_PROD_CLIENT_ID
            }
            buttonText="Login with Google"
            onSuccess={googleLoginSuccess}
            onFailure={() => console.log('Google Sign In Unsuccessful. Try Again Later')}
            cookiePolicy={'single_host_origin'}
            />
            }
        </div>
    </div>
    
</div>
</div>
)}

export default Login