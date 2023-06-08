import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend);

const NumberDoughnut = () => {
    const value = (3721 / 4221) * 100;
    const data = {
        datasets: [
            {
                data: [3721, 500],
                backgroundColor: ['#22C55E', '#E0E0E0'],
            },
            {
                data: [100],
                backgroundColor: ['transparent'],
                hover: false,
            },
            {
                data: [468, 3753],
                backgroundColor: ['gray', '#E0E0E0'],
            },
            {
                data: [100],
                backgroundColor: ['transparent'],
                hover: false,
            },
            {
                data: [32, 4189],
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
            <div className="w-full">
                <div className="w-[430px] h-[130px] rounded-3xl drop-shadow-xl shadow-xl absolute-center">
                    <div className="w-32 h-32 mb-4">
                        <Doughnut
                            width={50}
                            height={50}
                            data={data}
                            options={options}
                            plugins={[textCenter]}
                        />
                    </div>

                    <div className="h-28 flex items-center flex-col">
                        <div className="h-full ml-2 w-[120px] text-6xl font-primary font-bold">
                            4.221
                        </div>
                        <div className="w-[120px] h-full flex items-center text-green-500">
                            <Square3Stack3DIcon className="w-12 h-12 mr-4" />
                            <div className="text-3xl">Cấp số</div>
                        </div>
                    </div>
                    <div className="w-[135px] flex flex-col space-y-3">
                        <div className="flex h-full items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-4"></div>
                            <div className="w-full text-2xl flex">
                                Đã sử dụng
                            </div>
                        </div>

                        <div className="flex h-full items-center">
                            <div className="w-3 h-3 rounded-full bg-gray-500 mr-4"></div>
                            <div className="w-full text-2xl flex">Đang chờ</div>
                        </div>

                        <div className="flex h-full items-center">
                            <div className="w-3 h-3 rounded-full bg-pink-500 mr-4"></div>
                            <div className="w-full text-2xl flex">Bỏ qua</div>
                        </div>
                    </div>
                    <div className=" flex flex-col space-y-3">
                        <div className="text-3xl mx-4 font-bold text-green-500 font-primary">
                            3.721
                        </div>
                        <div className="text-3xl mx-4 font-bold text-green-500 font-primary">
                            468
                        </div>
                        <div className="text-3xl mx-4 font-bold text-green-500 font-primary">
                            32
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default NumberDoughnut;
