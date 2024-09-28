import React from 'react';
import Header from '../header/header';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import IconsFats from '../../public/IconsFats.png';
import mingcute_time from '../../public/mingcute_time.png';
import mdi_map from '../../public/mdi_map.png';
import mingcute_timefill from '../../public/mingcute_time-fill.png';
import mingcute_timeew from '../../public/mingcute_timeew.png';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDistance } from 'geolib';

const Analytics = () => {
    const navigate = useNavigate();
    const locationsData = useSelector((state) => state.locations.items);
    console.log(locationsData);

    // Get all coordinates from locationsData
    const positions = locationsData.map(location => ({
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date(location.timestamp), // Parse timestamp
    }));

    // Calculate total distance traveled
    const totalDistance = positions.reduce((acc, curr, index, arr) => {
        if (index === 0) return acc; // Skip the first point
        const distance = getDistance(
            { latitude: arr[index - 1].latitude, longitude: arr[index - 1].longitude },
            { latitude: curr.latitude, longitude: curr.longitude }
        );
        return acc + distance; // Add to the accumulator
    }, 0) / 1000; // Convert to kilometers

    // Calculate total travel duration
    const totalDuration = (positions.length > 0)
        ? (positions[positions.length - 1].timestamp - positions[0].timestamp)
        : 0;

    const totalHours = Math.floor(totalDuration / (1000 * 60 * 60));
    const totalMinutes = Math.floor((totalDuration % (1000 * 60 * 60)) / (1000 * 60));

    // Format the duration
    const formattedDuration = `${totalHours}Hr ${totalMinutes} Mins`;

    // Determine the center of the map as the average of all points
    const centerLat = positions.length > 0 ? positions.reduce((sum, pos) => sum + pos.latitude, 0) / positions.length : 51.505;
    const centerLng = positions.length > 0 ? positions.reduce((sum, pos) => sum + pos.longitude, 0) / positions.length : -0.09;

    return (
        <div>
            <Header />
            <br />
            <div className='w-[90%] m-auto mb-4'>
                <ArrowLeft className='w-[32px] h-[32px]' onClick={ () => navigate('/dashboard') } />
            </div>

            <div className='w-[90%] flex justify-between border-[#A9A9A9] items-center p-3 m-auto h-[70px] rounded-[16px] border'>
                <p className='text-lg font-semibold'>Colaba</p>
                <button className='bg-[#162D3A] rounded-[8px] h-[52px] text-white w-[147px]'>New</button>
            </div>

            <div className='p-2 flex gap-4 px-1 w-[90%] m-auto mt-4 rounded'>
                <div className='flex items-center gap-2'>
                    <div className='h-[15px] w-[15px] rounded-3xl bg-[#0038FF]' />
                    <p>Stopped</p>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='h-[15px] w-[15px] rounded-3xl bg-[#FF00B8]' />
                    <p>Idle</p>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='h-[15px] w-[15px] rounded-3xl bg-[#00FFD1]' />
                    <p>Over speeding</p>
                </div>
            </div>
            <br />

            <MapContainer center={ [centerLat, centerLng] } zoom={ 13 } className='w-[90%] h-[400px] m-auto rounded-md'>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                { positions.map((position, index) => (
                    <Marker key={ index } position={ [position.latitude, position.longitude] }>
                        <Popup>Location { index + 1 }</Popup>
                    </Marker>
                )) }
                <Polyline positions={ positions.map(pos => [pos.latitude, pos.longitude]) } color="blue" />
            </MapContainer>

            <div className='text-[#00000040] relative flex gap-5 p-1 w-[90%] m-auto mt-3'>
                <div className='border border-[#BFBFBF] p-2 cursor-pointer'>
                    <ChevronLeft />
                </div>
                <div className='Miaaaflex flex overflow-x-scroll text-black gap-10 whitespace-nowrap'>
                    <p className='py-2'>Colaba</p>
                    <p className='py-2'>Marine Drive</p>
                    <p className='py-2'>Nariman Point</p>
                    <p className='py-2'>Malabar Hill</p>
                    <p className='py-2'>Bandra</p>
                    <p className='py-2'>Andheri</p>
                </div>
                <div className='border border-[#BFBFBF] right-1 absolute p-2 cursor-pointer'>
                    <ChevronRight />
                </div>
            </div>

            <div className='border-b-2 w-[90%] m-auto border-[#E0E0E0] mt-2'></div>

            <div className='mt-3 w-[90%] m-auto grid gap-8 md:gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                <div className='w-[100%] md:w-[230px] p-2 rounded-[8px] h-[117px] border border-[#A9A9A9]'>
                    <img src={ IconsFats } alt="" />
                    <p className='text-center text-2xl font-bold'>{ totalDistance.toFixed(2) } KM</p>
                    <p className='text-center mt-3'>Total Distance Travelled</p>
                </div>
                <div className='w-[100%] md:w-[230px] p-2 rounded-[8px] h-[117px] border border-[#A9A9A9]'>
                    <img src={ mingcute_timeew } className='bg-sky-300 rounded-3xl' alt="" />
                    <p className='text-center text-2xl font-bold'>{ formattedDuration }</p>
                    <p className='text-center mt-3'>Total Travelled Duration</p>
                </div>
                <div className='w-[100%] md:w-[230px] p-2 rounded-[8px] h-[117px] border border-[#A9A9A9]'>
                    <img src={ mingcute_timefill } alt="" />
                    <p className='text-center text-2xl font-bold'>41 Mins</p>
                    <p className='text-center mt-3'>Over Speeding Duration</p>
                </div>
                <div className='w-[100%] md:w-[230px] p-2 rounded-[8px] h-[117px] border border-[#A9A9A9]'>
                    <img src={ mdi_map } alt="" />
                    <p className='text-center text-2xl font-bold'>20.3 KM</p>
                    <p className='text-center mt-3'>Over Speeding Distance</p>
                </div>
                <div className='w-[100%] md:w-[230px] p-2 rounded-[8px] h-[117px] border border-[#A9A9A9]'>
                    <img src={ mingcute_time } alt="" />
                    <p className='text-center text-2xl font-bold'>41 Mins</p>
                    <p className='text-center mt-3'>Stopped Duration</p>
                </div>
            </div>

            <br />

            <div className='w-[90%] m-auto'>
                <div className='flex gap-2 m-auto h-[62px] bg-[#FAFAFA]'>
                    <div className='w-[150px] md:w-[200px] flex items-center justify-center text-base md:text-lg font-semibold border h-[62px]'>
                        <p>Time</p>
                    </div>
                    <div className='w-[150px] md:w-[200px] flex items-center justify-center text-base md:text-lg font-semibold border h-[62px]'>
                        <p>Point</p>
                    </div>
                    <div className='w-[120px] flex items-center justify-center text-base md:text-lg font-semibold border h-[62px]'>
                        <p>Ignition</p>
                    </div>
                    <div className='w-[120px] flex items-center justify-center text-base md:text-lg font-semibold border h-[62px]'>
                        <p>Speed</p>
                    </div>
                </div>

                <div className='flex gap-2 mt-2 m-auto'>
                    <div className='w-[200px] flex items-center justify-center border h-[62px]'>
                        <p>11:30:24 PM to 11:30:24 PM</p>
                    </div>
                    <div className='w-[200px] flex items-center justify-center border h-[62px]'>
                        <p>40.7128° N, 74.0060° W</p>
                    </div>
                    <div className='w-[120px] flex items-center justify-center border h-[62px]'>
                        <p className='text-[#00A21AD9]'>ON</p>
                    </div>
                    <div className='w-[120px] flex items-center justify-center border h-[62px]'>
                        <p>28.5 KM/H</p>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
    );
};

export default Analytics;
