import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import DeviceContainer from './DeviceContainer';
import { PencilIcon } from '@heroicons/react/24/solid';
import UpdateDevice from './UpdateDevice';
import { Device } from 'types';

interface DetailDeviceProp {
    deviceData: Device | null;
    deviceId: string | null;
}

const DetailDevice = ({ deviceData, deviceId }: DetailDeviceProp) => {
    const [showDetailDevice, setShowDetailDevice] = useState(true);
    const [showContainer, setShowContainer] = useState(false);
    const [showUpdateDevice, setShowUpdateDevice] = useState(false);

    const showAddDeviceComponent = () => {
        setShowContainer(!showContainer);
        setShowDetailDevice(!showDetailDevice);
    };

    const showUpdateDeviceComponent = () => {
        setShowDetailDevice(!showDetailDevice);
        setShowUpdateDevice(!showUpdateDevice);
    };

    return (
        <>
            {showDetailDevice && (
                <>
                    <div className='h-32 mx-12 flex items-center'>
                        <div className='text-gray-500 text-3xl font-bold font-primary'>
                            Thiết bị
                        </div>
                        <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                        <div
                            onClick={showAddDeviceComponent}
                            className='text-gray-500 cursor-pointer hover:text-orange-alta text-3xl font-bold font-primary'
                        >
                            Danh sách thiết bị
                        </div>
                        <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                        <div className='text-orange-alta text-3xl font-bold font-primary'>
                            Chi tiết thiết bị
                        </div>
                    </div>
                    <div className='m-12 my-12 text-4xl font-extrabold font-primary text-orange-alta'>
                        Quản lý thiết bị
                    </div>
                    <div className='w-full h-[75%] flex'>
                        <div className='w-[88%] ml-14 h-full pb-24 rounded-3xl drop-shadow-xl shadow-xl bg-white'>
                            <div className='mx-14 pt-8 pb-40'>
                                <div className='text-orange-alta text-[22px] font-bold font-primary'>
                                    Thông tin thiết bị
                                </div>
                                <div className='flex w-full flex-col mt-12 leading-[2.8]'>
                                    <div className='flex w-full'>
                                        <div className='flex w-full'>
                                            <div className='flex font-bold font-primary text-[17px] flex-col'>
                                                <div>Mã thiết bị:</div>
                                                <div>Tên thiết bị:</div>
                                                <div>Địa chỉ IP:</div>
                                            </div>
                                            <div className='flex font-primary ml-24 text-[17px] flex-col'>
                                                <div>
                                                    {deviceData?.deviceCode}
                                                </div>
                                                <div>
                                                    {deviceData?.deviceName}
                                                </div>
                                                <div>
                                                    {deviceData?.ipAddress}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex w-full'>
                                            <div className='flex font-bold font-primary text-[17px] flex-col'>
                                                <div>Loại thiết bị:</div>
                                                <div>Tên đăng nhập:</div>
                                                <div>Mật khẩu:</div>
                                            </div>
                                            <div className='flex font-primary  ml-24 text-[17px] flex-col'>
                                                <div>
                                                    {
                                                        deviceData?.deviceTypeSelect
                                                    }
                                                </div>
                                                <div>
                                                    {deviceData?.username}
                                                </div>
                                                <div>
                                                    {deviceData?.password}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex font-primary text-[17px] leading-[2.8] flex-col'>
                                        <div className='font-bold'>
                                            Dịch vụ sử dụng:
                                        </div>
                                        <div>{deviceData?.serviceUse}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={showUpdateDeviceComponent}
                            className='flex text-[18px] flex-col transition-colors duration-300 group cursor-pointer hover:bg-orange-alta absolute right-0 justify-center items-center w-40 h-48 bg-orange-100 rounded-tl-2xl rounded-bl-2xl drop-shadow-xl shadow-xl'
                        >
                            <div className='w-11 h-11 absolute-center bg-orange-500 group-hover:bg-orange-100 rounded-xl hover:text-white'>
                                <PencilIcon className='w-6 h-6 stroke-orange-100 fill-orange-100 group-hover:stroke-orange-alta group-hover:fill-orange-alta stroke-2' />
                            </div>
                            <div className='text-center font-medium text-orange-500 group-hover:text-orange-100 mt-4 w-36'>
                                Cập nhật thiết bị{' '}
                            </div>
                        </button>
                    </div>
                </>
            )}
            {showContainer && <DeviceContainer />}
            {showUpdateDevice && (
                <UpdateDevice
                    deviceData={deviceData}
                    deviceId={deviceId}
                />
            )}
        </>
    );
};

export default DetailDevice;
