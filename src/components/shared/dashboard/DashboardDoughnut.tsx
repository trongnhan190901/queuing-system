import DeviceDoughnut from './DeviceDoughnut';
import NumberDoughnut from './NumberDoughnut';
import ServiceDoughnut from './ServiceDoughnut';

const DashboardDoughnut = () => {
    return (
        <>
            <div className="w-full flex flex-col space-y-6">
                <DeviceDoughnut />
                <ServiceDoughnut />
                <NumberDoughnut />
            </div>
        </>
    );
};

export default DashboardDoughnut;
