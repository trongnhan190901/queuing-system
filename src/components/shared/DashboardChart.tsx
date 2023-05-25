import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import {
    CalendarIcon,
    CheckIcon,
    UserIcon,
    BookmarkIcon,
    StarIcon,
    PhoneIcon,
    ArrowLongUpIcon,
    ArrowLongDownIcon,
} from '@heroicons/react/24/outline';

Chart.register(...registerables);

const DashboardChart = () => {
    const data = {
        labels: ['01', '13', '19', '31'],
        datasets: [
            {
                data: [2500, 3500, 4221, 3192],
                borderColor: 'blue',
                fill: false,
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

    return (
        <>
            <div className="w-full h-screen bg-gray-200">
                <div className="mx-12 my-12 text-orange-500 text-3xl font-bold font-primary">
                    Dashboard
                </div>
                <div className="mx-12 my-6 text-4xl font-extrabold font-primary text-orange-500">
                    Biểu đồ cấp số
                </div>
                <div className="w-full flex space-x-12 absolute-center my-16">
                    <div className="drop-shadow-xl shadow-xl w-[220px] bg-white rounded-2xl h-[130px] px-8 pb-6 pt-4 ">
                        <div className="w-full mb-8 flex">
                            <div className="w-20 h-20 absolute-center bg-blue-100 rounded-full">
                                <CalendarIcon className="w-14 h-14 stroke-blue-600" />
                            </div>
                            <div className="ml-6 w-[80px] text-2xl flex items-center">
                                Số thứ tự đã cấp
                            </div>
                        </div>
                        <div className="flex items-center w-full">
                            <div className="flex justify-start font-bold font-primary text-5xl">
                                4.221
                            </div>
                            <div className="flex justify-end w-full">
                                <div className="w-[60px] flex justify-end text-orange-500 absolute-center h-8 rounded-2xl bg-orange-100">
                                    <ArrowLongUpIcon className="w-5 h-5 flex items-center" />
                                    <span>32,41%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="drop-shadow-xl shadow-xl w-[220px] bg-white rounded-2xl h-[130px] px-8 pb-6 pt-4 ">
                        <div className="w-full mb-8 flex">
                            <div className="w-20 h-20 absolute-center bg-green-100 rounded-full">
                                <div className="relative">
                                    <CalendarIcon className="w-14 h-14 stroke-green-500" />
                                    <CheckIcon className="w-7 h-7 absolute mt-[4px] top-1/2 left-1/2 stroke-green-500 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                            </div>
                            <div className="ml-6 w-[80px] text-2xl flex items-center">
                                Số thứ tự đã sử dụng
                            </div>
                        </div>
                        <div className="flex items-center w-full">
                            <div className="flex justify-start font-bold font-primary text-5xl">
                                3.721
                            </div>
                            <div className="flex justify-end w-full">
                                <div className="w-[60px] flex justify-end text-rose-500 absolute-center h-8 rounded-2xl bg-rose-100">
                                    <ArrowLongDownIcon className="w-5 h-5 flex items-center" />
                                    <span>32,41%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="drop-shadow-xl shadow-xl w-[220px] bg-white rounded-2xl h-[130px] px-8 pb-6 pt-4 ">
                        <div className="w-full mb-8 flex">
                            <div className="w-20 h-20 absolute-center bg-orange-100 rounded-full">
                                <div className="relative">
                                    <UserIcon className="w-10 h-10 stroke-orange-500 absolute -right-2 -top-3" />
                                    <PhoneIcon className="w-7 h-7 absolute mt-[4px] left-1/2 -top-8  stroke-orange-500 fill-orange-500" />
                                </div>
                            </div>
                            <div className="ml-6 w-[80px] text-2xl flex items-center">
                                Số thứ tự đang chờ
                            </div>
                        </div>
                        <div className="flex items-center w-full">
                            <div className="flex justify-start font-bold font-primary text-5xl">
                                468
                            </div>
                            <div className="flex justify-end w-full">
                                <div className="w-[60px] flex justify-end text-orange-500 absolute-center h-8 rounded-2xl bg-orange-100">
                                    <ArrowLongUpIcon className="w-5 h-5 flex items-center" />
                                    <span>56,41%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="drop-shadow-xl shadow-xl w-[220px] bg-white rounded-2xl h-[130px] px-8 pb-6 pt-4 ">
                        <div className="w-full mb-8 flex">
                            <div className="w-20 h-20 absolute-center bg-rose-100 rounded-full">
                                <div className="relative">
                                    <BookmarkIcon className="w-14 h-14 stroke-rose-500" />
                                    <StarIcon className="w-5 h-5 absolute fill-rose-500 -mt-1 top-1/2 left-1/2 stroke-rose-500 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                            </div>
                            <div className="ml-6 w-[80px] text-2xl flex items-center">
                                Số thứ tự đã bỏ qua
                            </div>
                        </div>
                        <div className="flex items-center w-full">
                            <div className="flex justify-start font-bold font-primary text-5xl">
                                32
                            </div>
                            <div className="flex justify-end w-full">
                                <div className="w-[60px] flex justify-end text-rose-500 absolute-center h-8 rounded-2xl bg-rose-100">
                                    <ArrowLongDownIcon className="w-5 h-5 flex items-center" />
                                    <span>22,41%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-10 drop-shadow-xl shadow-xl my-12 bg-white rounded-2xl">
                    <div className="mx-12 mb-8 pt-12 h-32 flex flex-col justify-center">
                        <div className="flex w-full">
                            {' '}
                            <div className="w-full">
                                <div className="text-3xl font-bold">
                                    {' '}
                                    Bảng thống kế theo ngày
                                </div>
                                <div className="mt-4 text-2xl text-gray-500">
                                    Tháng 5/2023
                                </div>
                            </div>
                            <div className="h-20 flex items-center">
                                <div className="flex text-2xl w-72 mt-3 justify-end">
                                    <div className="font-bold flex mr-4 items-center">
                                        Xem theo
                                    </div>
                                    <select
                                        className="border-2 py-3 outline-none rounded-2xl px-4"
                                        name="data"
                                    >
                                        <option value="day" id="">
                                            Ngày
                                        </option>
                                        <option value="week" id="">
                                            Tuần
                                        </option>
                                        <option value="month" id="">
                                            Tháng
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="py-10">
                        <Line data={data} options={options} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardChart;
