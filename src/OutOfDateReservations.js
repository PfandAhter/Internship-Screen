import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Table, message} from 'antd';
import axios from 'axios';
import './OutOfDateReservation.css';


const OutOfDateReservations = () => {
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: 'DeskNo',
            dataIndex: 'deskNo',
            key: 'deskNo',
            sorter: (a, b) => a.deskNo - b.deskNo,
        },
        {
            title: 'Reservation Create Date',
            dataIndex: 'reservationCreateDate',
            key: 'reservationCreateDate',
            sorter: (a, b) => a.description.localeCompare(b.description),
        },
        {
            title: 'Reservation Update Date',
            dataIndex: 'reservationUpdateDate',
            key: 'reservationUpdateDate',
            sorter: (a, b) => a.description.localeCompare(b.description),
        },
        {
            title: 'Reservation Start Date',
            dataIndex: 'reservationStartDate',
            key: 'reservationStartDate',
            sorter: (a, b) => new Date(a.reservationStartDate) - new Date(b.reservationStartDate),
        },
        {
            title: 'Reservation End Date',
            dataIndex: 'reservationEndDate',
            key: 'reservationEndDate',
            sorter: (a, b) => new Date(a.reservationEndDate) - new Date(b.reservationEndDate),
        },
    ];

    useEffect(() => {
        isUserLoggedIn();
        fetchData();
    }, []);


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

    const fetchData = async () => {
        setLoading(true);
        try {

            const token = localStorage.getItem('token');
            debugger;

            const res = await axios.post('http://localhost:8083/deskReservation/oldReservations',{
                token:token
                /*headers: {
                    'Authorization': `Bearer ${token}` // Token'ı header'a ekle
                }*/
            });


            if (res.data) {
                res.data.deskReservationList.sort((a,b) => a.deskNo - b.deskNo);

                const newRecords = res.data.deskReservationList.map(item => ({
                    key: item.deskId,
                    deskNo: item.deskNo,
                    reservationCreateDate: item.createDate,
                    reservationUpdateDate: item.updateDate,
                    reservationStartDate: item.startDate,
                    reservationEndDate: item.endDate,
                }));
                setDataSource(newRecords);
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Failed to fetch data',error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="out-of-date-reservation-page">
            <h1 style={{marginTop: '30px'}}>Out of date & Not active Reservations </h1>

            <div style={{marginTop: '30px'}} className={"table-container"}>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    loading={loading}
                    // className={'custom-table'}
                    pagination={{pageSize: 5}}
                    style = {{width: '100%'}}
                />
            </div>
        </div>
    );
};

export default OutOfDateReservations;