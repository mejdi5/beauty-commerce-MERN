import React from 'react'
import './Newsletter.css'
import SendIcon from '@mui/icons-material/Send';

const Newsletter : React.FC = () => {
return (
<div className='newsletter-container'>
    <h1 className='newsletter-title'>Newsletter</h1>
    <div className='newsletter-form'>
        <input className='newsletter-input' placeholder="Enter your email.." />
        <button className='newsletter-button'><SendIcon/></button>
    </div>
</div>
)}

export default  Newsletter