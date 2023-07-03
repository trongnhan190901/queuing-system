import DashboardChart from './DashboardChart';
import DeviceDoughnut from './DeviceDoughnut';
import ServiceDoughnut from './ServiceDoughnut';
import NumberDoughnut from './NumberDoughnut';
import Calendar from 'react-calendar';
import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import Navbar from '../../partials/Navbar';
import User from '../../partials/User';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const DashboardContainer = () => {
    const [value, onChange] = useState<Value>(new Date());

    const isoDate = (() => {
        if (value instanceof Date) {
            return value.toISOString() || '';
        } else if (Array.isArray(value)) {
            const [start, end] = value;
            if (start instanceof Date) {
                return start.toISOString() || '';
            }
        }
        return '';
    })();

    return (
        <>
            <div className='full-size flex relative'>
                <Navbar />
                <div className='absolute top-2 z-30 right-2'>
                    <User />
                </div>
                <div className='full-size flex flex-col z-0'>
                    <div className='flex'>
                        <DashboardChart date={isoDate} />
                        <div className='w-[430px] mt-[4%] space-y-6 mx-8'>
                            <div className='text-4xl text-orange-500 font-bold px-4 font-primary my-8'>
                                Tổng quan
                            </div>
                            <div className='w-full flex flex-col'>
                                <div className='w-full flex flex-col space-y-6'>
                                    <DeviceDoughnut />
                                    <ServiceDoughnut />
                                    <NumberDoughnut date={isoDate} />
                                </div>
                                <div className='calendar-container absolute-center mt-24'>
                                    <Calendar
                                        onChange={onChange}
                                        value={value}
                                        selectRange={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardContainer;
