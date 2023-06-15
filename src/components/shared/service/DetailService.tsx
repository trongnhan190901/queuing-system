import { ArrowUturnLeftIcon, ChevronRightIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import ServiceContainer from './ServiceContainer';
import UpdateService from './UpdateService';
import { Service } from 'types';

interface UpdateServiceProp {
    serviceData: Service | null;
    serviceId: string | null;
}

const DetailService = ({ serviceData, serviceId }: UpdateServiceProp) => {
    const [showDetailService, setShowDetailService] = useState(true);
    const [showContainer, setShowContainer] = useState(false);
    const [showUpdateService, setShowUpdateService] = useState(false);

    const showAddServiceComponent = () => {
        setShowContainer(!showContainer);
        setShowDetailService(!showDetailService);
    };

    const showUpdateServiceComponent = () => {
        setShowDetailService(!showDetailService);
        setShowUpdateService(!showUpdateService);
    };

    return (
        <>
            {showDetailService && (
                <>
                    <div className='h-32 mx-12 flex items-center'>
                        <div className='text-gray-500 text-3xl font-bold font-primary'>
                            Dịch vụ
                        </div>
                        <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                        <div
                            onClick={showAddServiceComponent}
                            className='text-gray-500 cursor-pointer hover:text-orange-alta text-3xl font-bold font-primary'
                        >
                            Danh sách dịch vụ
                        </div>
                        <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                        <div className='text-orange-alta text-3xl font-bold font-primary'>
                            Chi tiết
                        </div>
                    </div>
                    <div className='m-12 my-12 text-4xl font-extrabold font-primary text-orange-alta'>
                        Quản lý dịch vụ
                    </div>
                    <div className='w-[30%] ml-14 h-[590px] pb-24 rounded-3xl drop-shadow-xl shadow-xl bg-white'>
                        <div className='mx-14 pt-8 pb-24'>
                            <div className='text-orange-alta text-[22px] font-bold font-primary'>
                                Thông tin dịch vụ
                            </div>
                            <div className='mt-12 full-size'>
                                <div className='flex space-x-8'>
                                    <div className='flex w-full text-[16px] flex-col space-y-6'>
                                        <div className='flex w-full'>
                                            <div className='flex font-bold font-primary text-[17px] flex-col space-y-6'>
                                                <div>Mã thiết bị:</div>
                                                <div>Tên thiết bị:</div>
                                                <div>Địa chỉ IP:</div>
                                            </div>
                                            <div className='flex font-primary ml-24 text-[17px] flex-col space-y-6'>
                                                <div>
                                                    {serviceData?.serviceCode}
                                                </div>
                                                <div>
                                                    {serviceData?.serviceName}
                                                </div>
                                                <div>
                                                    {serviceData?.description}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full font-primary text-[16px] mt-6'>
                                    <div className='flex  flex-col space-y-2'>
                                        <div className='text-orange-alta text-[22px] font-bold font-primary'>
                                            Quy tắc cấp số
                                        </div>
                                        {serviceData?.enableEditNumber && (
                                            <>
                                                <div className='flex text-[16px] h-20 items-center'>
                                                    <div className='mr-4 font-bold'>
                                                        Tăng tự động từ:
                                                    </div>
                                                    <input
                                                        type='text'
                                                        className='focus:outline-none h-[40px] border rounded-xl px-4 w-24'
                                                        value={
                                                            serviceData?.startValueNumber
                                                        }
                                                        readOnly
                                                    />
                                                    <div className='mx-4 font-bold'>
                                                        đến
                                                    </div>
                                                    <input
                                                        type='text'
                                                        className='focus:outline-none h-[40px] border rounded-xl px-4 w-24'
                                                        value={
                                                            serviceData?.endValueNumber
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {serviceData?.enableEditPrefix && (
                                            <div className='flex text-[16px] h-20 items-center'>
                                                <div className='mr-4 font-bold'>
                                                    Prefix:
                                                </div>
                                                <input
                                                    type='text'
                                                    className='focus:outline-none ml-[7.5rem] h-[40px] border rounded-xl px-4 w-24'
                                                    value={
                                                        serviceData?.startValuePrefix
                                                    }
                                                    readOnly
                                                />
                                            </div>
                                        )}

                                        {serviceData?.enableEditSurfix && (
                                            <div className='flex text-[16px] h-20 items-center'>
                                                <div className='mr-4 font-bold'>
                                                    Surfix:
                                                </div>
                                                <input
                                                    type='text'
                                                    className='focus:outline-none ml-[7.5rem] h-[40px] border rounded-xl px-4 w-24'
                                                    value={
                                                        serviceData?.startValueSurfix
                                                    }
                                                    readOnly
                                                />
                                            </div>
                                        )}

                                        {serviceData?.enableEditReset && (
                                            <div className='flex text-[16px] h-20 items-center'>
                                                <div className='mr-4 font-bold'>
                                                    Reset mỗi ngày
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='flex items-center font-primary text-[16px] mt-4 space-x-1'>
                                    Ví dụ: 201-2001
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col absolute right-0 top-60'>
                        <button
                            onClick={showUpdateServiceComponent}
                            className='flex text-[18px] flex-col transition-colors duration-300 group cursor-pointer hover:bg-orange-alta justify-center items-center w-40 h-48 bg-orange-100 rounded-tl-2xl drop-shadow-xl shadow-xl'
                        >
                            <div className='w-11 h-11 absolute-center bg-orange-500 group-hover:bg-orange-100 rounded-xl hover:text-white'>
                                <PencilIcon className='w-6 h-6 stroke-orange-100 fill-orange-100 group-hover:stroke-orange-alta group-hover:fill-orange-alta stroke-2' />
                            </div>
                            <div className='text-center font-medium text-orange-500 group-hover:text-orange-100 mt-4 w-36'>
                                Cập nhật danh sách
                            </div>
                        </button>
                        <button
                            onClick={showAddServiceComponent}
                            className='flex text-[18px] flex-col transition-colors duration-300 group cursor-pointer hover:bg-orange-alta justify-center items-center w-40 h-48 bg-orange-100 border-t border-orange-600 rounded-bl-2xl drop-shadow-xl shadow-xl'
                        >
                            <div className='w-11 h-11 absolute-center bg-orange-500 group-hover:bg-orange-100 rounded-xl hover:text-white'>
                                <ArrowUturnLeftIcon className='w-6 h-6 stroke-orange-100 group-hover:stroke-orange-alta stroke-2' />
                            </div>
                            <div className='text-center font-medium text-orange-500 group-hover:text-orange-100 mt-4 w-36'>
                                Quay lại
                            </div>
                        </button>
                    </div>
                </>
            )}
            {showContainer && <ServiceContainer />}
            {showUpdateService && (
                <UpdateService
                    serviceData={serviceData}
                    serviceId={serviceId}
                />
            )}
        </>
    );
};

export default DetailService;
