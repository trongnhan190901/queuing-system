import { Listbox, Transition } from '@headlessui/react';
import React, { useEffect, useRef, useState } from 'react';
import {
    CalendarDaysIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    MagnifyingGlassIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';
import AddService from './AddService';
import { firestore } from 'server/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import UpdateService from './UpdateService';
import ReactPaginate from 'react-paginate';
import DetailService from './DetailService';
import { Service } from 'types';
import Loading from 'components/loading/Loading';
import Calendar from 'react-calendar';
import Navbar from '../../partials/Navbar';
import User from '../../partials/User';

const ServiceContainer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const activeStatus = ['Tất cả', 'Hoạt động', 'Ngưng hoạt động'];
    const [activeStatusSelect, setActiveStatusSelect] = useState(
        activeStatus[0],
    );

    const [activeOpen, setActiveOpen] = useState(false);
    const [isParentVisible, setIsParentVisible] = useState(true);
    const [showAddService, setShowAddService] = useState(false);
    const [showDetailService, setShowDetailService] = useState(false);
    const [showUpdateService, setShowUpdateService] = useState(false);

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

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setIsLoading(true);
                const servicesRef = collection(firestore, 'services');
                const querySnapshot = await getDocs(servicesRef);
                const servicesData = querySnapshot.docs.map((doc) => {
                    const serviceData = doc.data() as Service;
                    const serviceId = doc.id;
                    return { ...serviceData, id: serviceId };
                });
                setServices(servicesData);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log('Error fetching services:', error);
            }
        };

        fetchServices();
    }, []);
    const showAddServiceComponent = () => {
        setIsParentVisible(!isParentVisible);
        setShowAddService(!showAddService);
    };

    const [serviceData, setServiceData] = useState<Service | null>(null);
    const [serviceId, setServiceId] = useState('');

    const showDetailServiceComponent = async (id: string) => {
        try {
            const serviceRef = doc(firestore, 'services', id);
            const serviceSnapshot = await getDoc(serviceRef);
            const serviceData = serviceSnapshot.data() as Service | null;

            setServiceData(serviceData);
            setServiceId(id);

            setIsParentVisible(!isParentVisible);
            setShowDetailService(!showDetailService);
        } catch (error) {
            console.log('Error fetching service data:', error);
        }
    };

    const showUpdateServiceComponent = async (id: string) => {
        try {
            const serviceRef = doc(firestore, 'services', id);
            const serviceSnapshot = await getDoc(serviceRef);
            const serviceData = serviceSnapshot.data() as Service | null;

            setServiceData(serviceData);
            setServiceId(id);

            setIsParentVisible(!isParentVisible);
            setShowUpdateService(!showUpdateService);
        } catch (error) {
            console.log('Error fetching Service data:', error);
        }
    };

    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setIsLoading(true);
                const servicesRef = collection(firestore, 'services');
                const querySnapshot = await getDocs(servicesRef);
                const servicesData = querySnapshot.docs.map((doc) => {
                    const serviceData = doc.data() as Service;
                    const serviceId = doc.id;
                    return { ...serviceData, id: serviceId };
                });
                setServices(servicesData);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log('Error fetching services:', error);
            }
        };

        fetchServices();
    }, []);

    const [pageNumber, setPageNumber] = useState(0);

    const servicesPerPage = 9;
    const pagesVisited = pageNumber * servicesPerPage;

    const [searchTerm, setSearchTerm] = useState('');

    const displayServices = services
        .filter((service) => {
            // Lọc theo trạng thái hoạt động
            if (activeStatusSelect === 'Tất cả') {
                return true;
            }
            return (
                (activeStatusSelect === 'Hoạt động' && service.active) ||
                (activeStatusSelect === 'Ngưng hoạt động' && !service.active)
            );
        })

        .filter((service) => {
            // Lọc theo từ khóa tìm kiếm
            if (!searchTerm) {
                return true;
            }
            // Lọc dựa trên thuộc tính
            return (
                service.serviceCode.toLowerCase().includes(searchTerm) ||
                service.serviceName.toLowerCase().includes(searchTerm) ||
                service.description.toLowerCase().includes(searchTerm) ||
                service.serviceCode.includes(searchTerm) ||
                service.serviceName.includes(searchTerm) ||
                service.description.includes(searchTerm)
            );
        })
        .filter((service) => {
            // Lọc theo startDate và endDate
            if (selectedStartDate && selectedEndDate) {
                // @ts-ignore
                const serviceCreatedAt = service.createdAt.toDate(); // Chuyển đổi timestamp thành đối tượng Date
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
                    <React.Fragment key={service.id}>
                        <tr className={`rounded-tl-2xl h-24 ${trClasses}`}>
                            <th
                                className={`px-6 font-thin text-start ${roundedLeft}`}
                            >
                                {service.serviceCode}
                            </th>
                            <th className='border border-orange-200 px-6 font-thin text-start '>
                                {service.serviceName}
                            </th>
                            <th className='border border-orange-200 w-[166px] pl-6 pr-16 font-thin text-start '>
                                {service.description}
                            </th>
                            <th className='border border-orange-200 px-6 font-thin text-start '>
                                {service.active ? (
                                    <div className='flex'>
                                        <div className='w-3 h-3 mt-3 mr-3 rounded-full bg-green-500'></div>
                                        <span>Đang hoạt động</span>
                                    </div>
                                ) : (
                                    <div className='flex'>
                                        <div className='w-3 h-3 mt-3 mr-3 rounded-full bg-red-500'></div>
                                        <span>Ngưng hoạt động</span>
                                    </div>
                                )}
                            </th>

                            <th
                                onClick={() =>
                                    showDetailServiceComponent(service.id)
                                }
                                className='border border-orange-200 w-[92px] px-6 text-blue-500 cursor-pointer underline-offset-4 hover:no-underline underline font-thin text-start '
                            >
                                Chi tiết
                            </th>
                            <th
                                onClick={() =>
                                    showUpdateServiceComponent(service.id)
                                }
                                className={` w-[108px] px-6 text-blue-500 cursor-pointer underline-offset-4 hover:no-underline underline font-thin text-start  ${roundedRight}`}
                            >
                                Cập nhật
                            </th>
                        </tr>
                    </React.Fragment>
                </>
            );
        });

    const pageCount = Math.ceil(services.length / servicesPerPage);

    const changePage = ({ selected }: any) => {
        setPageNumber(selected);
    };

    return (
        <>
            {isLoading && <Loading />}
            {isParentVisible && (
                <div className='full-size flex relative'>
                    <Navbar />
                    <div className='absolute top-2 z-30 right-2'>
                        <User />
                    </div>
                    <div className='w-full h-screen bg-gray-200'>
                        <div className='flex full-size flex-col'>
                            <div className='h-32 mx-12 flex items-center'>
                                <div className='text-gray-500 text-3xl font-bold font-primary'>
                                    Dịch vụ
                                </div>
                                <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                                <div className='text-orange-500 text-3xl font-bold font-primary'>
                                    Danh sách dịch vụ
                                </div>
                            </div>

                            <div className='m-12 my-12 text-4xl font-extrabold font-primary text-orange-500'>
                                Quản lý dịch vụ
                            </div>
                            <div className='flex ml-12 mr-64 mb-12'>
                                <div className='w-[400px] z-20'>
                                    <div className='text-3xl'>
                                        Trạng thái hoạt động
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
                                                    className={`relative mt-4 rounded-xl w-full bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-200 sm:text-sm ${
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
                                                        className='absolute z-20 w-full text-3xl bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm'
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
                                    <div className='w-[400px] ml-10 z-20 flex flex-col'>
                                        <div className='text-3xl'>Chọn thời gian</div>
                                        <div className='flex space-x-4'>
                                            <div className='flex'>
                                                <div className='flex flex-col'>
                                                    <Listbox>
                                                        {({ open }) => (
                                                            <>
                                                                <Listbox.Button
                                                                    className={`relative mt-4 flex rounded-xl w-[180px] bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-100 focus:border-orange-100 sm:text-sm ${
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
                                                                    className={`relative mt-4 flex rounded-xl w-[180px] bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-100 focus:border-orange-100 sm:text-sm ${
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

                                <div className='flex w-full mr-2 justify-end'>
                                    <div className='w-[300px] '>
                                        <div className='text-3xl'>Từ khóa</div>
                                        <div className='h-16 relative'>
                                            <input
                                                className='text-3xl w-full mt-4 rounded-2xl h-16 pl-6'
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

                            <div className='mx-12 z-0 text-start flex text-3xl font-light font-primary'>
                                <table className='table-auto relative z-0 rounded-tl-2xl text-start drop-shadow-xl '>
                                    <thead>
                                    <tr className='rounded-tl-2xl h-24 font-bold bg-orange-500 text-white'>
                                        <th className='border px-6 font-bold text-start rounded-tl-3xl'>
                                            Mã dịch vụ
                                        </th>
                                        <th className='border w-[350px] px-6 font-bold text-start'>
                                            Tên dịch vụ
                                        </th>
                                        <th className='border px-6 w-[350px] font-bold text-start'>
                                            Mô tả
                                        </th>
                                        <th className='border px-6 w-[350px] font-bold text-start'>
                                            Trạng thái hoạt động
                                        </th>

                                        <th className='border w-[92px] px-6 font-bold text-start'></th>
                                        <th className='border px-6 w-[108px] font-bold text-start rounded-tr-3xl'></th>
                                    </tr>
                                    </thead>
                                    <tbody>{displayServices}</tbody>
                                </table>

                                <button
                                    onClick={showAddServiceComponent}
                                    className='flex flex-col transition-colors duration-300 group cursor-pointer hover:bg-orange-alta absolute right-0 justify-center items-center w-40 h-48 bg-orange-100 rounded-tl-2xl rounded-bl-2xl drop-shadow-xl shadow-xl'
                                >
                                    <div className='w-11 h-11 absolute-center bg-orange-500 group-hover:bg-orange-100 rounded-xl hover:text-white'>
                                        <PlusIcon className='w-8 h-8 stroke-white group-hover:stroke-orange-alta stroke-2' />
                                    </div>
                                    <div className='text-center text-orange-500 group-hover:text-orange-100 mt-4 w-36'>
                                        Thêm dịch vụ
                                    </div>
                                </button>
                            </div>
                            <div className='flex w-full justify-end'>
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
                </div>
            )}
            {showAddService && <AddService />}
            {showDetailService && (
                <DetailService
                    serviceData={serviceData}
                    serviceId={serviceId}
                />
            )}
            {showUpdateService && (
                <UpdateService
                    serviceData={serviceData}
                    serviceId={serviceId}
                />
            )}
        </>
    );
};

export default ServiceContainer;
