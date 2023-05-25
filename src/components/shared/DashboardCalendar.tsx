import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// import './Sample.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const DashboardCalendar = () => {
    const [value, onChange] = useState<Value>(new Date());

    return (
        <>
            <div className="calendar-container absolute-center mt-24">
                <Calendar onChange={onChange} value={value} />
            </div>
        </>
    );
};

export default DashboardCalendar;
