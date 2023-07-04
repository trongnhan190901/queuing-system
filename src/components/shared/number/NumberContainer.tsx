import {
    CalendarDaysIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    MagnifyingGlassIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';
import AddNumber from './AddNumber';
import { NumberType } from '../../../types';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { firestore } from '../../../server/firebase';
import { dateFormat2 } from '../../../helper/dateFormat';
import NumberDetail from './NumberDetail';
import ReactPaginate from 'react-paginate';
import Loading from '../../loading/Loading';
import { Listbox, Transition } from '@headlessui/react';
import Calendar from 'react-calendar';
import Navbar from '../../partials/Navbar';
import User from '../../partials/User';
import { useLocation } from 'react-router-dom';

const NumberContainer = () => {
    const location = useLocation();
    const statusState = location.state?.status;

    const [isLoading, setIsLoading] = useState(false);
    const services = ['Tất cả', 'Khám tim mạch', 'Khám sản - Phụ khoa', 'Khám răng hàm mặt', 'Khám tai mũi họng', 'Khám hô hấp', 'Khám tổng quát'];
    const [selectedServices, setSelectedServices] = useState(services[0]);
    const status = ['Tất cả', 'Đang chờ', 'Đã sử dụng', 'Bỏ qua'];
    const [selectedStatus, setSelectedStatus] = useState(statusState || status[0]);
    const source = ['Tất cả', 'Kiosk', 'Hệ thống'];
    const [selectedSource, setSelectedSource] = useState(source[0]);

    const [serviceOpen, setServiceOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [sourceOpen, setSourceOpen] = useState(false);

    const [isParentVisible, setIsParentVisible] = useState(true);
    const [showAddNumber, setShowAddNumber] = useState(false);
    const [showDetailNumber, setShowDetailNumber] = useState(false);

    const showAddNumberComponent = () => {
        setIsParentVisible(!isParentVisible);
        setShowAddNumber(!showAddNumber);
    };

    const [numbers, setNumbers] = useState<NumberType[]>([]);

    useEffect(() => {
        const fetchNumbers = async () => {
            try {
                setIsLoading(true);
                const numbersRef = collection(firestore, 'numbers');
                const querySnapshot = await getDocs(numbersRef);
                const numbersData = querySnapshot.docs.map((doc) => {
                    const numberData = doc.data() as NumberType;
                    const numberId = doc.id;
                    return { ...numberData, id: numberId };
                });
                const filteredNumbersData = numbersData.filter((number, index) => {
                    if (number.number === 'counter' && index === numbersData.length - 1) {
                        return true; // Giữ lại số cuối cùng nếu là "counter"
                    }
                    return number.number !== 'counter';
                });


                filteredNumbersData.sort((a, b) => a.number.toString().localeCompare(b.number.toString())); // Sắp xếp mảng theo trường "number"
                setNumbers(filteredNumbersData);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log('Error fetching numbers:', error);
            }
        };

        fetchNumbers();
    }, []);

    const [numberData, setNumberData] = useState<NumberType | null>(null);
    const [numberId, setNumberId] = useState('');
    const showDetailNumberComponent = async (id: string) => {
        try {
            const numberRef = doc(firestore, 'numbers', id);
            const numberSnapshot = await getDoc(numberRef);
            const numberData = numberSnapshot.data() as NumberType | null;

            setNumberData(numberData);
            setNumberId(id);
            console.log(numberData);
            setIsParentVisible(!isParentVisible);
            setShowDetailNumber(!showDetailNumber);
        } catch (error) {
            console.log('Error fetching device data:', error);
        }
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

    const numbersPerPage = 9;
    const pagesVisited = pageNumber * numbersPerPage;

    const [searchTerm, setSearchTerm] = useState('');

    const displayNumbers = numbers
        .filter((number) => {
            // Lọc theo servicesSelect
            if (selectedServices === 'Tất cả') {
                return true;
            }
            return number.serviceSelect === selectedServices;
        })
        .filter((number) => {
            // Lọc theo statusSelect
            if (selectedStatus === 'Tất cả') {
                return true;
            }
            if (selectedStatus === 'Đang chờ') {
                return number.status === 'WAITING';
            }
            if (selectedStatus === 'Đã sử dụng') {
                return number.status === 'USED';
            }
            if (selectedStatus === 'Bỏ qua') {
                return number.status === 'SKIPPED';
            }
        })
        .filter((number) => {
            // Lọc theo sourceSelect
            if (selectedSource === 'Tất cả') {
                return true;
            }
            return number.source === selectedSource;
        })
        .filter((number) => {
            // Lọc theo từ khóa tìm kiếm
            if (!searchTerm) {
                return true;
            }
            // Lọc dựa trên thuộc tính
            return (
                number.number.toString().includes(searchTerm) ||
                number.fullName?.toLowerCase().includes(searchTerm) ||
                number.fullName?.includes(searchTerm)
            );
        })
        .filter((number) => {
            // Lọc theo startDate và endDate
            if (selectedStartDate && selectedEndDate) {
                // @ts-ignore
                const numberCreatedAt = number.createdAt.toDate(); // Chuyển đổi timestamp thành đối tượng Date
                return numberCreatedAt >= selectedStartDate && numberCreatedAt <= selectedEndDate;
            }
            return true;
        })
        .slice(pagesVisited, pagesVisited + numbersPerPage)
        .map((number, index, array) => {
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
                    <React.Fragment key={number.id}>
                        <tr className={`rounded-tl-2xl h-24 ${trClasses}`}>
                            <th
                                className={`px-6 w-[110px] font-thin text-start ${roundedLeft}`}
                            >
                                {number.number}
                            </th>
                            <th className='border border-orange-200 w-[250px] px-6 font-thin text-start '>
                                {number.fullName}
                            </th>
                            <th className='border border-orange-200 w-[250px] pl-6 pr-16 font-thin text-start '>
                                {number.serviceSelect}
                            </th>
                            <th className='border border-orange-200 px-6 font-thin text-start '>
                                {/*// @ts-ignore*/}
                                {dateFormat2(number.createdAt.toDate().toISOString())}
                            </th>
                            <th className='border border-orange-200 px-6 font-thin text-start '>
                                {/*// @ts-ignore*/}
                                {dateFormat2(number.expirationTime.toDate().toISOString())}
                            </th>
                            <th className='border border-orange-200 w-[160px] px-6 font-thin text-start '>
                                {number.status === 'WAITING' ? (
                                    <div className='flex'>
                                        <div className='w-3 h-3 mt-3 mr-3 rounded-full bg-blue-500'></div>
                                        <span>Đang chờ</span>
                                    </div>
                                ) : number.status === 'USED' ? (
                                    <div className='flex'>
                                        <div className='w-3 h-3 mt-3 mr-3 rounded-full bg-gray-500'></div>
                                        <span>Đã sử dụng</span>
                                    </div>
                                ) : (
                                    <div className='flex'>
                                        <div className='w-3 h-3 mt-3 mr-3 rounded-full bg-red-500'></div>
                                        <span>Bỏ qua</span>
                                    </div>
                                )}
                            </th>
                            <th className='border border-orange-200 px-6 font-thin text-start '>
                                {number.source}
                            </th>
                            <th
                                onClick={() =>
                                    showDetailNumberComponent(number.id)
                                }
                                className={` w-[110px] px-6 text-blue-500 cursor-pointer underline-offset-4 hover:no-underline underline font-thin text-start  ${roundedRight}`}
                            >
                                Chi tiết
                            </th>

                        </tr>
                    </React.Fragment>
                </>
            );
        });

    const pageCount = Math.ceil(numbers.length / numbersPerPage);

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
                        <div className='h-32 mx-12 flex items-center'>
                            <div className='text-gray-500 text-3xl font-bold font-primary'>
                                Cấp số
                            </div>
                            <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                            <div className='text-orange-500 text-3xl font-bold font-primary'>
                                Danh sách cấp số
                            </div>
                        </div>

                        <div className='m-12 my-12 text-4xl font-extrabold font-primary text-orange-500'>
                            Quản lý cấp số
                        </div>
                        <div className='flex ml-12 relative mb-12'>
                            <div className='w-[200px] z-20'>
                                <div className='text-3xl'>Tên dịch vụ</div>
                                <Listbox
                                    value={selectedServices}
                                    onChange={(value) => {
                                        setSelectedServices(value);
                                        setServiceOpen(false);
                                    }}
                                >
                                    {({ open }) => (
                                        <>
                                            <Listbox.Button
                                                className={`relative mt-4 rounded-xl w-full bg-white border border-gray-300
                                                 shadow-sm pl-6 py-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-200 sm:text-sm ${
                                                    serviceOpen ? 'ring-orange-200 ring-2' : ''
                                                }`}
                                                onClick={() => setServiceOpen(!serviceOpen)}
                                            >
                        <span
                            className={`text-[16px] py-2 h-full flex items-center ${
                                selectedServices
                                    ? 'text-black'
                                    : 'text-gray-500'
                            }`}
                        >
                          {selectedServices}
                        </span>
                                                <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                          {serviceOpen ? (
                              <ChevronUpIcon className='w-8 h-8 stroke-2 stroke-orange-alta' />
                          ) : (
                              <ChevronDownIcon className='w-8 h-8 stroke-2 stroke-orange-alta' />
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
                                                    className='absolute mt-[1px] max-h-56 z-20 w-full text-3xl bg-white border border-gray-300 rounded-2xl shadow-lg overflow-auto focus:outline-none sm:text-sm'
                                                >
                                                    {services.map((option) => (
                                                        <Listbox.Option
                                                            key={option}
                                                            value={option}
                                                        >
                                                            {({ active, selected }) => (
                                                                <div
                                                                    className={`cursor-pointer text-[16px] select-none relative py-3 pl-3 pr-9 ${
                                                                        active ? 'bg-orange-100 text-black' : ''
                                                                    }`}
                                                                >
                                  <span
                                      className={`block text-[16px] py-3 truncate ${
                                          selected ? 'font-medium' : 'font-normal'
                                      }`}
                                  >
                                    {option}
                                  </span>
                                                                </div>
                                                            )}
                                                        </Listbox.Option>
                                                    ))}
                                                </Listbox.Options>
                                            </Transition>
                                        </>
                                    )}
                                </Listbox>
                            </div>

                            <div className='w-[200px] ml-8 z-20'>
                                <div className='text-3xl'>Trạng thái</div>
                                <Listbox
                                    value={selectedStatus}
                                    onChange={(value) => {
                                        setSelectedStatus(value);
                                        setStatusOpen(false);
                                    }}
                                >
                                    {({ open }) => (
                                        <>
                                            <Listbox.Button
                                                className={`relative mt-4 rounded-xl w-full bg-white border- border-gray-300
                                                 shadow-sm pl-6 py-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-200 sm:text-sm ${
                                                    statusOpen ? 'ring-orange-200 ring-2' : ''
                                                }`}
                                                onClick={() => setStatusOpen(!statusOpen)}
                                            >
                        <span
                            className={`text-[16px] py-2 h-full flex items-center ${
                                selectedStatus
                                    ? 'text-black'
                                    : 'text-gray-500'
                            }`}
                        >
                          {selectedStatus}
                        </span>
                                                <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                          {statusOpen ? (
                              <ChevronUpIcon className='w-8 h-8 stroke-2 stroke-orange-alta' />
                          ) : (
                              <ChevronDownIcon className='w-8 h-8 stroke-2 stroke-orange-alta' />
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
                                                    className='absolute mt-[1px] max-h-56 z-20 w-full text-3xl bg-white border border-gray-300 rounded-2xl shadow-lg overflow-auto focus:outline-none sm:text-sm'
                                                >
                                                    {status.map((option) => (
                                                        <Listbox.Option
                                                            key={option}
                                                            value={option}
                                                        >
                                                            {({ active, selected }) => (
                                                                <div
                                                                    className={`cursor-pointer text-[16px] select-none relative py-3 pl-3 pr-9 ${
                                                                        active ? 'bg-orange-100 text-black' : ''
                                                                    }`}
                                                                >
                                  <span
                                      className={`block text-[16px] py-3 truncate ${
                                          selected ? 'font-medium' : 'font-normal'
                                      }`}
                                  >
                                    {option}
                                  </span>
                                                                </div>
                                                            )}
                                                        </Listbox.Option>
                                                    ))}
                                                </Listbox.Options>
                                            </Transition>
                                        </>
                                    )}
                                </Listbox>
                            </div>

                            <div className='w-[200px] ml-8 z-20'>
                                <div className='text-3xl'>Nguồn cấp</div>
                                <Listbox
                                    value={selectedSource}
                                    onChange={(value) => {
                                        setSelectedSource(value);
                                        setSourceOpen(false);
                                    }}
                                >
                                    {({ open }) => (
                                        <>
                                            <Listbox.Button
                                                className={`relative mt-4 rounded-xl w-full bg-white border- border-gray-300
                                                 shadow-sm pl-6 py-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-200 sm:text-sm ${
                                                    statusOpen ? 'ring-orange-200 ring-2' : ''
                                                }`}
                                                onClick={() => setSourceOpen(!sourceOpen)}
                                            >
                        <span
                            className={`text-[16px] py-2 h-full flex items-center ${
                                selectedSource
                                    ? 'text-black'
                                    : 'text-gray-500'
                            }`}
                        >
                          {selectedSource}
                        </span>
                                                <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                          {sourceOpen ? (
                              <ChevronUpIcon className='w-8 h-8 stroke-2 stroke-orange-alta' />
                          ) : (
                              <ChevronDownIcon className='w-8 h-8 stroke-2 stroke-orange-alta' />
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
                                                    className='absolute mt-[1px] max-h-56 z-20 w-full text-3xl bg-white border border-gray-300 rounded-2xl shadow-lg overflow-auto focus:outline-none sm:text-sm'
                                                >
                                                    {source.map((option) => (
                                                        <Listbox.Option
                                                            key={option}
                                                            value={option}
                                                        >
                                                            {({ active, selected }) => (
                                                                <div
                                                                    className={`cursor-pointer text-[16px] select-none relative py-3 pl-3 pr-9 ${
                                                                        active ? 'bg-orange-100 text-black' : ''
                                                                    }`}
                                                                >
                                  <span
                                      className={`block text-[16px] py-3 truncate ${
                                          selected ? 'font-medium' : 'font-normal'
                                      }`}
                                  >
                                    {option}
                                  </span>
                                                                </div>
                                                            )}
                                                        </Listbox.Option>
                                                    ))}
                                                </Listbox.Options>
                                            </Transition>
                                        </>
                                    )}
                                </Listbox>
                            </div>
                            <div className='flex'>
                                <div className='w-[360px] ml-10 z-20 flex flex-col'>
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
                            <div className='flex mr-2 justify-end'>
                                <div className='w-[300px] ml-28'>
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

                        <div className='mx-12 text-start flex text-3xl font-light font-primary'>
                            <table className='table-auto rounded-tl-2xl text-start drop-shadow-xl'>
                                <thead>
                                <tr className='rounded-tl-2xl h-24 font-bold bg-orange-500 text-white'>
                                    <th className='border w-[110px] px-6 font-bold text-start rounded-tl-3xl'>
                                        STT
                                    </th>
                                    <th className='border px-6 w-[250px] font-bold text-start'>
                                        Tên khách hàng
                                    </th>
                                    <th className='border px-6 w-[250px] font-bold text-start'>
                                        Tên dịch vụ
                                    </th>
                                    <th className='border px-6 font-bold text-start'>
                                        Thời gian cấp
                                    </th>
                                    <th className='border px-6 font-bold text-start'>
                                        Hạn sử dụng
                                    </th>
                                    <th className='border px-6 w-[160px] font-bold text-start'>
                                        Trạng thái
                                    </th>

                                    <th className='border px-6 font-bold text-start'>
                                        Nguồn cấp
                                    </th>
                                    <th className='border px-6 w-[100px] font-bold text-start rounded-tr-3xl'></th>
                                </tr>
                                </thead>
                                <tbody>
                                {displayNumbers}
                                </tbody>
                            </table>
                            <button
                                onClick={showAddNumberComponent}
                                className='flex flex-col transition-colors duration-300 group cursor-pointer hover:bg-orange-alta absolute right-0 justify-center items-center w-40 h-48 bg-orange-100 rounded-tl-2xl rounded-bl-2xl drop-shadow-xl shadow-xl'
                            >
                                <div className='w-11 h-11 absolute-center bg-orange-500 group-hover:bg-orange-100 rounded-xl hover:text-white'>
                                    <PlusIcon className='w-8 h-8 stroke-white group-hover:stroke-orange-alta stroke-2' />
                                </div>
                                <div className='text-center text-orange-500 group-hover:text-orange-100 mt-4 w-36'>
                                    Cấp
                                </div>
                                <div className='text-center text-orange-500 group-hover:text-orange-100 w-36'>
                                    số mới
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

            )}
            {showAddNumber && <AddNumber />}
            {showDetailNumber && <NumberDetail
                numberData={numberData}
                numberId={numberId}
            />}
        </>
    );
};

export default NumberContainer;
