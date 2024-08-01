// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, message } from 'antd';
import axios from 'axios';
import './Login.css';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const handleLogin = async () => {
        try{
            const response = await axios.post('http://localhost:8081/user/login', {
                email: email,
                password: password
            })
            debugger;

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);
                localStorage.setItem('firstName',response.data.firstName);

                if(response.data.role === 'ADMIN'){
                    message.success('Login successful! WELCOME AS ADMIN');


                    navigate('/adminWebPage');
                }else{
                    message.success('Login successful!');
                    navigate('/deskReservation');
                }
            }else{
                message.error('Invalid email or password');
            }

        }catch (error){
            console.error('Invalid email or password');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '350px', margin: 'auto' ,marginTop: '50px'}}>
            <h2 style={{marginBottom: '30px'}}>Login</h2>
            <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: '10px' }}
            />
            <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginBottom: '10px' }}
            />

            <div className = "login-container">
                <Button type="primary" onClick={handleLogin}>Login</Button>
            </div>

        </div>
    );
}

export default Login;
