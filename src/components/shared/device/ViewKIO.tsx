import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import HeartSVG from '../../svg/heart';
import GynecolonySVG from '../../svg/gynecolony';
import EarSVG from '../../svg/ear';
import TeethSVG from '../../svg/teeth';
import LaunchSVG from '../../svg/launch';
import FullSVG from '../../svg/full';

interface ViewKIOProp {
    list: string[];
}

const ViewKIO = ({ list }: ViewKIOProp) => {
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
                            <div className='pl-16 font-bold font-primary text-[24px]'>
                                Các lựa chọn cho khách hàng
                            </div>
                            <div className='pb-32 items-center flex w-full h-full flex-wrap'>
                                {list.includes('Khám tim mạch') && (
                                    <div className='w-[350px] mx-14 h-80 bg-white drop-shadow-xl shadow-xl rounded-3xl'>
                                        <div className='h-56 absolute-center'>
                                            <div className='h-36 w-36 bg-rose-200 absolute-center rounded-full'>
                                                <HeartSVG />
                                            </div>
                                        </div>
                                        <div className='w-full text-[22px] text-white font-bold font-primary absolute-center h-24 rounded-b-3xl flex flex-col space-y-4 bg-red-500'>
                                            Khám tim mạch
                                        </div>
                                    </div>
                                )}

                                {list.includes('Khám sản - Phụ khoa') && (
                                    <div className='w-[350px] mx-14 h-80 bg-white drop-shadow-xl shadow-xl rounded-3xl'>
                                        <div className='h-56 absolute-center'>
                                            <div className='h-32 w-32 '>
                                                <GynecolonySVG />
                                            </div>
                                        </div>
                                        <div className='w-full text-[22px] text-white font-bold font-primary absolute-center h-24 rounded-b-3xl flex flex-col space-y-4 bg-rose-400'>
                                            Khám sản - Phụ khoa
                                        </div>
                                    </div>
                                )}
                                {list.includes('Khám tai mũi họng') && (
                                    <div className='w-[350px] mx-14 h-80 bg-white drop-shadow-xl shadow-xl rounded-3xl'>
                                        <div className='h-56 absolute-center'>
                                            <div className='h-36 w-36 bg-orange-100 absolute-center rounded-full'>
                                                <EarSVG />
                                            </div>
                                        </div>
                                        <div className='w-full text-[22px] text-white font-bold font-primary absolute-center h-24 rounded-b-3xl flex flex-col space-y-4 bg-orange-300'>
                                            Khám tai mũi họng
                                        </div>
                                    </div>
                                )}
                                {list.includes('Khám răng hàm mặt') && (
                                    <div className='w-[350px] mx-14 h-80 bg-white drop-shadow-xl shadow-xl rounded-3xl'>
                                        <div className='h-56 absolute-center'>
                                            <div className='h-36 w-36 bg-blue-100 absolute-center rounded-full'>
                                                <TeethSVG />
                                            </div>
                                        </div>
                                        <div className='w-full text-[22px] text-white font-bold font-primary absolute-center h-24 rounded-b-3xl flex flex-col space-y-4 bg-blue-400'>
                                            Khám răng hàm mặt
                                        </div>
                                    </div>
                                )}
                                {list.includes('Khám hô hấp') && (
                                    <div className='w-[350px] mx-14 h-80 bg-white drop-shadow-xl shadow-xl rounded-3xl'>
                                        <div className='h-56 absolute-center'>
                                            <div className='h-36 w-36 bg-green-100 absolute-center rounded-full'>
                                                <div className='mb-4'>
                                                    <LaunchSVG />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='w-full text-[22px] text-white font-bold font-primary absolute-center h-24 rounded-b-3xl flex flex-col space-y-4 bg-lime-500'>
                                            Khám hô hấp
                                        </div>
                                    </div>
                                )}
                                {list.includes('Khám tổng quát') && (
                                    <div className='w-[350px] mx-14 h-80 bg-white drop-shadow-xl shadow-xl rounded-3xl'>
                                        <div className='h-56 absolute-center'>
                                            <div className='h-36 w-36 bg-violet-100 absolute-center rounded-full'>
                                                <FullSVG />
                                            </div>
                                        </div>
                                        <div className='w-full text-[22px] text-white font-bold font-primary absolute-center h-24 rounded-b-3xl flex flex-col space-y-4 bg-violet-400'>
                                            Khám tổng quát
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

export default ViewKIO;
