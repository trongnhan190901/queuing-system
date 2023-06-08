import DashboardCalendar from './DashboardCalendar';
import DashboardDoughnut from './DashboardDoughnut';

const DashboardSub = () => {
    return (
        <>
            <div className="w-[430px] mt-[4%] space-y-6 mx-8">
                <div className="text-4xl text-orange-500 font-bold px-4 font-primary my-8">
                    Tổng quan
                </div>
                <div className="w-full flex flex-col">
                    <DashboardDoughnut />
                    <DashboardCalendar />
                </div>
            </div>
        </>
    );
};
export default DashboardSub;
