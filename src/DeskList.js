import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Table, Modal, Input, DatePicker, Button, message} from 'antd';
import axios from 'axios';
import './DeskList.css';


const DeskList = () => {
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedDeskId, setSelectedDeskId] = useState('');
    const userRole = localStorage.getItem('role');
    const [deskNo, setDeskNo] = useState('');

    const [status, setStatus] = useState(0);

    const [description, setDescription] = useState('');

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
        },

        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Desk Create Date',
            dataIndex: 'deskCreateDate',
            key: 'deskCreateDate',
        },
        {
            title: 'Desk Update Date',
            dataIndex: 'deskUpdateDate',
            key: 'deskUpdateDate',
        },

        {
            title: 'Desk Activate',
            key: 'activate',
            dataIndex: 'activate',
            render: (text, record) => (
                <button className="custom-reserve-button"
                        onClick={() => setActivateStatus(record.deskId)}>Activate</button>

            ),
        },
        {
            title: 'Desk Deactivate',
            key: 'deActivate',
            dataIndex: 'deActivate',
            render: (text, record) => (
                <button className="custom-reserve-button"
                        onClick={() => setDeaActivateStatus(record.deskId)}>De Activate</button>

            ),
        },

        {
            title: 'Desk Action',
            key: 'deskAction',
            dataIndex: 'deskAction',
            render: (text, record) => (
                <button className="custom-reserve-button"
                        onClick={() => showModal(record.deskId)}>Update</button>
            ),
        },

    ];

    const setActivateStatus = (deskId) => {
        if (userRole === 'ADMIN') {
            setSelectedDeskId(deskId);
            handleActivate();
        } else {
            message.error('Only admin can activate desk');
        }
    }

    const setDeaActivateStatus = (deskId) => {
        if (userRole === 'ADMIN') {
            debugger;
            setSelectedDeskId(deskId);
            debugger;
            handleDeActivate();
        } else {
            message.error('Only admin can deActivate desk');
        }
    }

    useEffect(() => {
        isUserLoggedIn();
        fetchData();
    }, []);


    const showModal = (deskId) => {
        setSelectedDeskId(deskId);
        setIsModalVisible(true);
    }

    const handleCancel = () => {
        setIsModalVisible(false);
        setDeskNo('');
        setDescription('');
        setSelectedDeskId(null);
    }

    const isUserLoggedIn = async () => {
        const token = localStorage.getItem('token');
        try {
            if (!token) {
                navigate('/');
            }
            const response = await axios.post('http://localhost:8079/token-service/token/isExpired', {
                token: token
            })
            if (response.status !== 200) {
                console.error('Token is expired');
                message.error('Token is expired');
                localStorage.clear();
                navigate('/');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }


    const handleActivate = async () => {
        try {
            debugger;
            const response = await axios.get('http://localhost:8083/desk/activate', {
                params: {
                    deskId: selectedDeskId
                }
            })
            if (response.status === 200) {
                message.info('Desk activated successfully');

                fetchData();
            } else {
                message.error('Desk could not be activated');
            }
        } catch (error) {
            console.error('Invalid email or password');
        }
    };

    const handleDeActivate = async () => {
        try {
            const response = await axios.get('http://localhost:8083/desk/deActivate', {
                params: {
                    deskId: selectedDeskId
                }
            })
            debugger;

            if (response.status === 200) {
                message.info('Desk deActivated successfully');

                fetchData();
            } else {
                message.error('Desk could not be deActivated');
            }
        } catch (error) {
            console.error('Invalid email or password');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {

            const token = localStorage.getItem('token');

            const response = await axios.get('http://localhost:8083/desk/list');

            setDataSource([]);

            debugger;

            if (response.data) {
                response.data.deskDTOList.sort((a, b) => a.deskNo - b.deskNo);

                const newRecords = response.data.deskDTOList.map(item => ({
                    key: item.deskId,
                    deskId: item.deskId,
                    deskNo: item.deskNo,
                    description: item.description,
                    status : item.active,
                    deskCreateDate: item.createDate,
                    deskUpdateDate: item.updateDate,
                }));
                setDataSource(newRecords);
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };


    const handleOk = async () => {
        try {
            const res = await axios.post('http://localhost:8083/desk/update', {
                deskId: selectedDeskId,
                deskNo: deskNo,
                description: description,
            });

            setIsModalVisible(false);
            setDeskNo('');
            setDescription('');
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


    return (
        <div className="out-of-date-reservation-page">
            <h1 style={{marginTop: '30px'}}>Out of date & Not active Reservations </h1>

            <div style={{marginTop: '30px'}} className={"table-container"}>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    loading={loading}
                    // className={'custom-table'}
                    pagination={{pageSize: 10}}
                    style={{width: '100%'}}
                />
            </div>


            <Modal title="Update Desk" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Input
                    placeholder="Desk no"
                    value={deskNo}
                    onChange={(e) => setDeskNo(e.target.value)}
                />
                <Input
                    placeholder="Desk Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                    placeholder="Desk Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{marginBottom: '10px'}}
                />

            </Modal>
        </div>
    );
};

export default DeskList;