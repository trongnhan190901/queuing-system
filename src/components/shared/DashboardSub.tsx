import User from '../partials/User';
import DashboardCalendar from './DashboardCalendar';
import DashboardDoughnut from './DashboardDoughnut';

const DashboardSub = () => {
    return (
        <>
            <div className="w-[430px] space-y-6 mx-8">
                <div className="my-4">
                    <User />
                </div>
                <div className="text-5xl text-orange-500 font-bold px-4 font-primary my-8">
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
