import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import {
    ArrowLongDownIcon,
    ArrowLongUpIcon,
    BookmarkIcon,
    CalendarIcon,
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    PhoneIcon,
    StarIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { NumberType } from '../../../types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../../server/firebase';
import moment from 'moment/moment';
import { Listbox, Transition } from '@headlessui/react';

Chart.register(...registerables);

const DashboardChart = ({ date }: { date: string }) => {
    const [currentNumbers, setCurrentNumbers] = useState<NumberType[]>([]);
    const [previousNumbers, setPreviousNumbers] = useState<NumberType[]>([]);
    const [totalNumber, setTotalNumber] = useState<number>(0);
    const [waitingNumber, setWaitingNumber] = useState<number>(0);
    const [usedNumber, setUsedNumber] = useState<number>(0);
    const [skipNumber, setSkipNumber] = useState<number>(0);
    const [totalPercentageChange, setTotalPercentageChange] = useState<number>(0);
    const [usedPercentageChange, setUsedPercentageChange] = useState<number>(0);
    const [skipPercentageChange, setSkipPercentageChange] = useState<number>(0);
    const [waitingPercentageChange, setWaitingPercentageChange] = useState<number>(0);
    const [isDataFetched, setIsDataFetched] = useState<boolean>(false);
    const documentCountByDate: { [key: string]: number } = {};
    const [isOpen, setIsOpen] = useState(false);
    const selectChart = ['Ngày', 'Tuần', 'Tháng'];
    const [chartSelect, setChartSelect] = useState(selectChart[0]);

    const [dailyTotals, setDailyTotals] = useState<number[]>([]);
    const [weeklyTotals, setWeeklyTotals] = useState<number[]>([]);
    const [monthlyTotals, setMonthlyTotals] = useState<number[]>([]);

    const daysInMonth = moment().daysInMonth();
    const firstDayOfMonth = moment().startOf('month');
    const lastDayOfMonth = moment().endOf('month');

// Tạo danh sách các nhãn tự động cho các ngày trong tháng
    const labels = [];
    let currentDate = firstDayOfMonth;

    for (let i = 0; i < daysInMonth; i++) {
        labels.push(currentDate.date().toString());
        currentDate.add(1, 'day');
    }

// Tạo danh sách các nhãn cho từng tuần trong tháng
    const weekLabels = [];
    currentDate = moment(date).startOf('month');
    const startOfWeek = currentDate.clone().startOf('week');
    let currentWeek = 1;
    let weekCount = 0;

    while (currentDate.isSameOrBefore(lastDayOfMonth) && weekCount < 4) {
        if (currentDate.isSameOrAfter(startOfWeek, 'week')) {
            const weekLabel = `Tuần ${currentWeek}`;
            weekLabels.push(weekLabel);

            currentWeek++;
            weekCount++;
        }

        currentDate.add(1, 'day');
    }

// Kiểm tra nếu tháng có hơn 4 tuần, thêm nhãn tuần cuối cùng
    if (weekCount === 4 && currentDate.isSameOrBefore(lastDayOfMonth)) {
        weekLabels.push(`Tuần ${currentWeek}`);
    }

// Tạo danh sách các nhãn cho từng tháng trong năm
    const monthLabels = [];
    const currentMonthForRender = moment().month() + 1;
    const currentYear = moment().format('YYYY');

    for (let i = 1; i <= 12; i++) {
        monthLabels.push(i);
    }


    const dayData = {
        labels: labels,
        datasets: [
            {
                data: dailyTotals,
                borderColor: 'blue',
                fill: false,
                backgroundColor: 'blue',
            },
        ],
    };

    const weekData = {
        labels: weekLabels,
        datasets: [
            {
                data: weeklyTotals,
                borderColor: 'blue',
                fill: false,
                backgroundColor: 'blue',
            },
        ],
    };

    const monthData = {
        labels: monthLabels,
        datasets: [
            {
                data: monthlyTotals,
                borderColor: 'blue',
                fill: false,
                backgroundColor: 'blue',
            },
        ],
    };

    const options = {
        tension: 0.4,
        plugins: {
            legend: {
                display: false,
            },
        },

        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    useEffect(() => {
        const fetchNumbers = async () => {
            try {
                const numbersRef = collection(firestore, 'numbers');
                const querySnapshot = await getDocs(
                    query(
                        numbersRef,
                        where('createdAt', '>=', moment(date).startOf('month').toDate()),
                        where('createdAt', '<=', moment(date).endOf('month').toDate()),
                    ),
                );

                const numbersData = querySnapshot.docs.map((doc) => {
                    const numberData = doc.data() as NumberType;
                    // @ts-ignore
                    return { ...numberData, createdAt: moment(numberData.createdAt.toDate()) };
                });

                const dailyTotals: number[] = [];
                const weeklyTotals: number[] = [];
                const monthlyTotals: number[] = [];

                const startDate = moment(date).startOf('month');
                const endDate = moment(date).endOf('month');
                let currentDate = startDate;

                while (currentDate.isSameOrBefore(endDate)) {
                    const formattedDate = currentDate.format('YYYY-MM-DD');
                    const count = numbersData.filter((number) => number.createdAt.format('YYYY-MM-DD') === formattedDate).length;
                    dailyTotals.push(count);
                    currentDate.add(1, 'day');
                }

                const startOfWeek = moment(date).startOf('month').startOf('week');
                const endOfWeek = moment(date).endOf('month').endOf('week');
                currentDate = startOfWeek;

                while (currentDate.isSameOrBefore(endOfWeek)) {
                    const formattedWeek = currentDate.format('YYYY-MM-DD');
                    const startOfWeek = currentDate.clone().startOf('week');
                    const endOfWeek = currentDate.clone().endOf('week');
                    const count = numbersData.filter((number) => number.createdAt.isBetween(startOfWeek, endOfWeek, 'day', '[]')).length;
                    weeklyTotals.push(count);
                    currentDate.add(1, 'week');
                }

                const startYear = moment(date).startOf('year');
                const endYear = moment(date).endOf('year');
                let currentMonth = startYear.clone().startOf('month');

                while (currentMonth.isSameOrBefore(endYear, 'month')) {
                    const formattedMonth = currentMonth.format('YYYY-MM');
                    const count = numbersData.filter((number) => number.createdAt.format('YYYY-MM') === formattedMonth).length;
                    monthlyTotals.push(count);
                    currentMonth.add(1, 'month');
                }

                setDailyTotals(dailyTotals);
                setWeeklyTotals(weeklyTotals);
                setMonthlyTotals(monthlyTotals);


                setIsDataFetched(true);
            } catch (error) {
                console.log('Lỗi khi tải thông tin số:', error);
            }
        };

        fetchNumbers();
    }, []);

    useEffect(() => {
        const fetchNumbers = async () => {
            try {
                const numbersRef = collection(firestore, 'numbers');
                const querySnapshot = await getDocs(query(numbersRef, where('createdAt', '>=', moment(date).startOf('day').toDate()), where('createdAt', '<=', moment(date).endOf('day').toDate())));
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

                filteredNumbersData.sort((a, b) => a.number.toString().localeCompare(b.number.toString())); // Sắp xếp mảng theo trường "number"

                const totalWaiting = filteredNumbersData.filter((number) => number.status === 'WAITING').length;
                setWaitingNumber(totalWaiting);
                const totalUsed = filteredNumbersData.filter((number) => number.status === 'USED').length;
                setUsedNumber(totalUsed);
                const totalSkip = filteredNumbersData.filter((number) => number.status === 'SKIP').length;
                setSkipNumber(totalSkip);
                const totalNumbers = filteredNumbersData.length;
                setTotalNumber(totalNumbers);

                setPreviousNumbers(currentNumbers); // Lưu trữ dữ liệu của ngày trước đó
                setCurrentNumbers(filteredNumbersData);
                filteredNumbersData.forEach((number) => {
                });
                filteredNumbersData.forEach((number) => {
                    // @ts-ignore
                    const createdAt = moment(number.createdAt.toDate()).format('YYYY-MM-DD');
                    if (documentCountByDate[createdAt]) {
                        documentCountByDate[createdAt]++;
                    } else {
                        documentCountByDate[createdAt] = 1;
                    }
                });

                setIsDataFetched(true);
            } catch (error) {
                console.log('Lỗi khi tải thông tin số:', error);
            }
        };

        fetchNumbers();
    }, [date]);


    useEffect(() => {
        const fetchPreviousData = async () => {
            try {
                const previousDate = moment(date).subtract(1, 'day').format('YYYY-MM-DD'); // Tính toán ngày trước đó
                const numbersRef = collection(firestore, 'numbers');
                const querySnapshot = await getDocs(query(numbersRef, where('createdAt', '>=', moment(previousDate).startOf('day').toDate()), where('createdAt', '<=', moment(previousDate).endOf('day').toDate())));
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
                setPreviousNumbers(filteredNumbersData);
            } catch (error) {
                console.log('Lỗi khi tải thông tin số ngày trước đó:', error);
            }
        };

        fetchPreviousData();
    }, [date]);


    useEffect(() => {
        // Tính toán phần trăm thay đổi giữa hai ngày
        if (currentNumbers.length > 0 && previousNumbers.length > 0) {
            const currentTotalNumber = currentNumbers.length;
            const previousTotalNumber = previousNumbers.length;
            const currentUsedNumber = currentNumbers.filter((number) => number.status === 'USED').length;
            const previousUsedNumber = previousNumbers.filter((number) => number.status === 'USED').length;
            const currentSkipNumber = currentNumbers.filter((number) => number.status === 'SKIP').length;
            const previousSkipNumber = previousNumbers.filter((number) => number.status === 'SKIP').length;
            const currentWaitingNumber = currentNumbers.filter((number) => number.status === 'WAITING').length;
            const previousWaitingNumber = previousNumbers.filter((number) => number.status === 'WAITING').length;

            const totalPercentageChange = ((currentTotalNumber - previousTotalNumber) / previousTotalNumber) * 100;
            const usedPercentageChange = ((currentUsedNumber - previousUsedNumber) / previousUsedNumber) * 100;
            const skipPercentageChange = ((currentSkipNumber - previousSkipNumber) / previousSkipNumber) * 100;
            const waitingPercentageChange = ((currentWaitingNumber - previousWaitingNumber) / previousWaitingNumber) * 100;

            setTotalPercentageChange(Number(totalPercentageChange.toFixed(2)));
            setUsedPercentageChange(Number(usedPercentageChange.toFixed(2)));
            setSkipPercentageChange(Number(skipPercentageChange.toFixed(2)));
            setWaitingPercentageChange(Number(waitingPercentageChange.toFixed(2)));

        }
    }, [currentNumbers, previousNumbers]);

    return (
        <>
            <div className='w-full h-screen bg-gray-200'>
                {isDataFetched && (
                    <>
                        <div className='mx-12 my-16 text-orange-500 text-3xl font-bold font-primary'>
                            Dashboard
                        </div>
                        <div className='mx-12 my-8 text-4xl font-extrabold font-primary text-orange-500'>
                            Biểu đồ cấp số
                        </div>
                        <div className='w-full flex space-x-12 absolute-center my-16'>
                            <div className='drop-shadow-xl shadow-xl w-[220px] bg-white rounded-2xl h-[130px] px-8 pb-6 pt-4 '>
                                <div className='w-full mb-8 flex'>
                                    <div className='w-20 h-20 absolute-center bg-blue-100 rounded-full'>
                                        <CalendarIcon className='w-14 h-14 stroke-blue-600' />
                                    </div>
                                    <div className='ml-6 w-[80px] text-2xl flex items-center'>
                                        Số thứ tự đã cấp
                                    </div>
                                </div>
                                <div className='flex items-center w-full'>
                                    <div className='flex justify-start font-bold font-primary text-5xl'>
                                        {totalNumber}
                                    </div>
                                    <div className='flex justify-end w-full'>
                                        <div
                                            className={`w-[70px] flex justify-end absolute-center h-8 rounded-2xl ${
                                                totalPercentageChange === Infinity ? '' : totalPercentageChange > 0 ? 'bg-orange-100 text-orange-500' : 'bg-rose-100 text-red-500'
                                            }`}
                                        >
                                            {totalPercentageChange === Infinity ? null : (
                                                <>
                                                    {totalPercentageChange > 0 ? (
                                                        <>
                                                            <ArrowLongUpIcon className='w-6 h-6 stroke-2 flex items-center' />
                                                            <span className='text-xl font-primary font-medium'>{`${totalPercentageChange}%`}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ArrowLongDownIcon className='w-6 h-6 stroke-2 flex items-center' />
                                                            <span className='text-xl font-primary font-medium'>{`${-totalPercentageChange}%`}</span>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='drop-shadow-xl shadow-xl w-[220px] bg-white rounded-2xl h-[130px] px-8 pb-6 pt-4 '>
                                <div className='w-full mb-8 flex'>
                                    <div className='w-20 h-20 absolute-center bg-green-100 rounded-full'>
                                        <div className='relative'>
                                            <CalendarIcon className='w-14 h-14 stroke-green-500' />
                                            <CheckIcon className='w-7 h-7 absolute mt-[4px] top-1/2 left-1/2 stroke-green-500 -translate-x-1/2 -translate-y-1/2' />
                                        </div>
                                    </div>
                                    <div className='ml-6 w-[80px] text-2xl flex items-center'>
                                        Số thứ tự đã sử dụng
                                    </div>
                                </div>
                                <div className='flex items-center w-full'>
                                    <div className='flex justify-start font-bold font-primary text-5xl'>
                                        {usedNumber}
                                    </div>
                                    <div className='flex justify-end w-full'>
                                        <div
                                            className={`w-[80px] flex justify-end absolute-center h-8 rounded-2xl ${
                                                usedPercentageChange === Infinity ? '' : usedPercentageChange > 0 ? 'bg-orange-100 text-orange-500' : 'bg-rose-100 text-red-500'
                                            }`}
                                        >
                                            {usedPercentageChange === Infinity ? null : (
                                                <>
                                                    {usedPercentageChange > 0 ? (
                                                        <>
                                                            <ArrowLongUpIcon className='w-6 h-6 stroke-2 flex items-center' />
                                                            <span className='text-xl font-primary font-medium'>{`${usedPercentageChange}%`}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ArrowLongDownIcon className='w-6 h-6 stroke-2 flex items-center' />
                                                            <span className='text-xl font-primary font-medium'>{`${-usedPercentageChange}%`}</span>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='drop-shadow-xl shadow-xl w-[220px] bg-white rounded-2xl h-[130px] px-8 pb-6 pt-4 '>
                                <div className='w-full mb-8 flex'>
                                    <div className='w-20 h-20 absolute-center bg-orange-100 rounded-full'>
                                        <div className='relative'>
                                            <UserIcon className='w-10 h-10 stroke-orange-500 absolute -right-2 -top-3' />
                                            <PhoneIcon className='w-7 h-7 absolute mt-[4px] left-1/2 -top-8  stroke-orange-500 fill-orange-500' />
                                        </div>
                                    </div>
                                    <div className='ml-6 w-[80px] text-2xl flex items-center'>
                                        Số thứ tự đang chờ
                                    </div>
                                </div>
                                <div className='flex items-center w-full'>
                                    <div className='flex justify-start font-bold font-primary text-5xl'>
                                        {waitingNumber}
                                    </div>
                                    <div className='flex justify-end w-full'>
                                        <div
                                            className={`w-[80px] flex justify-end absolute-center h-8 rounded-2xl ${
                                                waitingPercentageChange === Infinity ? '' : waitingPercentageChange > 0 ? 'bg-orange-100 text-orange-500' : 'bg-rose-100 text-red-500'
                                            }`}
                                        >
                                            {waitingPercentageChange === Infinity ? null : (
                                                <>
                                                    {waitingPercentageChange > 0 ? (
                                                        <>
                                                            <ArrowLongUpIcon className='w-6 h-6 stroke-2 flex items-center' />
                                                            <span className='text-xl font-primary font-medium'>{`${waitingPercentageChange}%`}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ArrowLongDownIcon className='w-6 h-6 stroke-2 flex items-center' />
                                                            <span className='text-xl font-primary font-medium'>{`${-waitingPercentageChange}%`}</span>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='drop-shadow-xl shadow-xl w-[220px] bg-white rounded-2xl h-[130px] px-8 pb-6 pt-4 '>
                                <div className='w-full mb-8 flex'>
                                    <div className='w-20 h-20 absolute-center bg-rose-100 rounded-full'>
                                        <div className='relative'>
                                            <BookmarkIcon className='w-14 h-14 stroke-rose-500' />
                                            <StarIcon className='w-5 h-5 absolute fill-rose-500 -mt-1 top-1/2 left-1/2 stroke-rose-500 -translate-x-1/2 -translate-y-1/2' />
                                        </div>
                                    </div>
                                    <div className='ml-6 w-[80px] text-2xl flex items-center'>
                                        Số thứ tự đã bỏ qua
                                    </div>
                                </div>
                                <div className='flex items-center w-full'>
                                    <div className='flex justify-start font-bold font-primary text-5xl'>
                                        {skipNumber}
                                    </div>
                                    <div className='flex justify-end w-full'>
                                        <div
                                            className={`w-[80px] flex justify-end absolute-center h-8 rounded-2xl ${
                                                skipPercentageChange === Infinity ? '' : skipPercentageChange > 0 ? 'bg-orange-100 text-orange-500' : 'bg-rose-100 text-red-500'
                                            }`}
                                        >
                                            {skipPercentageChange === Infinity ? null : (
                                                <>
                                                    {skipPercentageChange > 0 ? (
                                                        <>
                                                            <ArrowLongUpIcon className='w-6 h-6 stroke-2 flex items-center' />
                                                            <span className='text-xl font-primary font-medium'>{`${skipPercentageChange}%`}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ArrowLongDownIcon className='w-6 h-6 stroke-2 flex items-center' />
                                                            <span className='text-xl font-primary font-medium'>{`${-skipPercentageChange}%`}</span>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mx-10 drop-shadow-xl shadow-xl my-12 bg-white rounded-2xl'>
                            <div className='mx-12 mb-8 pt-12 h-32 flex flex-col justify-center'>
                                <div className='flex w-full'>
                                    {' '}
                                    <div className='w-full'>
                                        <div className='text-3xl font-bold'>
                                            {' '}
                                            Bảng thống kế theo ngày
                                        </div>
                                        <div className='mt-4 text-2xl text-gray-500'>
                                            {chartSelect === 'Ngày' || chartSelect === 'Tuần' ? (
                                                <>
                                                    <span>Tháng {currentMonthForRender}/{currentYear}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Năm {currentYear}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className='h-20 flex items-center'>
                                        <div className='flex text-2xl w-80 mt-3 justify-end'>
                                            <div className='font-bold mt-4 flex mr-4 items-center'>
                                                Xem theo
                                            </div>
                                            <div className='w-40 h-18'>
                                                <Listbox
                                                    value={chartSelect}
                                                    onChange={(value) => {
                                                        setChartSelect(value);
                                                        setIsOpen(false);
                                                    }}
                                                >
                                                    {({ open }) => (
                                                        <>
                                                            <Listbox.Button
                                                                className={`relative mt-4 rounded-xl w-full bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-200 sm:text-sm ${
                                                                    isOpen
                                                                        ? 'ring-orange-200 ring-2'
                                                                        : ''
                                                                }`}
                                                                onClick={() =>
                                                                    setIsOpen(
                                                                        !isOpen,
                                                                    )
                                                                }
                                                            >
                                                    <span className='block text-3xl truncate'>
                                                        {chartSelect}
                                                    </span>
                                                                <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                                                        {isOpen ? (
                                                            <ChevronUpIcon className='w-8 h-8 stroke-2 stroke-orange-500' />
                                                        ) : (
                                                            <ChevronDownIcon className='w-8 h-8 stroke-2 stroke-orange-500' />
                                                        )}
                                                    </span>
                                                            </Listbox.Button>
                                                            <Transition
                                                                show={open}
                                                                enter='transition ease-out duration-100'
                                                                enterFrom='transform opacity-0 scale-95'
                                                                enterTo='transform opacity-100 scale-100'
                                                                leave='transition ease-in duration-75'
                                                                leaveFrom='transform opacity-100 scale-100'
                                                                leaveTo='transform opacity-0 scale-95'
                                                            >
                                                                <Listbox.Options
                                                                    static
                                                                    className='absolute mt-[1px] z-20 w-full text-3xl bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm'
                                                                >
                                                                    {selectChart.map(
                                                                        (option) => (
                                                                            <Listbox.Option
                                                                                key={option}
                                                                                value={
                                                                                    option
                                                                                }
                                                                            >
                                                                                {({
                                                                                      active,
                                                                                      selected,
                                                                                  }) => (
                                                                                    <div
                                                                                        className={`cursor-default text-3xl select-none relative py-3 pl-3 pr-9 ${
                                                                                            active
                                                                                                ? 'bg-orange-100 text-black'
                                                                                                : ''
                                                                                        }`}
                                                                                    >
                                                                            <span
                                                                                className={`block text-2xl truncate ${
                                                                                    selected
                                                                                        ? 'font-medium'
                                                                                        : 'font-normal'
                                                                                }`}
                                                                            >
                                                                                {
                                                                                    option
                                                                                }
                                                                            </span>
                                                                                    </div>
                                                                                )}
                                                                            </Listbox.Option>
                                                                        ),
                                                                    )}
                                                                </Listbox.Options>
                                                            </Transition>
                                                        </>
                                                    )}
                                                </Listbox>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='pt-10 mx-6 pb-6'>
                                {chartSelect === 'Ngày' && (
                                    <Line
                                        data={dayData}
                                        options={options}
                                    />
                                )}

                                {chartSelect === 'Tuần' && (
                                    <Line
                                        data={weekData}
                                        options={options}
                                    />
                                )}

                                {chartSelect === 'Tháng' && (
                                    <Line
                                        data={monthData}
                                        options={options}
                                    />
                                )}

                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default DashboardChart;
