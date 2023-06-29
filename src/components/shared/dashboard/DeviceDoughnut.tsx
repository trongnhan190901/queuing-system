import { ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { ArcElement, Chart, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { Device } from '../../../types';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../server/firebase';

Chart.register(ArcElement, Tooltip, Legend);

const DeviceDoughnut = () => {

    const [activeDevice, setActiveDevice] = useState<number>(0);
    const [unactiveDevice, setUnacctiveDevice] = useState<number>(0);
    const [totalDevice, setTotalDevice] = useState<number>(0);
    const [value, setValue] = useState<number>(0);
    const [isDataFetched, setIsDataFetched] = useState<boolean>(false);

    useEffect(() => {
        const fetchDevices = async () => {
            try {

                const devicesRef = collection(firestore, 'devices');
                const querySnapshot = await getDocs(devicesRef);
                const devicesData = querySnapshot.docs.map((doc) => {
                    const deviceData = doc.data() as Device;
                    const deviceId = doc.id;
                    return { ...deviceData, id: deviceId };
                });

                const totalActive = devicesData.filter((device) => device.active).length;
                setActiveDevice(totalActive);
                const totalUnactive = devicesData.filter((device) => !device.active).length;
                setUnacctiveDevice(totalUnactive);
                const totalDevices = devicesData.length;
                setTotalDevice(totalDevices);
                setValue((totalActive / totalDevices) * 100);
                setIsDataFetched(true);
            } catch (error) {

                console.log('Error fetching devices:', error);
            }
        };

        fetchDevices();
    }, []);

    const data = {
        datasets: [
            {
                data: [activeDevice, unactiveDevice],
                backgroundColor: ['#FF6722', '#E0E0E0'],
            },
            {
                data: [100],
                backgroundColor: ['transparent'],
                hover: false,
            },
            {
                data: [unactiveDevice, activeDevice],
                backgroundColor: ['gray', '#E0E0E0'],
            },
        ],
    };

    const textCenter = {
        id: 'textCenter',
        beforeDatasetDraw(chart: any) {
            const { ctx } = chart;

            ctx.save();
            ctx.font = '16px sans-serif';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const valueToShow = isNaN(value) ? 0 : value.toFixed(0);
            ctx.fillText(
                valueToShow + '%',
                chart.getDatasetMeta(0).data[0].x,
                chart.getDatasetMeta(0).data[0].y,
            );
        },
    };

    const options = {
        maintainAspectRatio: false,
        events: [],
        cutout: 25,
        borderWidth: 0,
    };

    return (
        <>
            <div className='w-full'>
                <div className='w-[430px] h-[130px] rounded-3xl drop-shadow-xl shadow-xl absolute-center'>
                    {isDataFetched && (
                        <>

                            <div className='w-32 h-32 mb-4'>
                                <Doughnut
                                    width={50}
                                    height={50}
                                    data={data}
                                    options={options}
                                    plugins={[textCenter]}
                                />
                            </div>

                            <div className='h-28 flex items-center flex-col'>
                                <div className='h-full ml-2 w-[120px] text-6xl font-primary font-bold'>
                                    {totalDevice}
                                </div>
                                <div className='w-[120px] h-full flex items-center text-orange-500'>
                                    <ComputerDesktopIcon className='w-12 h-12 mr-4' />
                                    <div className='text-3xl'>Thiết bị</div>
                                </div>
                            </div>
                            <div className='w-[135px] flex flex-col space-y-3'>
                                <div className='flex h-full items-center'>
                                    <div className='w-3 h-3 rounded-full bg-orange-500 mr-4'></div>
                                    <div className='w-full text-2xl flex'>
                                        Đang hoạt động
                                    </div>
                                </div>

                                <div className='flex h-full items-center'>
                                    <div className='w-3 h-3 rounded-full bg-gray-500 mr-4'></div>
                                    <div className='w-full text-2xl flex'>
                                        Ngưng hoạt động
                                    </div>
                                </div>
                            </div>
                            <div className=' flex flex-col space-y-3'>
                                <div className='text-3xl mx-4 font-bold text-orange-500 font-primary'>
                                    {activeDevice}
                                </div>
                                <div className='text-3xl mx-4 font-bold text-orange-500 font-primary'>
                                    {unactiveDevice}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};
export default DeviceDoughnut;
