import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Listbox, Transition } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { firestore } from 'server/firebase';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { Device } from 'types';
import Loading from 'components/loading/Loading';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import DeviceContainer from './DeviceContainer';
import Navbar from '../../partials/Navbar';
import User from '../../partials/User';

interface UpdateDeviceProp {
    deviceData: Device | null;
    deviceId: string | null;
}

const UpdateDevice = ({ deviceData, deviceId }: UpdateDeviceProp) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const deviceType = ['Kiosk', 'Display counter'];
    const [deviceTypeSelect, setDeviceTypeSelect] = useState(
        deviceData?.deviceTypeSelect,
    );
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [deviceCode, setDeviceCode] = useState(deviceData?.deviceCode);
    const [deviceName, setDeviceName] = useState(deviceData?.deviceName);
    const [ipAddress, setIpAddress] = useState(deviceData?.ipAddress);
    const [username, setUsername] = useState(deviceData?.username);
    const [password, setPassword] = useState(deviceData?.password);

    const services = ['Tất cả', 'Khám tim mạch', 'Khám sản - Phụ khoa', 'Khám răng hàm mặt', 'Khám tai mũi họng', 'Khám hô hấp', 'Khám tổng quát'];

    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    useEffect(() => {
        if (deviceData && deviceData.serviceUse) {
            const selectedServices = deviceData.serviceUse.split(', ');
            setSelectedServices(selectedServices);
            if (selectedServices.length === 6) {
                if (!selectedServices.includes('Tất cả')) {
                    setSelectedServices([...selectedServices, 'Tất cả']);
                }
            }
        }
    }, [deviceData]);

    const serviceUseList = selectedServices
        .filter(service => service !== 'Tất cả')
        .map((service, index) => (
            <span
                className='px-3 pl-3 mt-6 mr-6 flex w-fit h-14 items-center text-[17px] font-bold font-primary rounded-xl bg-orange-400 text-white'
                key={index}
            >
                 {service}
                <XMarkIcon
                    className='ml-3 cursor-pointer hover:stroke-red-600 my-auto stroke-2 w-8 h-8'
                />
            </span>
        ));

    const [serviceOpen, setServiceOpen] = useState(false);
    const handleServiceOptionChange = (option: string) => {
        let updatedSelections: string[];

        // Tạo một mảng phụ từ mảng selectedServices
        const clonedSelectedServices = [...selectedServices];

        if (option === 'Tất cả') {
            if (clonedSelectedServices.length === services.length) {
                updatedSelections = [];
            } else {
                updatedSelections = [...services];
            }
        } else {
            if (clonedSelectedServices.includes(option)) {
                updatedSelections = clonedSelectedServices.filter((selectedOption) => selectedOption !== option);
            } else {
                updatedSelections = [...clonedSelectedServices, option];
                if (updatedSelections.length === services.length - 1 && !updatedSelections.includes('Tất cả')) {
                    updatedSelections = ['Tất cả', ...updatedSelections];
                }
            }

            if (updatedSelections.includes('Tất cả') && updatedSelections.length !== services.length) {
                updatedSelections = updatedSelections.filter((selectedOption) => selectedOption !== 'Tất cả');
            }
        }

        setSelectedServices(updatedSelections);
    };


    const handleFormSubmit = async () => {
        setIsSubmitted(true);

        if (
            deviceCode &&
            deviceName &&
            ipAddress &&
            username &&
            password &&
            selectedServices &&
            deviceId
        ) {
            try {
                setIsLoading(true);
                const filteredServices = selectedServices.filter(service => service !== 'Tất cả');
                const deviceRef = doc(firestore, 'devices', deviceId);
                await updateDoc(deviceRef, {
                    deviceTypeSelect,
                    deviceCode,
                    deviceName,
                    ipAddress,
                    username,
                    password,
                    serviceUse: filteredServices.join(', '),
                });

                const userId = user?.id || '';
                const userRef = doc(firestore, 'users', userId);
                await updateDoc(userRef, {
                    logs: `Cập nhật thông tin thiết bị ${deviceCode}`,
                    updateTime: serverTimestamp(),
                });

                toast.success('Cập nhật thiết bị thành công');
                showContainerPage();
                console.log('Document updated with ID: ', deviceId);
            } catch (error) {
                toast.error('Cập nhật thiết bị thất bại');
                setIsLoading(false);
                console.error('Error updating document: ', error);
            } finally {
                setIsLoading(false);
            }
        }
    };


    const [showUpdateDevice, setShowUpdateDevice] = useState(true);
    const [showContainer, setShowContainer] = useState(false);

    const showContainerPage = () => {
        setShowContainer(!showContainer);
        setShowUpdateDevice(!showUpdateDevice);
    };

    return (
        <>
            {isLoading && <Loading />}
            {showUpdateDevice && (
                <div className='full-size flex relative'>
                    <Navbar />
                    <div className='absolute top-2 z-30 right-2'>
                        <User />
                    </div>
                    <div className='w-full h-screen bg-gray-200'>
                        <div className='h-32 mx-12 flex items-center'>
                            <div className='text-gray-500 text-3xl font-bold font-primary'>
                                Thiết bị
                            </div>
                            <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                            <div
                                onClick={showContainerPage}
                                className='text-gray-500 cursor-pointer hover:text-orange-alta text-3xl font-bold font-primary'
                            >
                                Danh sách thiết bị
                            </div>
                            <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                            <div className='text-orange-alta text-3xl font-bold font-primary'>
                                Cập nhật thiết bị
                            </div>
                        </div>
                        <div className='m-12 my-12 text-4xl font-extrabold font-primary text-orange-alta'>
                            Quản lý thiết bị
                        </div>
                        <div className='w-[95%] ml-14 h-[580px] pb-24 rounded-3xl drop-shadow-xl shadow-xl bg-white'>
                            <div className='mx-14 pt-8 pb-40'>
                                <div className='text-orange-alta text-[22px] font-bold font-primary'>
                                    Thông tin thiết bị
                                </div>
                                <div className='mt-12 full-size'>
                                    <div className='flex space-x-8'>
                                        <div className='flex w-full text-[16px] flex-col space-y-6'>
                                            <div className='flex font-primary flex-col space-y-2'>
                                                <label className='flex font-bold items-center space-x-2'>
                                                    <span>Mã thiết bị:</span>
                                                    <span className='text-red-500 mt-3 text-3xl'>
                                                    {' '}
                                                        *
                                                </span>
                                                </label>
                                                <input
                                                    placeholder='Nhập mã thiết bị'
                                                    type='text'
                                                    className={`w-[96%] focus:outline-none h-[40px] border rounded-xl px-6 ${
                                                        isSubmitted && !deviceCode
                                                            ? 'border-red-500'
                                                            : ''
                                                    }`}
                                                    value={deviceCode}
                                                    onChange={(e) =>
                                                        setDeviceCode(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className='flex font-primary flex-col space-y-2'>
                                                <label className='flex font-bold items-center space-x-2'>
                                                    <span>Tên thiết bị:</span>
                                                    <span className='text-red-500 mt-3 text-3xl'>
                                                    {' '}
                                                        *
                                                </span>
                                                </label>
                                                <input
                                                    placeholder='Nhập tên thiết bị'
                                                    type='text'
                                                    className={`w-[96%] focus:outline-none h-[40px] border rounded-xl px-6 ${
                                                        isSubmitted && !deviceName
                                                            ? 'border-red-500'
                                                            : ''
                                                    }`}
                                                    value={deviceName}
                                                    onChange={(e) =>
                                                        setDeviceName(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className='flex font-primary flex-col space-y-2'>
                                                <label className='flex font-bold items-center space-x-2'>
                                                    <span>Địa chỉ IP:</span>
                                                    <span className='text-red-500 mt-3 text-3xl'>
                                                    {' '}
                                                        *
                                                </span>
                                                </label>
                                                <input
                                                    placeholder='Nhập địa chỉ IP'
                                                    type='text'
                                                    className={`w-[96%] focus:outline-none h-[40px] border rounded-xl px-6 ${
                                                        isSubmitted && !ipAddress
                                                            ? 'border-red-500'
                                                            : ''
                                                    }`}
                                                    value={ipAddress}
                                                    onChange={(e) =>
                                                        setIpAddress(e.target.value)
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className='flex w-full text-[16px] flex-col space-y-6'>
                                            <div className='flex font-primary flex-col space-y-2'>
                                                <label className='flex font-bold items-center space-x-2'>
                                                    <span>Loại thiết bị:</span>
                                                    <span className='text-red-500 mt-3 text-[16px]'>
                                                    {' '}
                                                        *
                                                </span>
                                                </label>
                                                <div>
                                                    <Listbox
                                                        value={deviceTypeSelect}
                                                        onChange={
                                                            setDeviceTypeSelect
                                                        }
                                                    >
                                                        {({ open }) => (
                                                            <>
                                                                <Listbox.Button
                                                                    className={`relative rounded-xl w-[96%] bg-white border ${
                                                                        deviceTypeSelect
                                                                            ? 'border-gray-300'
                                                                            : isSubmitted
                                                                                ? 'border-red-500'
                                                                                : 'border-gray-300'
                                                                    } shadow-sm pl-6 pr-10 text-left cursor-pointer focus:outline-none sm:text-sm h-[40px]`}
                                                                    onClick={() =>
                                                                        setIsOpen(
                                                                            !isOpen,
                                                                        )
                                                                    }
                                                                >
                                                                <span className=' text-[16px] h-full flex items-center mb-2 text-black'>
                                                                    {
                                                                        deviceTypeSelect
                                                                    }
                                                                </span>
                                                                    <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                                                                    {isOpen ? (
                                                                        <ChevronUpIcon className='w-8 h-8 stroke-2 stroke-orange-500' />
                                                                    ) : (
                                                                        <ChevronDownIcon className='w-8 h-8 stroke-2 stroke-orange-500' />
                                                                    )}
                                                                </span>
                                                                </Listbox.Button>
                                                                <Transition
                                                                    show={open}
                                                                    enter='transition ease-out duration-100'
                                                                    enterFrom='transform opacity-0 scale-95'
                                                                    enterTo='transform opacity-100 scale-100'
                                                                    leave='transition ease-in duration-75'
                                                                    leaveFrom='transform opacity-100 scale-100'
                                                                    leaveTo='transform opacity-0 scale-95'
                                                                >
                                                                    <Listbox.Options
                                                                        static
                                                                        className='absolute w-[96%] text-[16px] bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden z-50 focus:outline-none'
                                                                    >
                                                                        {deviceType.map(
                                                                            (
                                                                                option,
                                                                            ) => (
                                                                                <Listbox.Option
                                                                                    key={
                                                                                        option
                                                                                    }
                                                                                    value={
                                                                                        option
                                                                                    }
                                                                                >
                                                                                    {({
                                                                                          active,
                                                                                      }) => (
                                                                                        <div
                                                                                            className={`cursor-pointer text-[16px] select-none relative py-6 pl-6 pr-9 ${
                                                                                                active
                                                                                                    ? 'bg-orange-100 text-black'
                                                                                                    : ''
                                                                                            }`}
                                                                                        >
                                                                                        <span
                                                                                            className={`flex items-center text-[16px] h-6 ${
                                                                                                deviceTypeSelect ===
                                                                                                option
                                                                                                    ? 'font-medium'
                                                                                                    : 'font-normal'
                                                                                            }`}
                                                                                        >
                                                                                            {
                                                                                                option
                                                                                            }
                                                                                        </span>
                                                                                        </div>
                                                                                    )}
                                                                                </Listbox.Option>
                                                                            ),
                                                                        )}
                                                                    </Listbox.Options>
                                                                </Transition>
                                                            </>
                                                        )}
                                                    </Listbox>
                                                </div>
                                            </div>
                                            <div className='flex font-primary flex-col space-y-2'>
                                                <label className='flex font-bold items-center space-x-2'>
                                                    <span>Tên đăng nhập:</span>
                                                    <span className='text-red-500 mt-3 text-3xl'>
                                                    {' '}
                                                        *
                                                </span>
                                                </label>
                                                <input
                                                    placeholder='Nhập tên đăng nhập'
                                                    type='text'
                                                    className={`w-[96%] focus:outline-none h-[40px] border-gray-300 border rounded-xl px-6 ${
                                                        isSubmitted && !username
                                                            ? 'border-red-500'
                                                            : ''
                                                    }`}
                                                    value={username}
                                                    onChange={(e) =>
                                                        setUsername(e.target.value)
                                                    }
                                                />
                                            </div>
                                            <div className='flex font-primary flex-col space-y-2'>
                                                <label className='flex font-bold items-center space-x-2'>
                                                    <span>Mật khẩu:</span>
                                                    <span className='text-red-500 mt-3 text-3xl'>
                                                    {' '}
                                                        *
                                                </span>
                                                </label>
                                                <input
                                                    placeholder='Nhập mật khẩu'
                                                    type='text'
                                                    className={`w-[96%] focus:outline-none h-[40px] border-gray-300 border rounded-xl px-6 ${
                                                        isSubmitted && !password
                                                            ? 'border-red-500'
                                                            : ''
                                                    }`}
                                                    value={password}
                                                    onChange={(e) =>
                                                        setPassword(e.target.value)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-full text-[16px] mt-6'>
                                        <div className='flex font-primary flex-col'>
                                            <label className='flex font-bold items-center'>
                                                <span>Dịch vụ sử dụng:</span>
                                                <span className='text-red-500 mt-3 text-3xl'>
                                                {' '}
                                                    *
                                            </span>
                                            </label>
                                            <Listbox
                                                value={selectedServices}
                                            >

                                                {({ open }) => (
                                                    <>
                                                        <Listbox.Button
                                                            className='relative '
                                                            onClick={() => setServiceOpen(!serviceOpen)}
                                                        >
                                                            <div className='h-36 w-[98%] relative flex-wrap flex border-[1.5px] rounded-2xl border-orange-alta'>
                                                                <div className='flex flex-wrap w-full h-full pb-6 px-8'>
                                                                    <div className='w-full cursor-pointer h-48 flex'>
                                                                        {serviceUseList}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Listbox.Button>
                                                        <Transition
                                                            show={open}
                                                            enter='transition ease-out duration-100'
                                                            enterFrom='transform opacity-0 scale-95'
                                                            enterTo='transform opacity-100 scale-100'
                                                            leave='transition ease-in duration-75'
                                                            leaveFrom='transform opacity-100 scale-100'
                                                            leaveTo='transform opacity-0 scale-95'
                                                        >

                                                            <Listbox.Options
                                                                static
                                                                className='absolute mt-1 w-[98%] text-start bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm'
                                                            >
                                                                <Listbox.Option
                                                                    value={'Tất cả'}
                                                                >
                                                                    {({
                                                                          active,
                                                                          selected,
                                                                      }) => (
                                                                        <div
                                                                            onClick={() => handleServiceOptionChange('Tất cả')}
                                                                            className={`cursor-pointer w-full text-black text-[17px] select-none relative py-4 pl-3 ${active ? 'bg-orange-100' : ''}`}
                                                                        >
                                                                                <span className={`block text-[18px] py-2.5 truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                       Tất cả
                                                                    </span>
                                                                        </div>
                                                                    )}
                                                                </Listbox.Option>
                                                                <Listbox.Option
                                                                    value={'Khám tim mạch'}
                                                                >
                                                                    {({
                                                                          active,
                                                                          selected,
                                                                      }) => (
                                                                        <div
                                                                            onClick={() => handleServiceOptionChange('Khám tim mạch')}
                                                                            className={`cursor-pointer w-full flex text-black text-[17px] select-none relative py-4 pl-3 pr-9 ${
                                                                                active
                                                                                    ? 'bg-orange-100 '
                                                                                    : ''
                                                                            }`}
                                                                        >
                                                                                <span className={`block text-[18px] py-2.5 truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                       Khám tim mạch
                                                                    </span>
                                                                        </div>
                                                                    )}
                                                                </Listbox.Option>
                                                                <Listbox.Option
                                                                    value={'Khám sản - Phụ khoa'}
                                                                >
                                                                    {({
                                                                          active,
                                                                          selected,
                                                                      }) => (
                                                                        <div
                                                                            onClick={() => handleServiceOptionChange('Khám sản - Phụ khoa')}
                                                                            className={`cursor-pointer flex text-black text-[17px] select-none relative py-4 pl-3 pr-9 ${
                                                                                active
                                                                                    ? 'bg-orange-100 '
                                                                                    : ''
                                                                            }`}
                                                                        >
                                                                            <span className={`block text-[18px] py-2.5 truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                      Khám sản - Phụ khoa
                                                                    </span>
                                                                        </div>
                                                                    )}
                                                                </Listbox.Option>
                                                                <Listbox.Option
                                                                    value={'Khám răng hàm mặt'}
                                                                >
                                                                    {({
                                                                          active,
                                                                          selected,
                                                                      }) => (
                                                                        <div
                                                                            onClick={() => handleServiceOptionChange('Khám răng hàm mặt')}
                                                                            className={`cursor-pointer flex text-black text-[17px] select-none relative py-4 pl-3 pr-9 ${
                                                                                active
                                                                                    ? 'bg-orange-100 '
                                                                                    : ''
                                                                            }`}
                                                                        >
                                                                            <span className={`block text-[18px] py-2.5 truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                       Khám răng hàm mặt
                                                                    </span>
                                                                        </div>
                                                                    )}
                                                                </Listbox.Option>
                                                                <Listbox.Option
                                                                    value={'Khám tai mũi họng'}
                                                                >
                                                                    {({
                                                                          active,
                                                                          selected,
                                                                      }) => (
                                                                        <div
                                                                            onClick={() => handleServiceOptionChange('Khám tai mũi họng')}
                                                                            className={`cursor-pointer flex text-black text-[17px] select-none relative py-4 pl-3 pr-9 ${
                                                                                active
                                                                                    ? 'bg-orange-100 '
                                                                                    : ''
                                                                            }`}
                                                                        >
                                                                            <span className={`block text-[18px] py-2.5 truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                      Khám tai mũi họng
                                                                    </span>
                                                                        </div>
                                                                    )}
                                                                </Listbox.Option>
                                                                <Listbox.Option
                                                                    value={'Khám hô hấp'}
                                                                >
                                                                    {({
                                                                          active,
                                                                          selected,
                                                                      }) => (
                                                                        <div
                                                                            onClick={() => handleServiceOptionChange('Khám hô hấp')}
                                                                            className={`cursor-pointer flex text-black text-[17px] select-none relative py-4 pl-3 pr-9 ${
                                                                                active
                                                                                    ? 'bg-orange-100 '
                                                                                    : ''
                                                                            }`}
                                                                        >
                                                                            <span className={`block text-[18px] py-2.5 truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                       Khám hô hấp
                                                                    </span>
                                                                        </div>
                                                                    )}
                                                                </Listbox.Option>
                                                                <Listbox.Option
                                                                    value={'Khám tổng quát'}
                                                                >
                                                                    {({
                                                                          active,
                                                                          selected,
                                                                      }) => (
                                                                        <div
                                                                            onClick={() => handleServiceOptionChange('Khám tổng quát')}
                                                                            className={`cursor-pointer flex text-black text-[17px] select-none relative py-4 pl-3 pr-9 ${
                                                                                active
                                                                                    ? 'bg-orange-100 '
                                                                                    : ''
                                                                            }`}
                                                                        >
                                                                            <span className={`block text-[18px] py-2.5 truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                       Khám tổng quát
                                                                    </span>
                                                                        </div>
                                                                    )}
                                                                </Listbox.Option>
                                                            </Listbox.Options>
                                                        </Transition>
                                                    </>
                                                )}
                                            </Listbox>
                                        </div>
                                    </div>
                                    <div className='flex items-center text-[16px] mt-4 space-x-1'>
                                    <span className='text-red-500 font-bold mt-3 text-3xl'>
                                        *{' '}
                                    </span>
                                        <span>Là trường thông tin bắt buộc</span>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full mt-12 text-2xl justify-center flex space-x-6'>
                                <button
                                    onClick={showContainerPage}
                                    className='mt-6 w-[150px] rounded-xl h-[45px] bg-orange-100 border border-orange-alta text-orange-alta hover: font-secondary font-bold hover:bg-orange-alta hover:text-white'
                                >
                                    Hủy bỏ
                                </button>

                                <button
                                    onClick={handleFormSubmit}
                                    type='submit'
                                    className='mt-6 w-[150px] rounded-xl h-[45px] border-orange-alta bg-orange-alta text-white font-secondary font-bold hover:bg-orange-100 border hover:border-orange-alta hover:text-orange-alta'
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showContainer && <DeviceContainer />}
        </>
    );
};

export default UpdateDevice;
