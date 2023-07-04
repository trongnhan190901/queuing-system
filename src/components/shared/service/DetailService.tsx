import {
    ArrowUturnLeftIcon,
    CalendarDaysIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    MagnifyingGlassIcon,
    PencilIcon,
} from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';
import ServiceContainer from './ServiceContainer';
import UpdateService from './UpdateService';
import { Service } from 'types';
import ReactPaginate from 'react-paginate';
import { Listbox, Transition } from '@headlessui/react';
import Calendar from 'react-calendar';
import Navbar from '../../partials/Navbar';
import User from '../../partials/User';

interface UpdateServiceProp {
    serviceData: Service | null;
    serviceId: string | null;
}

const DetailService = ({ serviceData, serviceId }: UpdateServiceProp) => {
    const [showDetailService, setShowDetailService] = useState(true);
    const [showContainer, setShowContainer] = useState(false);
    const [showUpdateService, setShowUpdateService] = useState(false);

    const [generatedData, setGeneratedData] = useState<{ number: string; status: string; date: string; }[]>([]);

    useEffect(() => {
        // @ts-ignore
        const startDate = serviceData?.createdAt?.toDate() as Date;
        const currentDate = new Date() as Date;
        const daysDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)); // Số ngày từ startDate đến ngày hiện tại

        const newData = [];
        for (let i = parseInt(serviceData?.startValueNumber || '0'); i <= 18; i++) {
            const randomNumber = Math.floor(Math.random() * (daysDiff + 1)); // Số ngẫu nhiên từ 0 đến daysDiff
            const randomDate = new Date(startDate);
            randomDate.setDate(randomDate.getDate() + randomNumber);

            const randomStatus = Math.random() < 0.33 ? 'PENDING' : Math.random() < 0.66 ? 'SKIP' : 'COMPLETE';

            newData.push({
                number: serviceData?.serviceCode + i.toString().padStart(4, '0'),
                status: randomStatus,
                date: randomDate.toISOString(), // Chuyển đổi thành chuỗi định dạng ISO 8601
            });
        }

        setGeneratedData(newData);
    }, []);

    const showAddServiceComponent = () => {
        setShowContainer(!showContainer);
        setShowDetailService(!showDetailService);
    };

    const showUpdateServiceComponent = () => {
        setShowDetailService(!showDetailService);
        setShowUpdateService(!showUpdateService);
    };

    const [isOpen, setIsOpen] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(new Date());
    const calendarRef = useRef<HTMLDivElement>(null);

    const handleToggleCalendar = () => {
        setIsOpen(!isOpen);
    };

    const handleDateChange = (date: Date | Date[]) => {
        if (Array.isArray(date)) {
            setSelectedStartDate(date[0]);
            setSelectedEndDate(date[1]);
        } else {
            setSelectedStartDate(date);
            setSelectedEndDate(null);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const [pageNumber, setPageNumber] = useState(0);

    const servicesPerPage = 9;
    const pagesVisited = pageNumber * servicesPerPage;

    const [searchTerm, setSearchTerm] = useState('');
    const activeStatus = ['Tất cả', 'Đã hoàn thành', 'Đang thực hiện', 'Vắng'];
    const [activeStatusSelect, setActiveStatusSelect] = useState(
        activeStatus[0],
    );
    const [activeOpen, setActiveOpen] = useState(false);

    const displayServices = generatedData
        .filter((service) => {
            // Lọc theo statusSelect
            if (activeStatusSelect === 'Tất cả') {
                return true;
            }
            if (activeStatusSelect === 'Vắng') {
                return service.status === 'SKIP';
            }
            if (activeStatusSelect === 'Đã hoàn thành') {
                return service.status === 'COMPLETE';
            }
            if (activeStatusSelect === 'Đang thực hiện') {
                return service.status === 'PENDING';
            }

        })

        .filter((service) => {
            // Lọc theo từ khóa tìm kiếm
            if (!searchTerm) {
                return true;
            }
            // Lọc dựa trên thuộc tính
            return (
                service.number.includes(searchTerm)
            );
        })
        .filter((service) => {
            // Lọc theo startDate và endDate
            if (selectedStartDate && selectedEndDate) {
                const serviceCreatedAt = new Date(service.date);
                return serviceCreatedAt >= selectedStartDate && serviceCreatedAt <= selectedEndDate;
            }
            return true;
        })
        .slice(pagesVisited, pagesVisited + servicesPerPage)
        .map((service, index, array) => {
            const isMultipleOfTwo = (index + 1) % 2 === 0;
            const trClasses = isMultipleOfTwo ? 'bg-orange-50' : 'bg-white';

            const isLast = index === array.length - 1;
            const isMultipleOfNine = (index + 1) % 9 === 0;

            // Kiểm tra và áp dụng kiểu bo cong tương ứng
            const roundedRight = `${
                isLast || isMultipleOfNine
                    ? 'rounded-br-3xl border-solid '
                    : 'border border-orange-200'
            } `;

            const roundedLeft = `${
                isLast || isMultipleOfNine
                    ? 'rounded-bl-3xl border-solid '
                    : 'border border-orange-200'
            } `;

            return (
                <>
                    <React.Fragment key={index}>
                        <tr className={`rounded-tl-2xl h-24 ${trClasses}`}>
                            <th
                                className={`px-6 font-thin text-start ${roundedLeft}`}
                            >
                                {service.number}
                            </th>
                            <th className={`border-t border-l border-orange-200 w-[160px] px-6 font-thin text-start ${roundedRight}`}>
                                {service.status === 'PENDING' ? (
                                    <div className='flex'>
                                        <div className='w-3 h-3 mt-3 mr-3 rounded-full bg-blue-500'></div>
                                        <span>Đang thực hiện</span>
                                    </div>
                                ) : service.status === 'COMPLETE' ? (
                                    <div className='flex'>
                                        <div className='w-3 h-3 mt-3 mr-3 rounded-full bg-green-500'></div>
                                        <span>Đã hoàn thành</span>
                                    </div>
                                ) : (
                                    <div className='flex'>
                                        <div className='w-3 h-3 mt-3 mr-3 rounded-full bg-gray-700'></div>
                                        <span>Vắng</span>
                                    </div>
                                )}
                            </th>
                        </tr>
                    </React.Fragment>
                </>
            );
        });

    const pageCount = Math.ceil(generatedData.length / servicesPerPage);

    const changePage = ({ selected }: any) => {
        setPageNumber(selected);
    };

    return (
        <>
            {showDetailService && (
                <div className='full-size flex relative'>
                    <Navbar />
                    <div className='absolute top-2 z-30 right-2'>
                        <User />
                    </div>
                    <div className='w-full h-screen bg-gray-200'>
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
                        <div className='w-full flex'>
                            <div className='w-[30%] ml-14 h-[800px] pb-24 rounded-3xl drop-shadow-xl shadow-xl bg-white'>
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
                            <div className='w-[57%] h-[800px] relative drop-shadow-xl shadow-xl bg-white rounded-3xl ml-14'>
                                <div className='flex ml-12 mr-64 my-10'>
                                    <div className='w-full z-20'>
                                        <div className='text-3xl'>
                                            Trạng thái
                                        </div>
                                        <Listbox
                                            value={activeStatusSelect}
                                            onChange={(value) => {
                                                setActiveStatusSelect(value);
                                                setActiveOpen(false);
                                            }}
                                        >
                                            {({ open }) => (
                                                <>
                                                    <Listbox.Button
                                                        className={`relative mt-4 rounded-xl w-[170px] bg-white border border-gray-300 shadow-sm pl-5 py-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-200 sm:text-sm ${
                                                            activeOpen
                                                                ? 'ring-orange-200 ring-2'
                                                                : ''
                                                        }`}
                                                        onClick={() =>
                                                            setActiveOpen(
                                                                !activeOpen,
                                                            )
                                                        }
                                                    >
                                                    <span className='block text-3xl truncate'>
                                                        {activeStatusSelect}
                                                    </span>
                                                        <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                                                        {activeOpen ? (
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
                                                            className='absolute z-20 w-[150px] text-3xl bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm'
                                                        >
                                                            {activeStatus.map(
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

                                    <div className='flex'>
                                        <div className='w-[320px] ml-8 z-20 flex flex-col'>
                                            <div className='text-3xl'>Chọn thời gian</div>
                                            <div className='flex space-x-4'>
                                                <div className='flex'>
                                                    <div className='flex flex-col'>
                                                        <Listbox>
                                                            {({ open }) => (
                                                                <>
                                                                    <Listbox.Button
                                                                        className={`relative mt-4 flex rounded-xl w-[145px] bg-white border border-gray-300 shadow-sm px-2 py-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-100 focus:border-orange-100 sm:text-sm ${
                                                                            open ? 'ring-2 ring-orange-100' : ''
                                                                        }`}
                                                                        onClick={handleToggleCalendar}
                                                                    >
                                                                        <CalendarDaysIcon className='w-8 h-8 stroke-orange-alta mr-4 stroke-2' />
                                                                        <span className='block text-3xl text-gray-600 truncate'>
                                                      {selectedStartDate ? selectedStartDate.toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}
                                                    </span>
                                                                    </Listbox.Button>
                                                                    <Transition
                                                                        show={isOpen}
                                                                        enter='transition ease-out duration-100'
                                                                        enterFrom='transform opacity-0 scale-95'
                                                                        enterTo='transform opacity-100 scale-100'
                                                                        leave='transition ease-in duration-75'
                                                                        leaveFrom='transform opacity-100 scale-100'
                                                                        leaveTo='transform opacity-0 scale-95'
                                                                    >
                                                                        <div
                                                                            className='absolute mt-1 w-[400px] bg-white border border-gray-300 rounded-xl shadow-lg h-[385px] overflow-auto focus:outline-none sm:text-sm'
                                                                            ref={calendarRef}
                                                                        >
                                                                            <Calendar
                                                                                // @ts-ignore
                                                                                onChange={(date: Date | Date[]) => handleDateChange(date)}
                                                                                value={selectedStartDate && selectedEndDate ? [selectedStartDate, selectedEndDate] : new Date()}
                                                                                selectRange={true}
                                                                                className='p-3'
                                                                            />
                                                                        </div>
                                                                    </Transition>
                                                                </>
                                                            )}
                                                        </Listbox>
                                                    </div>
                                                    <div className='absolute-center mx-2 h-full'>
                                                        <ChevronRightIcon className='h-8 w-8 mt-4 stroke-gray-500' />
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <Listbox>
                                                            {({ open }) => (
                                                                <>
                                                                    <Listbox.Button
                                                                        className={`relative mt-4 flex rounded-xl w-[145px] bg-white border border-gray-300 shadow-sm px-2 py-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-100 focus:border-orange-100 sm:text-sm ${
                                                                            open ? 'ring-2 ring-orange-100' : ''
                                                                        }`}
                                                                        onClick={handleToggleCalendar}
                                                                    >
                                                                        <CalendarDaysIcon className='w-8 h-8 stroke-orange-alta mr-4 stroke-2' />
                                                                        <span className='block text-3xl text-gray-600 truncate'>
                                                    {selectedEndDate instanceof Date ? selectedEndDate.toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}
                                                </span>
                                                                    </Listbox.Button>
                                                                    <Transition
                                                                        show={isOpen}
                                                                        enter='transition ease-out duration-100'
                                                                        enterFrom='transform opacity-0 scale-95'
                                                                        enterTo='transform opacity-100 scale-100'
                                                                        leave='transition ease-in duration-75'
                                                                        leaveFrom='transform opacity-100 scale-100'
                                                                        leaveTo='transform opacity-0 scale-95'
                                                                    >

                                                                    </Transition>
                                                                </>
                                                            )}
                                                        </Listbox>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex w-full ml-10'>
                                        <div className='w-[290px] '>
                                            <div className='text-3xl'>Từ khóa</div>
                                            <div className='h-16 relative'>
                                                <input
                                                    className='text-3xl w-full border mt-4 rounded-2xl h-16 pl-6'
                                                    placeholder='Nhập từ khóa'
                                                    type='text'
                                                    value={searchTerm}
                                                    onChange={(e) =>
                                                        setSearchTerm(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <span className='absolute inset-y-0 top-1/2 mt-4 right-4 -translate-y-1/2 flex items-center pr-2 pointer-events-none'>
                                                <MagnifyingGlassIcon className='w-10 h-10 stroke-2 stroke-orange-500' />
                                            </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className='mx-12 text-start flex text-3xl font-light font-primary'>
                                        <table className='table-auto w-full rounded-tl-2xl text-start drop-shadow-xl'>
                                            <thead>
                                            <tr className='rounded-tl-2xl h-24 font-bold bg-orange-500 text-white'>
                                                <th className=' w-[50%] px-6 font-bold text-start rounded-tl-3xl'>
                                                    Số thứ tự
                                                </th>
                                                <th className=' px-6 w-[50%] font-bold text-start rounded-tr-3xl'>
                                                    Trạng thái
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {displayServices}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className='flex absolute bottom-0 -right-48 ml-auto bg-rose-100'>
                                    <ReactPaginate
                                        previousLabel={
                                            <ChevronLeftIcon className='w-10 h-10' />
                                        }
                                        nextLabel={
                                            <ChevronRightIcon className='w-10 h-10' />
                                        }
                                        pageCount={pageCount}
                                        onPageChange={changePage}
                                        containerClassName={'pagination'}
                                        previousLinkClassName={'previous_page'}
                                        nextLinkClassName={'next_page'}
                                        disabledClassName={'pagination_disabled'}
                                        activeClassName={'pagination_active'}
                                        pageLinkClassName={'page_link'}
                                    />
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
                    </div>
                </div>
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
