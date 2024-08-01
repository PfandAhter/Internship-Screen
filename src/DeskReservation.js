import React, {useEffect, useState} from 'react';
import {Table, Modal, Input, DatePicker, Button, message} from 'antd';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import 'antd/dist/reset.css';
import './DeskReservation.css';


//class component functional component arasindaki fark class componentten function componente gecis neden yapildi ?
//jsx ve html arasindaki farklar nelerdir ?
//reactin avantajlari nelerdir ?
//reactin dezavantajlari nelerdir ?
//reactin lifecycle methodlari nelerdir ?


const {RangePicker} = DatePicker;

function DeskReservation() {
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [dates, setDates] = useState([]);
    const [selectedDeskId, setSelectedDeskId] = useState(null);

    const [reservationDates, setReservationDates] = useState([]);

    const columns = [
        {
            title: 'DeskNo',
            dataIndex: 'deskNo',
            key: 'deskNo',
            sorter: (a, b) => a.deskNo - b.deskNo,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            sorter: (a, b) => a.description.localeCompare(b.description),
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            render: (text, record) => (
                <button className="custom-reserve-button"
                        onClick={() => showModal(record.deskId)}>Reserve</button>
            ),
        },
    ];

    const showModal = (deskId) => {
        setSelectedDeskId(deskId);
        setIsModalVisible(true);
    }

    const handleOk = async () => {
        try {
            const token = localStorage.getItem('token');

            const res = await axios.post('http://localhost:8083/deskReservation/create', {
                token: token,
                deskId: selectedDeskId,
                reservationStartDate: dates[0].format('YYYY-MM-DD'),
                reservationEndDate: dates[1].format('YYYY-MM-DD'),
            });
            setIsModalVisible(false);
            setDates([]);
            setSelectedDeskId(null);

            if (res.status === 200) {
                message.success('Desk reserved successfully');
            } else {
                message.error('Desk could not be reserved');
            }


        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleCancel = () => {
        setIsModalVisible(false);
        setDates([]);
        setSelectedDeskId(null);
    }

    useEffect(() => {
        isUserLoggedIn();
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

    const handleGetRequest = async () => {
        try {
            const res = await axios.get('http://localhost:8083/deskReservation/all', {
                params: {
                    startDate: reservationDates[0] ? reservationDates[0].format('YYYY-MM-DD') : undefined,
                    endDate: reservationDates[1] ? reservationDates[1].format('YYYY-MM-DD') : undefined,
                },
            });
            setDataSource([]);
            debugger;

            if (res.data) {
                res.data.deskList.sort((a, b) => a.deskNo - b.deskNo);

                const newRecords = res.data.deskList.map(item => ({
                    key: item.deskId,
                    deskId: item.deskId,
                    deskNo: item.deskNo,
                    description: item.description,
                }));

                setDataSource(newRecords);

            }

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="desk-reservation-page">
            <RangePicker
                value={reservationDates}
                onChange={(value) => setReservationDates(value)}
                /*style = {{marginBottom: '1px', marginRight :'25px'}}*/
                className="date-picker"
            />
            <button style={{marginRight: '15px', marginTop: '7px', }} onClick={handleGetRequest}>Get all not reserved
                desks
            </button>
            {/*<button className="get-button" onClick={handleGetRequest}>Get all not reserved desks</button>*/}

            <Table dataSource={dataSource} columns={columns} className="table-container"/>

            <Modal title="Reserve Desk" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                {/*<Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{marginBottom: '10px'}}
                />*/}
                <RangePicker
                    value={dates}
                    onChange={(value) => setDates(value)}
                    style={{width: '400px', height: '40px'}}
                />
            </Modal>
        </div>
    );
}

export default DeskReservation;