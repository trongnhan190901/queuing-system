import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { MapIcon, Square3Stack3DIcon } from '@heroicons/react/24/outline';

interface ViewMHTTProp {
    list: string;
}

const ViewMHTT = ({ list }: ViewMHTTProp) => {
    const device = useSelector((state: RootState) => state.auth.device);

    return (
        <>
            <div className='full-size flex flex-col pt-12 pb-24'>
                <div className='full-size'>
                    <div className='h-1/4 w-full px-20'>
                        <div className='flex w-full h-40 items-center'>
                            <img
                                src='/logo.png'
                                alt=''
                                className='w-40 h-32'
                            />
                        </div>
                        <div className='w-full text-5xl font-primary font-bold absolute-center mt-28 text-orange-alta'>
                            Thông tin hiển thị trên thiết bị {device?.deviceCode}
                        </div>
                    </div>
                    <div className='px-96 h-3/4'>
                        <div className='w-full h-full'>
                            <div className='pb-32 absolute-center w-full h-full flex-wrap'>
                                <div className='w-[500px] mx-14 h-[300px] bg-white drop-shadow-xl shadow-xl rounded-3xl'>
                                    <div className='h-[240px] absolute-center text-6xl flex-col font-primary text-blue-500 font-bold'>
                                        <div className='w-24 h-24 bg-blue-100 mb-10 absolute-center rounded-full'>
                                            <Square3Stack3DIcon className='w-16 h-16' /></div>
                                        2010001
                                    </div>
                                    <div className='w-full text-[22px] text-white font-bold font-primary absolute-center h-24 rounded-b-3xl flex flex-col space-y-4 bg-blue-500'>
                                        Số thứ tự hiển thị trên thiết bị
                                    </div>
                                </div>
                                <div className='w-[500px] mx-14 h-[300px] bg-white drop-shadow-xl shadow-xl rounded-3xl'>
                                    <div className='h-[240px] absolute-center text-6xl flex-col font-primary text-orange-300 font-bold'>
                                        <div className='w-24 h-24 bg-orange-100 mb-10 absolute-center rounded-full'>
                                            <MapIcon className='w-16 h-16 stroke-orange-300' /></div>
                                        {list}
                                    </div>
                                    <div className='w-full text-[22px] text-white font-bold font-primary absolute-center h-24 rounded-b-3xl flex flex-col space-y-4 bg-orange-300'>
                                        Vị trí hiển thị thiết bị
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewMHTT;
