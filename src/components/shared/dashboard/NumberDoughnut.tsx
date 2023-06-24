import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { ArcElement, Chart, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { NumberType } from '../../../types';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../server/firebase';

Chart.register(ArcElement, Tooltip, Legend);

const NumberDoughnut = () => {

    const [totalNumber, setTotalNumber] = useState<number>(0);
    const [waitingNumber, setWaitingNumber] = useState<number>(0);
    const [usedNumber, setUsedNumebr] = useState<number>(0);
    const [skipNumber, setSkipNumber] = useState<number>(0);
    const [value, setValue] = useState<number>(0);
    const [isDataFetched, setIsDataFetched] = useState<boolean>(false);


    useEffect(() => {
        const fetchNumbers = async () => {
            try {
                const numbersRef = collection(firestore, 'numbers');
                const querySnapshot = await getDocs(numbersRef);
                const numbersData = querySnapshot.docs.map((doc) => {
                    const numberData = doc.data() as NumberType;
                    const numberId = doc.id;
                    return { ...numberData, id: numberId };
                });
                const filteredNumbersData = numbersData.filter((number, index) => {
                    if (number.number === 'counter' && index === numbersData.length - 1) {
                        return true; // Giữ lại số cuối cùng nếu là "counter"
                    }
                    return number.number !== 'counter';
                });

                const totalWaiting = filteredNumbersData.filter((number) => number.status === 'WAITING').length;
                setWaitingNumber(totalWaiting);
                const totalUsed = filteredNumbersData.filter((number) => number.status === 'USED').length;
                setUsedNumebr(totalUsed);
                const totalSkip = filteredNumbersData.filter((number) => number.status === 'SKIP').length;
                setSkipNumber(totalSkip);
                const totalNumbers = filteredNumbersData.length;
                setTotalNumber(totalNumbers);
                setValue((totalUsed / totalNumbers) * 100);
                setIsDataFetched(true);
            } catch (error) {
                console.log('Lỗi khi tải thông tin số:', error);
            }
        };


        fetchNumbers();
    }, []);

    const data = {
        datasets: [
            {
                data: [usedNumber, totalNumber - usedNumber],
                backgroundColor: ['#22C55E', '#E0E0E0'],
            },
            {
                data: [100],
                backgroundColor: ['transparent'],
                hover: false,
            },
            {
                data: [waitingNumber, totalNumber - waitingNumber],
                backgroundColor: ['gray', '#E0E0E0'],
            },
            {
                data: [100],
                backgroundColor: ['transparent'],
                hover: false,
            },
            {
                data: [skipNumber, totalNumber - skipNumber],
                backgroundColor: ['#DB2777', '#E0E0E0'],
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
            ctx.fillText(
                value.toFixed(0) + '%',
                chart.getDatasetMeta(0).data[0].x,
                chart.getDatasetMeta(0).data[0].y,
            );
        },
    };

    const options = {
        maintainAspectRatio: false,
        events: [],
        cutout: 20,
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
                                    {totalNumber}
                                </div>
                                <div className='w-[120px] h-full flex items-center text-green-500'>
                                    <Square3Stack3DIcon className='w-12 h-12 mr-4' />
                                    <div className='text-3xl'>Cấp số</div>
                                </div>
                            </div>
                            <div className='w-[135px] flex flex-col space-y-3'>
                                <div className='flex h-full items-center'>
                                    <div className='w-3 h-3 rounded-full bg-green-500 mr-4'></div>
                                    <div className='w-full text-2xl flex'>
                                        Đã sử dụng
                                    </div>
                                </div>

                                <div className='flex h-full items-center'>
                                    <div className='w-3 h-3 rounded-full bg-gray-500 mr-4'></div>
                                    <div className='w-full text-2xl flex'>Đang chờ</div>
                                </div>

                                <div className='flex h-full items-center'>
                                    <div className='w-3 h-3 rounded-full bg-pink-500 mr-4'></div>
                                    <div className='w-full text-2xl flex'>Bỏ qua</div>
                                </div>
                            </div>
                            <div className=' flex flex-col space-y-3'>
                                <div className='text-3xl mx-4 font-bold text-green-500 font-primary'>
                                    {usedNumber}
                                </div>
                                <div className='text-3xl mx-4 font-bold text-green-500 font-primary'>
                                    {waitingNumber}
                                </div>
                                <div className='text-3xl mx-4 font-bold text-green-500 font-primary'>
                                    {skipNumber}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};
export default NumberDoughnut;
