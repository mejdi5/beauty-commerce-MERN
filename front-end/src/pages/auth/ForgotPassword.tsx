import { FormEvent, useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";
import { useNavigate } from 'react-router-dom';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';


const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [msg, setMsg] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate()

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const res  = await axios.post(`http://localhost:5000/api/auth/password-reset`, { email });
			setMsg(res.data.message);
			setError("");
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
				setMsg("");
			}
		}
	};

return (
<div>
	<div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
		<div className="forgotPassword-container">
			<form className="forgotPassword-form_container" onSubmit={handleSubmit}>
				<h1>Your Email</h1>
				<input
					type="email"
					placeholder="Type Email.."
					name="email"
					onChange={(e) => setEmail(e.target.value)}
					value={email}
					required
					className="forgotPassword-input"
				/>
				{error && <div className="forgotPassword-error_msg">{error}</div>}
				{msg && <div className="forgotPassword-success_msg">{msg}</div>}
				<button type="submit" className="forgotPassword-btn">
					Submit
				</button>
			</form>
		</div>
</div>
)};

export default ForgotPassword;