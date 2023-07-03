import { ArrowUpTrayIcon, ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Listbox, Transition } from '@headlessui/react';
import { Cog8ToothIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { logout } from '../../../store/authSlice';
import ViewMHQ from './ViewMHQ';

const SettingMHQ = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showSetting, setShowSetting] = useState(true);
    const [showView, setShowView] = useState(false);

    const device = useSelector((state: RootState) => state.auth.device);
    const serviceCounterOption = ['Quầy dịch vụ số 1', 'Quầy dịch vụ số 2', 'Quầy dịch vụ số 3', 'Quầy dịch vụ số 4', 'Quầy dịch vụ số 5', 'Quầy dịch vụ số 6'];
    const [serviceCounterSelect, setServiceCounterSelect] = useState(serviceCounterOption[0]);
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        try {
            dispatch(logout());
            navigate('/login');
        } catch (error) {
            console.log('Logout failed', error);
        }
    };

    const services = ['Tất cả', 'Khám tim mạch', 'Khám sản - Phụ khoa', 'Khám răng hàm mặt', 'Khám tai mũi họng', 'Khám hô hấp', 'Khám tổng quát'];

    const [selectedServices, setSelectedServices] = useState<string[]>([...services]);

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

    return (
        <>
            {showSetting && (
                <div className='full-size flex flex-col pt-12 pb-24'>
                    <div className='full-size'>
                        <div className='h-1/4 w-full px-20'>
                            <div className='flex w-full h-40 items-center'>
                                <img
                                    src='/logo.png'
                                    alt=''
                                    className='w-40 h-32'
                                />
                                <div className='flex justify-end w-full'>
                                    <div className='mx-4 my-12 z-20 cursor-pointer rounded-2xl flex w-[22rem] items-end text-orange-alta bg-orange-100 hover:bg-orange-alta hover:text-white'>
                                        <button
                                            onClick={handleLogout}
                                            className='flex pl-4 text-[18px] cursor-pointer font-bold font-primary h-20 items-center'
                                        >
                                            <ArrowUpTrayIcon className='w-12 stroke-2 rotate-90 h-12 mr-4' />
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full text-5xl font-primary font-bold absolute-center mt-28 text-orange-alta'>
                                Cài đặt thiết bị {device?.deviceCode}
                            </div>
                        </div>
                        <div className='pl-40 pr-52 h-3/4'>
                            <div className='px-20 bg-white w-full h-full drop-shadow-xl shadow-xl rounded-3xl'>
                                <div className='py-16 absolute-center flex flex-col'>
                                    <div className='font-bold font-primary text-[22px]'>
                                        Vị trí thiết bị kết nối
                                    </div>
                                    <div className=''>
                                        <Listbox
                                            value={serviceCounterSelect}
                                            onChange={(value) => {
                                                setServiceCounterSelect(value);
                                                setIsOpen(false);
                                            }}
                                        >
                                            {({ open }) => (
                                                <>
                                                    <Listbox.Button
                                                        className={`relative mt-4 rounded-xl w-[450px] bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-200 sm:text-sm ${
                                                            isOpen
                                                                ? 'ring-orange-200 ring-2'
                                                                : ''
                                                        }`}
                                                        onClick={() =>
                                                            setIsOpen(
                                                                !isOpen,
                                                            )
                                                        }
                                                    >
                                                    <span className='block text-3xl truncate'>
                                                        {serviceCounterSelect}
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
                                                            className='absolute mt-[1px] z-20 w-full text-3xl bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm'
                                                        >
                                                            {serviceCounterOption.map(
                                                                (option) => (
                                                                    <Listbox.Option
                                                                        key={option}
                                                                        value={
                                                                            option
                                                                        }
                                                                    >
                                                                        {({
                                                                              active,
                                                                              selected,
                                                                          }) => (
                                                                            <div
                                                                                className={`cursor-pointer text-3xl select-none relative py-3 pl-3 pr-9 ${
                                                                                    active
                                                                                        ? 'bg-orange-100 text-black'
                                                                                        : ''
                                                                                }`}
                                                                            >
                                                                            <span
                                                                                className={`block text-2xl truncate ${
                                                                                    selected
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
                                    <div className='font-bold mt-4 font-primary text-[22px]'>
                                        Số thứ tự hiển thị của dịch vụ
                                    </div>

                                    <Listbox
                                        value={selectedServices}
                                    >
                                        {({ open }) => (
                                            <>
                                                <Listbox.Button
                                                    onClick={() => setServiceOpen(!serviceOpen)}
                                                >
                                                    <div className='mt-12 min-h-24 w-[450px] h-fit pb-6 flex-wrap flex border-[1.5px] rounded-2xl border-orange-alta px-8'>
                                                        {serviceUseList}
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
                                                        className='absolute min-h-24 left-1/2 -translate-x-1/2 mt-8 w-[500px] text-start bg-white border border-gray-300 rounded-xl shadow-lg max-h-96 overflow-auto focus:outline-none sm:text-sm'
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
                                                                    <input
                                                                        type='checkbox'
                                                                        className='form-checkbox mr-2 appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500 absolute right-3 top-1/2 transform -translate-y-1/2'
                                                                        checked={selectedServices.includes('Tất cả')}
                                                                    />
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
                                                                    <input
                                                                        type='checkbox'
                                                                        className='form-checkbox mr-2 appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500 absolute right-3 top-1/2 transform -translate-y-1/2'
                                                                        checked={selectedServices.includes('Khám tim mạch')}
                                                                    />
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
                                                                    <input
                                                                        type='checkbox'
                                                                        className='form-checkbox mr-2 appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500 absolute right-3 top-1/2 transform -translate-y-1/2'
                                                                        checked={selectedServices.includes('Khám sản - Phụ khoa')}
                                                                    />
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
                                                                    <input
                                                                        type='checkbox'
                                                                        className='form-checkbox mr-2 appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500 absolute right-3 top-1/2 transform -translate-y-1/2'
                                                                        checked={selectedServices.includes('Khám răng hàm mặt')}
                                                                    />
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
                                                                    <input
                                                                        type='checkbox'
                                                                        className='form-checkbox mr-2 appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500 absolute right-3 top-1/2 transform -translate-y-1/2'
                                                                        checked={selectedServices.includes('Khám tai mũi họng')}
                                                                    />
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
                                                                    <input
                                                                        type='checkbox'
                                                                        className='form-checkbox mr-2 appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500 absolute right-3 top-1/2 transform -translate-y-1/2'
                                                                        checked={selectedServices.includes('Khám hô hấp')}
                                                                    />
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
                                                                    <input
                                                                        type='checkbox'
                                                                        className='form-checkbox mr-2 appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500 absolute right-3 top-1/2 transform -translate-y-1/2'
                                                                        checked={selectedServices.includes('Khám tổng quát')}
                                                                    />
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
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setShowSetting(false);
                            setShowView(true);
                        }}
                        className='flex text-[18px] mt-96 flex-col transition-colors duration-300 group cursor-pointer hover:bg-orange-alta absolute right-0 justify-center items-center w-40 h-48 bg-orange-100 rounded-tl-2xl rounded-bl-2xl drop-shadow-xl shadow-xl'
                    >
                        <div className='w-11 h-11 absolute-center bg-orange-500 group-hover:bg-orange-100 rounded-xl hover:text-white'>
                            <Cog8ToothIcon className='w-8 h-8 fill-orange-100 group-hover:fill-orange-alta stroke-2' />
                        </div>
                        <div className='text-center font-medium text-orange-500 group-hover:text-orange-100 mt-4 w-36'>
                            Cài đặt
                        </div>
                    </button>
                </div>
            )}
            {showView && <ViewMHQ list={serviceCounterSelect} />}
        </>
    );
};
export default SettingMHQ;
