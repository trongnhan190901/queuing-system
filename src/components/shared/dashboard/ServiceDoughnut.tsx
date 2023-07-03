import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { ArcElement, Chart, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../server/firebase';
import { Service } from '../../../types';
import { Link } from 'react-router-dom';

Chart.register(ArcElement, Tooltip, Legend);

const ServiceDoughnut = () => {

    const [activeService, setActiveService] = useState<number>(0);
    const [unactiveService, setUnacctiveService] = useState<number>(0);
    const [totalService, setTotalService] = useState<number>(0);
    const [value, setValue] = useState<number>(0);
    const [isDataFetched, setIsDataFetched] = useState<boolean>(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const servicesRef = collection(firestore, 'services');
                const querySnapshot = await getDocs(servicesRef);
                const servicesData = querySnapshot.docs.map((doc) => {
                    const serviceData = doc.data() as Service;
                    const serviceId = doc.id;
                    return { ...serviceData, id: serviceId };
                });
                const totalActive = servicesData.filter((device) => device.active).length;
                setActiveService(totalActive);
                const totalUnactive = servicesData.filter((device) => !device.active).length;
                setUnacctiveService(totalUnactive);
                const totalServices = servicesData.length;
                setTotalService(totalServices);
                setValue((totalActive / totalServices) * 100);
                setIsDataFetched(true);
            } catch (error) {
                console.log('Error fetching services:', error);
            }
        };

        fetchServices();
    }, []);

    const data = {
        datasets: [
            {
                data: [activeService, unactiveService],
                backgroundColor: ['#1976D2', '#E0E0E0'],
            },
            {
                data: [100],
                backgroundColor: ['transparent'],
                hover: false,
            },
            {
                data: [unactiveService, activeService],
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
                <Link
                    to='/services'
                    className='w-[430px] h-[130px] rounded-3xl drop-shadow-xl shadow-xl absolute-center'
                >
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

                            <div className='h-28 flex flex-col'>
                                <div className='h-full ml-2 w-[120px] text-6xl font-primary font-bold'>
                                    {totalService}
                                </div>
                                <div className='w-[120px] h-full flex items-center text-blue-500'>
                                    <ChatBubbleLeftRightIcon className='w-12 h-12 mr-4' />
                                    <div className='text-3xl'>Dịch vụ</div>
                                </div>
                            </div>
                            <div className='w-[135px] flex flex-col space-y-3'>
                                <div className='flex h-full items-center'>
                                    <div className='w-3 h-3 rounded-full bg-blue-500 mr-4'></div>
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
                                <div className='text-3xl mx-4 font-bold text-blue-500 font-primary'>
                                    {activeService}
                                </div>
                                <div className='text-3xl mx-4 font-bold text-blue-500 font-primary'>
                                    {unactiveService}
                                </div>
                            </div>
                        </>
                    )}
                </Link>
            </div>
        </>
    );
};
export default ServiceDoughnut;
