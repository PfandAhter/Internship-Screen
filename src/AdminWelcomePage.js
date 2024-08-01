import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {message} from 'antd';
import axios from 'axios';
import './AdminWelcomePage.css';

const AdminWelcomePage = () => {

    const navigate = useNavigate();
    const firstName = localStorage.getItem('firstName');


    const handleDeskReservation = () => {
        navigate('/deskReservation');
    };

    const handleDeskCreate = () => {
        navigate('/deskCreate');
    };

    const handleShowReservations = () => {
        navigate('/showReservations');
    };

    const handleDeskList = () => {
        navigate('/deskList');

    }

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
            <h1 style={{ marginTop: '30px' }}>Welcome, {firstName}</h1>
            <div className="button-container">
                <button className="button" onClick={handleDeskReservation}>Desk Reservation</button>
                <button className="button" onClick={handleDeskCreate}>Desk Create</button>
                <button className="button" onClick={handleDeskList}>Desk List</button>
                <button className="button" onClick={handleShowReservations}>Show Reservations</button>
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default AdminWelcomePage;