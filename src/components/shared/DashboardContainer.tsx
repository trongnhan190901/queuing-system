import DashboardChart from './DashboardChart';
import DashboardSub from './DashboardSub';

const DashboardContainer = () => {
    return (
        <>
            <div className="full-size flex flex-col">
                <div className="flex">
                    <DashboardChart />
                    <DashboardSub />
                </div>
            </div>
        </>
    );
};

export default DashboardContainer;
