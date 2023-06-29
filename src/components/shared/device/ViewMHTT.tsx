import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

interface ViewMHTTProp {
    list: string[];
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
                            <div className='pl-24 font-bold font-primary text-[24px]'>
                                Số thứ tự đang hiển thị trên thiết bị
                            </div>
                            <div className='pb-32 items-center flex w-full h-full flex-wrap'>
                                {list.includes('Quầy dịch vụ số 1') && (
                                    <div className='w-[350px] mx-14 h-80 bg-white drop-shadow-xl shadow-xl rounded-3xl'>
                                        <div className='h-56 absolute-center text-6xl font-primary text-red-500 font-bold'>2010001</div>
                                        <div className='w-full text-[22px] text-white font-bold font-primary absolute-center h-24 rounded-b-3xl flex flex-col space-y-4 bg-red-500'>
                                            Quầy dịch vụ số 1
                                        </div>
                                    </div>
                                )}
                                {list.includes('Quầy dịch vụ số 2') && (
                                    <div className='w-[350px] mx-14 h-80 bg-white drop-shadow-xl shadow-xl rounded-3xl'>
                                        <div className='h-56 absolute-center text-6xl font-primary text-rose-600 font-bold'>2010001</div>
                                        <div className='w-full text-[22px] text-white font-bold font-primary absolute-center h-24 rounded-b-3xl flex flex-col space-y-4 bg-rose-400'>
                                            Quầy dịch vụ số 2
                                        </div>
                                    </div>
                                )}
                                {list.includes('Quầy dịch vụ số 3') && (
                                    <div className='w-[350px] mx-14 h-80 bg-white drop-shadow-xl shadow-xl rounded-3xl'>
                                        <div className='h-56 absolute-center text-6xl font-primary text-orange-300 font-bold'>2010001</div>
                                        <div className='w-full text-[22px] text-white font-bold font-primary absolute-center h-24 rounded-b-3xl flex flex-col space-y-4 bg-orange-300'>
                                            Quầy dịch vụ số 3
                                        </div>
                                    </div>
                                )}
                                {list.includes('Quầy dịch vụ số 4') && (
                                    <div className='w-[350px] mx-14 h-80 bg-white drop-shadow-xl shadow-xl rounded-3xl'>
                                        <div className='h-56 absolute-center text-6xl font-primary text-blue-400 font-bold'>2010001</div>
                                        <div className='w-full text-[22px] text-white font-bold font-primary absolute-center h-24 rounded-b-3xl flex flex-col space-y-4 bg-blue-400'>
                                            Quầy dịch vụ số 4
                                        </div>
                                    </div>
                                )}
                                {list.includes('Quầy dịch vụ số 5') && (
                                    <div className='w-[350px] mx-14 h-80 bg-white drop-shadow-xl shadow-xl rounded-3xl'>
                                        <div className='h-56 absolute-center text-6xl font-primary text-lime-500 font-bold'>2010001</div>
                                        <div className='w-full text-[22px] text-white font-bold font-primary absolute-center h-24 rounded-b-3xl flex flex-col space-y-4 bg-lime-500'>
                                            Quầy dịch vụ số 5
                                        </div>
                                    </div>
                                )}
                                {list.includes('Quầy dịch vụ số 6') && (
                                    <div className='w-[350px] mx-14 h-80 bg-white drop-shadow-xl shadow-xl rounded-3xl'>
                                        <div className='h-56 absolute-center text-6xl font-primary text-violet-400 font-bold'>2010001</div>
                                        <div className='w-full text-[22px] text-white font-bold font-primary absolute-center h-24 rounded-b-3xl flex flex-col space-y-4 bg-violet-400'>
                                            Quầy dịch vụ số 6
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewMHTT;
