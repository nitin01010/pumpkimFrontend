import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Header from '../header/header';
import LogoIcon from '../../public/cuate.png';
import { Modal, Button } from 'antd';
import upload from '../../public/upload.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addTodo, removeTodo } from '../slice'; // Adjust the import according to your slice structure

const Dashboard = () => {
    const [visible, setVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [file, setFile] = useState(null);
    const [fileUploadSuccessful, setFileUploadSuccessful] = useState(false);
    const [csvData, setCsvData] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUploadedData = async () => {
            try {
                const response = await axios.get('https://backendpumpkim.onrender.com/api/v1/locations/upload');
                setCsvData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUploadedData();
    }, []);

    const showModal = () => setVisible(true);

    const handleOk = async () => {
        setVisible(false);
        setInputValue('');
        setFile(null);

        const validData = csvData.map(item => ({
            latitude: item.latitude,
            longitude: item.longitude,
            timestamp: new Date(item.timestamp),
            ignition: item.ignition === "on",
            id: item.id // Ensure this exists
        })).filter(item =>
            item.latitude != null &&
            item.longitude != null &&
            item.timestamp != null &&
            item.ignition != null
        );

        if (validData.length === 0) {
            console.error('No valid data to upload.');
            return;
        }

        try {
            const response = await axios.post('https://backendpumpkim.onrender.com/api/v1/locations/upload', validData);
            console.log('Upload successful:', response.data);
            await fetchUploadedData();
        } catch (error) {
            console.error('Error uploading data:', error);
        }
    };

    const handleCancel = () => {
        setVisible(false);
        setInputValue('');
        setFile(null);
        setFileUploadSuccessful(false);
    };

    const handleInputChange = (e) => setInputValue(e.target.value);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            Papa.parse(selectedFile, {
                header: true,
                dynamicTyping: true,
                complete: (results) => {
                    setCsvData(results.data);
                    setFileUploadSuccessful(true);
                },
                error: (error) => {
                    console.error('Error parsing CSV:', error);
                },
            });
        }
    };

    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        const newSelectedItems = new Set();

        if (checked) {
            csvData.forEach(item => {
                newSelectedItems.add(item);
                dispatch(addTodo(item));
            });
        } else {
            csvData.forEach(item => {
                newSelectedItems.delete(item);
                dispatch(removeTodo(item.id));
            });
        }
        setSelectedItems(newSelectedItems);
    };

    const handleSelectItem = (item) => {
        const newSelectedItems = new Set(selectedItems);

        if (newSelectedItems.has(item)) {
            newSelectedItems.delete(item);
            dispatch(removeTodo(item.id));
        } else {
            newSelectedItems.add(item);
            dispatch(addTodo(item));
        }

        setSelectedItems(newSelectedItems);
    };

    const handleAnalytics = () => {
        if (selectedItems.size === 0) {
            alert("Please select at least one checkbox.");
        } else {
            navigate("/dashboard/analytics");
        }
    };

    return (
        <div>
            <Header />
            <div className='w-[90%] m-auto mt-6 p-2'>
                <span className='flex gap-3 border border-[#A9A9A9] px-4 font-semibold items-center rounded-[16px] h-[60px]'>
                    <p className='text-lg'> 👋🏻 Welcome, User</p>
                </span>
                <br />
                { loading ? (
                    <p>Loading...</p>
                ) : fileUploadSuccessful || csvData.length > 0 ? (
                    <div className='p-2 w-[100%] m-auto b'>
                        <div className='flex items-center border-b-2   justify-between gap-2 bg-[#FAFAFA] font-bold h-[70px] py-4'>
                            <div className='flex gap-3  w-[100%]'>
                                <input type="checkbox" onChange={ handleSelectAll } />
                                <p>Trips</p>
                            </div>
                            <div className='flex gap-4 font-normal p-1'>
                                <button className=' w-[97px]  md:w-[133px] rounded-[8px] border h-[40px]'>Delete</button>
                                <button className=' w-[97px]  md:w-[133px] rounded-[8px] bg-[#162D3A] text-white h-[40px]' onClick={ handleAnalytics }>
                                    Open
                                </button>
                            </div>
                        </div>
                        { csvData.map((item, index) => (
                            <div key={ index } className='border-b-2 border-[#0000000F] h-[47px] mt-2 flex items-center font-semibold'>
                                <input
                                    type="checkbox"
                                    id={ `item-${index}` }
                                    checked={ selectedItems.has(item) }
                                    onChange={ () => handleSelectItem(item) }
                                />
                                <label htmlFor={ `item-${index}` } className='ml-4 mt-4 h-[47px]'>{ item.text || 'Trip Name' }</label>
                            </div>
                        )) }
                    </div>
                ) : (
                    <div className='flex flex-col gap-3 border border-[#A9A9A9] justify-center px-4 items-center rounded-[16px] py-2 h-[442px]'>
                        <img src={ LogoIcon } className='object-cover w-[203.81px] ml-8 h-[184px]' alt="Logo" />
                        <button className='bg-[#162D3A] ml-8 mt-8 w-[186px] h-[52px] rounded-[8px] text-white' onClick={ showModal }>
                            Upload Trip
                        </button>
                        <p className='text-[#9C9C9C] font-medium mt-3 ml-8'>Upload the Excel sheet of your trip</p>
                    </div>
                ) }
            </div>

            <Modal
                title=""
                visible={ visible }
                onCancel={ handleCancel }
                footer={ [
                    <div className='flex justify-center gap-1'>
                        <Button key="cancel" onClick={ handleCancel } style={ { width: '190px', height: '48px' } }>
                            Cancel
                        </Button>,
                        <Button key="save" type="primary" onClick={ handleOk } style={ { width: '190px', height: '48px', backgroundColor: "#162D3A" } }>
                            Save
                        </Button>
                    </div>
                ] }
            >
                <div className='p-2 flex flex-col justify-center items-center mt-6'>
                    <input
                        type="text"
                        placeholder='Trip Name*'
                        className='border border-[#D9D9D9] px-2 outline-none w-[350px] md:w-[395px] h-[40px] rounded-[8px]'
                        value={ inputValue }
                        onChange={ handleInputChange }
                    />
                    <div className='flex flex-col items-center justify-center mt-3 border border-[#00B2FF] px-2 outline-none w-[350px] md:w-[395px] h-[116px] rounded-[8px]'>
                        <img src={ upload } className='object-cover h-[49px]' alt="Upload" />
                        <input
                            type="file"
                            accept=".csv"
                            onChange={ handleFileChange }
                            style={ { display: 'none' } }
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className='cursor-pointer text-[#00B2FF]'>
                            Click here to upload the <u>Excel</u> sheet of your trip
                        </label>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
