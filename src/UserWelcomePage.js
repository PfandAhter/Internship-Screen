import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './UserWelcomePage.css';
import axios from "axios";
import {message} from "antd";

const UserWelcomePage = () => {
    const navigate = useNavigate();

    const handleDeskReservation = () => {
        navigate('/deskReservation');
    };

    const handleShowReservations = () => {
        navigate('/showReservations');
    };

    useEffect(() => {
        isUserLoggedIn();
    }, []);


    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        localStorage.clear();
        try{
            const response = await axios.post('http://localhost:8081/user/logout', {
                token:token
            })

            if(response.status === 200){
                console.log('Logout successful');
                message.info('Logout successful');
            }else{
                console.log('Logout failed');
                message.error('Logout failed');
            }
        }catch (error){
            console.error('Invalid email or password');
        }
        navigate('/');
    };

    const isUserLoggedIn = async () => {
        const token = localStorage.getItem('token');
        try{
            if (!token) {
                navigate('/');
            }
            const response = await axios.post('http://localhost:8079/token-service/token/isExpired', {
                token:token
            })
            if (response.status !== 200){
                console.error('Token is expired');
                message.error('Token is expired');
                localStorage.clear();
                navigate('/');
            }
        }catch (error){
            console.error('Error:', error);
        }
    }

    return (
        <div className="admin-welcome-page">
            <h1 style={{ marginTop: '30px' }}>Welcome, Admin!</h1>
            <div className="button-container">
                <button className="button" onClick={handleDeskReservation}>Desk Reservation</button>
                <button className="button" onClick={handleShowReservations}>Show Reservations</button>
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default UserWelcomePage;