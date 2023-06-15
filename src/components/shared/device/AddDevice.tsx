import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Listbox, Transition } from '@headlessui/react';
import { useState } from 'react';
import DeviceContainer from './DeviceContainer';
import { firestore } from 'server/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import Loading from 'components/loading/Loading';

const AddDevice = () => {
    const [isOpen, setIsOpen] = useState(false);
    const deviceType = ['Kiosk', 'Display counter'];
    const [deviceTypeSelect, setDeviceTypeSelect] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [deviceCode, setDeviceCode] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [serviceUse, setServiceUse] = useState('');

    const handleFormSubmit = async () => {
        setIsSubmitted(true);

        if (
            deviceCode &&
            deviceName &&
            ipAddress &&
            username &&
            password &&
            serviceUse
        ) {
            try {
                setIsLoading(true);
                const docRef = await addDoc(collection(firestore, 'devices'), {
                    deviceTypeSelect,
                    deviceCode,
                    deviceName,
                    ipAddress,
                    username,
                    password,
                    serviceUse,
                    active: true,
                    connect: true,
                });
                toast.success('Thêm thiết bị thành công');
                setIsLoading(false);
                showAddDeviceComponent();
                console.log('Document written with ID: ', docRef.id);
            } catch (error) {
                toast.error('Thêm thiết bị thất bại');
                setIsLoading(false);
                console.error('Error adding document: ', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const [showAddDevice, setShowAddDevice] = useState(true);
    const [showContainer, setShowContainer] = useState(false);

    const showAddDeviceComponent = () => {
        setShowContainer(!showContainer);
        setShowAddDevice(!showAddDevice);
    };

    return (
        <>
            {isLoading && <Loading />}
            {showAddDevice && (
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
                            Thêm thiết bị
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
                                                                } shadow-sm pl-6 pr-10 text-left cursor-default focus:outline-none sm:text-sm h-[40px]`}
                                                                onClick={() =>
                                                                    setIsOpen(
                                                                        !isOpen,
                                                                    )
                                                                }
                                                            >
                                                                <span
                                                                    className={` text-[16px] h-full flex items-center mb-2 ${
                                                                        deviceTypeSelect
                                                                            ? 'text-black'
                                                                            : isSubmitted
                                                                                ? 'text-gray-500'
                                                                                : 'text-gray-500'
                                                                    }`}
                                                                >
                                                                    {deviceTypeSelect ||
                                                                        'Chọn loại thiết bị'}
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
                                                                                        className={`cursor-default text-[16px] select-none relative py-6 pl-6 pr-9 ${
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
                                    <div className='flex font-primary flex-col space-y-2'>
                                        <label className='flex font-bold items-center space-x-2'>
                                            <span>Dịch vụ sử dụng:</span>
                                            <span className='text-red-500 mt-3 text-3xl'>
                                                {' '}
                                                *
                                            </span>
                                        </label>
                                        <input
                                            placeholder='Nhập mật khẩu'
                                            type='text'
                                            className={`w-[98%] focus:outline-none h-[40px] border-gray-300 border rounded-xl px-6 ${
                                                isSubmitted && !password
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            value={serviceUse}
                                            onChange={(e) =>
                                                setServiceUse(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className='flex items-center text-[15px] mt-4 space-x-1'>
                                    <span className='text-red-500 font-bold mt-3 text-3xl'>
                                        *{' '}
                                    </span>
                                    <span>Là trường thông tin bắt buộc</span>
                                </div>
                            </div>
                        </div>
                        <div className='w-full mt-12 text-2xl justify-center flex space-x-6'>
                            <button
                                onClick={showAddDeviceComponent}
                                className='mt-6 w-[150px] rounded-xl h-[45px] bg-orange-100 border border-orange-alta text-orange-alta hover: font-secondary font-bold hover:bg-orange-alta hover:text-white'
                            >
                                Hủy bỏ
                            </button>

                            <button
                                onClick={handleFormSubmit}
                                type='submit'
                                className='mt-6 w-[150px] rounded-xl h-[45px] border-orange-alta bg-orange-alta text-white font-secondary font-bold hover:bg-orange-100 border hover:border-orange-alta hover:text-orange-alta'
                            >
                                Thêm thiết bị
                            </button>
                        </div>
                    </div>
                </>
            )}
            {showContainer && <DeviceContainer />}
        </>
    );
};

export default AddDevice;
