import {
    CalendarDaysIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    FolderArrowDownIcon,
} from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from 'server/firebase';
import { dateFormat2 } from 'helper/dateFormat';
import ReactPaginate from 'react-paginate';
import { Listbox, Transition } from '@headlessui/react';
import Loading from 'components/loading/Loading';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { NumberType } from '../../../types';
import Navbar from '../../partials/Navbar';
import User from '../../partials/User';

const ReportContainer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const status = ['Tất cả', 'Đang chờ', 'Đã sử dụng', 'Bỏ qua'];
    const [selectedStatus, setSelectedStatus] = useState(status[0]);
    const source = ['Tất cả', 'Kiosk', 'Hệ thống'];
    const [selectedSource, setSelectedSource] = useState(source[0]);
    const numberArr = [
        'Tất cả',
        '2010001',
        '2020001',
        '2030001',
        '2040001',
        '2050001',
        '2060001',
        '2070001',
        '2080001',
        '2090001',
    ];
    const [selectedNumber, setSelectedNumber] = useState(numberArr[0]);
    const [uniqueTimes, setUniqueTimes] = useState(['Tất cả']);
    const [selectedTime, setSelectedTime] = useState('Tất cả');

    const [numberOpen, setNumberOpen] = useState(false);
    const [serviceOpen, setServiceOpen] = useState(false);
    const [timeOpen, setTimeOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [sourceOpen, setSourceOpen] = useState(false);

    const [numbers, setNumbers] = useState<NumberType[]>([]);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    );
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
        new Date(),
    );
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
        if (
            calendarRef.current &&
            !calendarRef.current.contains(event.target as Node)
        ) {
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
                const filteredNumbersData = numbersData.filter(
                    (number, index) => {
                        if (
                            number.number === 'counter' &&
                            index === numbersData.length - 1
                        ) {
                            return true; // Giữ lại số cuối cùng nếu là "counter"
                        }
                        return number.number !== 'counter';
                    },
                );

                filteredNumbersData.sort((a, b) =>
                    a.number.toString().localeCompare(b.number.toString()),
                ); // Sắp xếp mảng theo trường "number"

                setNumbers(filteredNumbersData);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log('Error fetching numbers:', error);
            }
        };

        fetchNumbers();
    }, []);

    useEffect(() => {
        const newUniqueTimes: any[] = [];
        numbers.forEach((number) => {
            if (
                newUniqueTimes.indexOf(
                    // @ts-ignore
                    dateFormat2(number.createdAt.toDate().toISOString()),
                ) === -1
            ) {
                newUniqueTimes.push(
                    // @ts-ignore
                    dateFormat2(number.createdAt.toDate().toISOString()),
                );
            }
        });

        newUniqueTimes.unshift('Tất cả');
        // @ts-ignore
        setUniqueTimes(newUniqueTimes);
    }, [numbers]);

    const services = [
        'Tất cả',
        'Khám tim mạch',
        'Khám sản - Phụ khoa',
        'Khám răng hàm mặt',
        'Khám tai mũi họng',
        'Khám hô hấp',
        'Khám tổng quát',
    ];
    const [selectedServices, setSelectedServices] = useState<string[]>([
        ...services,
    ]);

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
                updatedSelections = clonedSelectedServices.filter(
                    (selectedOption) => selectedOption !== option,
                );
            } else {
                updatedSelections = [...clonedSelectedServices, option];
                if (
                    updatedSelections.length === services.length - 1 &&
                    !updatedSelections.includes('Tất cả')
                ) {
                    updatedSelections = ['Tất cả', ...updatedSelections];
                }
            }

            if (
                updatedSelections.includes('Tất cả') &&
                updatedSelections.length !== services.length
            ) {
                updatedSelections = updatedSelections.filter(
                    (selectedOption) => selectedOption !== 'Tất cả',
                );
            }
        }

        setSelectedServices(updatedSelections);
    };

    const [pageNumber, setPageNumber] = useState(0);

    const numbersPerPage = 9;
    const pagesVisited = pageNumber * numbersPerPage;

    const displayNumbers = numbers
        .filter((number) => {
            // Lọc theo sourceSelect
            if (selectedSource === 'Tất cả') {
                return true;
            }
            return number.source === selectedSource;
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
            // Lọc theo selectedNumber
            if (selectedNumber === 'Tất cả') {
                return true;
            }
            return (
                number.number.substring(0, 3) === selectedNumber.substring(0, 3)
            );
        })
        .filter((number) => {
            // Lọc theo selectedTime
            if (selectedTime === 'Tất cả') {
                return true;
            }
            return dateFormat2(number.createdAt) === selectedTime;
        })
        .filter((number) => {
            // Lọc theo selectedServices
            if (selectedServices.includes('Tất cả')) {
                return true;
            }
            return selectedServices.includes(number.serviceSelect);
        })
        .filter((number) => {
            // Lọc theo startDate và endDate
            if (selectedStartDate && selectedEndDate) {
                // @ts-ignore
                const numberCreatedAt = number.createdAt.toDate(); // Chuyển đổi timestamp thành đối tượng Date
                return (
                    numberCreatedAt >= selectedStartDate &&
                    numberCreatedAt <= selectedEndDate
                );
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
                                className={`px-6 w-[250px] font-thin text-start ${roundedLeft}`}
                            >
                                {number.number}
                            </th>
                            <th className="border border-orange-200 w-[250px] pl-6 pr-16 font-thin text-start ">
                                {number.serviceSelect}
                            </th>
                            <th className="border border-orange-200 px-6 font-thin text-start ">
                                {dateFormat2(
                                    // @ts-ignore
                                    number?.createdAt.toDate().toISOString(),
                                )}
                            </th>
                            <th className="border border-orange-200 w-[160px] px-6 font-thin text-start ">
                                {number.status === 'WAITING' ? (
                                    <div className="flex">
                                        <div className="w-3 h-3 mt-3 mr-3 rounded-full bg-blue-500"></div>
                                        <span>Đang chờ</span>
                                    </div>
                                ) : number.status === 'USED' ? (
                                    <div className="flex">
                                        <div className="w-3 h-3 mt-3 mr-3 rounded-full bg-gray-500"></div>
                                        <span>Đã sử dụng</span>
                                    </div>
                                ) : (
                                    <div className="flex">
                                        <div className="w-3 h-3 mt-3 mr-3 rounded-full bg-red-500"></div>
                                        <span>Bỏ qua</span>
                                    </div>
                                )}
                            </th>
                            <th
                                className={` w-[108px] px-6 font-thin text-start ${roundedRight}`}
                            >
                                {number.source}
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
            <div className="full-size flex relative">
                <Navbar />
                <div className="absolute top-2 z-30 right-2">
                    <User />
                </div>
                <div className="w-full h-screen bg-gray-200">
                    <div className="h-32 mx-12 flex items-center mt-8">
                        <div className="text-gray-500 text-3xl font-bold font-primary">
                            Báo cáo
                        </div>
                        <ChevronRightIcon className="h-8 w-8 mx-6 stroke-gray-500" />
                        <div className="text-orange-500 text-3xl font-bold font-primary">
                            Lập báo cáo
                        </div>
                    </div>

                    <div className="flex my-12 mr-72">
                        <div className="w-[400px] ml-10 z-20 flex flex-col">
                            <div className="text-3xl">Chọn thời gian</div>
                            <div className="flex space-x-4">
                                <div className="flex">
                                    <div className="flex flex-col">
                                        <Listbox>
                                            {({ open }) => (
                                                <>
                                                    <Listbox.Button
                                                        className={`relative mt-4 flex rounded-xl w-[180px] bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-100 focus:border-orange-100 sm:text-sm ${
                                                            open
                                                                ? 'ring-2 ring-orange-100'
                                                                : ''
                                                        }`}
                                                        onClick={
                                                            handleToggleCalendar
                                                        }
                                                    >
                                                        <CalendarDaysIcon className="w-8 h-8 stroke-orange-alta mr-4 stroke-2" />
                                                        <span className="block text-3xl text-gray-600 truncate">
                                                            {selectedStartDate
                                                                ? selectedStartDate.toLocaleDateString(
                                                                      'en-GB',
                                                                  )
                                                                : new Date().toLocaleDateString(
                                                                      'en-GB',
                                                                  )}
                                                        </span>
                                                    </Listbox.Button>
                                                    <Transition
                                                        show={isOpen}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <div
                                                            className="absolute mt-1 w-[400px] bg-white border border-gray-300 rounded-xl shadow-lg h-[385px] overflow-auto focus:outline-none sm:text-sm"
                                                            ref={calendarRef}
                                                        >
                                                            <Calendar
                                                                // @ts-ignore
                                                                onChange={(
                                                                    date:
                                                                        | Date
                                                                        | Date[],
                                                                ) =>
                                                                    handleDateChange(
                                                                        date,
                                                                    )
                                                                }
                                                                value={
                                                                    selectedStartDate &&
                                                                    selectedEndDate
                                                                        ? [
                                                                              selectedStartDate,
                                                                              selectedEndDate,
                                                                          ]
                                                                        : new Date()
                                                                }
                                                                selectRange={
                                                                    true
                                                                }
                                                                className="p-3"
                                                            />
                                                        </div>
                                                    </Transition>
                                                </>
                                            )}
                                        </Listbox>
                                    </div>
                                    <div className="absolute-center mx-2 h-full">
                                        <ChevronRightIcon className="h-8 w-8 mt-4 stroke-gray-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <Listbox>
                                            {({ open }) => (
                                                <>
                                                    <Listbox.Button
                                                        className={`relative mt-4 flex rounded-xl w-[180px] bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-100 focus:border-orange-100 sm:text-sm ${
                                                            open
                                                                ? 'ring-2 ring-orange-100'
                                                                : ''
                                                        }`}
                                                        onClick={
                                                            handleToggleCalendar
                                                        }
                                                    >
                                                        <CalendarDaysIcon className="w-8 h-8 stroke-orange-alta mr-4 stroke-2" />
                                                        <span className="block text-3xl text-gray-600 truncate">
                                                            {selectedEndDate instanceof
                                                            Date
                                                                ? selectedEndDate.toLocaleDateString(
                                                                      'en-GB',
                                                                  )
                                                                : new Date().toLocaleDateString(
                                                                      'en-GB',
                                                                  )}
                                                        </span>
                                                    </Listbox.Button>
                                                    <Transition
                                                        show={isOpen}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    ></Transition>
                                                </>
                                            )}
                                        </Listbox>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mx-12 text-start flex text-3xl font-light font-primary">
                        <table className="table-auto rounded-tl-2xl text-start drop-shadow-xl">
                            <thead>
                                <tr className="rounded-tl-2xl h-24 font-bold bg-orange-500 text-white">
                                    <th className="border relative rounded-tl-3xl">
                                        <Listbox
                                            value={selectedNumber}
                                            onChange={setSelectedNumber}
                                        >
                                            {({ open }) => (
                                                <>
                                                    <Listbox.Button
                                                        className="relative "
                                                        onClick={() =>
                                                            setNumberOpen(
                                                                !numberOpen,
                                                            )
                                                        }
                                                    >
                                                        <div className="px-6 h-24 flex items-center w-[250px] font-bold text-start">
                                                            Số thứ tự
                                                            <span className="absolute inset-y-0 right-4 flex items-center pr-2 pointer-events-none">
                                                                <svg
                                                                    className="h-10 w-10 text-white"
                                                                    fill="none"
                                                                    viewBox="0 0 20 20"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                                                    />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                    </Listbox.Button>
                                                    <Transition
                                                        show={open}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Listbox.Options
                                                            static
                                                            className="absolute w-[250px] text-start bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm"
                                                        >
                                                            {numberArr.map(
                                                                (option) => (
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
                                                                            selected,
                                                                        }) => (
                                                                            <div
                                                                                className={`cursor-pointer text-black text-[17px] select-none relative py-4 pl-3 pr-9 ${
                                                                                    active
                                                                                        ? 'bg-orange-100 '
                                                                                        : ''
                                                                                }`}
                                                                            >
                                                                                <span
                                                                                    className={`block text-[18px] py-2.5 truncate ${
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
                                    </th>
                                    <th className="border relative">
                                        <Listbox value={selectedServices}>
                                            {({ open }) => (
                                                <>
                                                    <Listbox.Button
                                                        className="relative "
                                                        onClick={() =>
                                                            setServiceOpen(
                                                                !serviceOpen,
                                                            )
                                                        }
                                                    >
                                                        <div className="px-6 h-24 flex items-center w-[280px] font-bold text-start">
                                                            Tên dịch vụ
                                                            <span className="absolute inset-y-0 right-4 flex items-center pr-2 pointer-events-none">
                                                                <svg
                                                                    className="h-10 w-10 text-white"
                                                                    fill="none"
                                                                    viewBox="0 0 20 20"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                                                    />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                    </Listbox.Button>
                                                    <Transition
                                                        show={open}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Listbox.Options
                                                            static
                                                            className="absolute w-[280px] text-start bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm"
                                                        >
                                                            <Listbox.Option
                                                                value={'Tất cả'}
                                                            >
                                                                {({
                                                                    active,
                                                                    selected,
                                                                }) => (
                                                                    <div
                                                                        onClick={() =>
                                                                            handleServiceOptionChange(
                                                                                'Tất cả',
                                                                            )
                                                                        }
                                                                        className={`cursor-pointer w-full text-black text-[17px] select-none relative py-4 pl-3 ${
                                                                            active
                                                                                ? 'bg-orange-100'
                                                                                : ''
                                                                        }`}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-checkbox mr-2 appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500 absolute right-3 top-1/2 transform -translate-y-1/2"
                                                                            checked={selectedServices.includes(
                                                                                'Tất cả',
                                                                            )}
                                                                        />
                                                                        <span
                                                                            className={`block text-[18px] py-2.5 truncate ${
                                                                                selected
                                                                                    ? 'font-medium'
                                                                                    : 'font-normal'
                                                                            }`}
                                                                        >
                                                                            Tất
                                                                            cả
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </Listbox.Option>
                                                            <Listbox.Option
                                                                value={
                                                                    'Khám tim mạch'
                                                                }
                                                            >
                                                                {({
                                                                    active,
                                                                    selected,
                                                                }) => (
                                                                    <div
                                                                        onClick={() =>
                                                                            handleServiceOptionChange(
                                                                                'Khám tim mạch',
                                                                            )
                                                                        }
                                                                        className={`cursor-pointer w-full flex text-black text-[17px] select-none relative py-4 pl-3 pr-9 ${
                                                                            active
                                                                                ? 'bg-orange-100 '
                                                                                : ''
                                                                        }`}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-checkbox mr-2 appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500 absolute right-3 top-1/2 transform -translate-y-1/2"
                                                                            checked={selectedServices.includes(
                                                                                'Khám tim mạch',
                                                                            )}
                                                                        />
                                                                        <span
                                                                            className={`block text-[18px] py-2.5 truncate ${
                                                                                selected
                                                                                    ? 'font-medium'
                                                                                    : 'font-normal'
                                                                            }`}
                                                                        >
                                                                            Khám
                                                                            tim
                                                                            mạch
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </Listbox.Option>
                                                            <Listbox.Option
                                                                value={
                                                                    'Khám sản - Phụ khoa'
                                                                }
                                                            >
                                                                {({
                                                                    active,
                                                                    selected,
                                                                }) => (
                                                                    <div
                                                                        onClick={() =>
                                                                            handleServiceOptionChange(
                                                                                'Khám sản - Phụ khoa',
                                                                            )
                                                                        }
                                                                        className={`cursor-pointer flex text-black text-[17px] select-none relative py-4 pl-3 pr-9 ${
                                                                            active
                                                                                ? 'bg-orange-100 '
                                                                                : ''
                                                                        }`}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-checkbox mr-2 appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500 absolute right-3 top-1/2 transform -translate-y-1/2"
                                                                            checked={selectedServices.includes(
                                                                                'Khám sản - Phụ khoa',
                                                                            )}
                                                                        />
                                                                        <span
                                                                            className={`block text-[18px] py-2.5 truncate ${
                                                                                selected
                                                                                    ? 'font-medium'
                                                                                    : 'font-normal'
                                                                            }`}
                                                                        >
                                                                            Khám
                                                                            sản
                                                                            -
                                                                            Phụ
                                                                            khoa
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </Listbox.Option>
                                                            <Listbox.Option
                                                                value={
                                                                    'Khám răng hàm mặt'
                                                                }
                                                            >
                                                                {({
                                                                    active,
                                                                    selected,
                                                                }) => (
                                                                    <div
                                                                        onClick={() =>
                                                                            handleServiceOptionChange(
                                                                                'Khám răng hàm mặt',
                                                                            )
                                                                        }
                                                                        className={`cursor-pointer flex text-black text-[17px] select-none relative py-4 pl-3 pr-9 ${
                                                                            active
                                                                                ? 'bg-orange-100 '
                                                                                : ''
                                                                        }`}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-checkbox mr-2 appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500 absolute right-3 top-1/2 transform -translate-y-1/2"
                                                                            checked={selectedServices.includes(
                                                                                'Khám răng hàm mặt',
                                                                            )}
                                                                        />
                                                                        <span
                                                                            className={`block text-[18px] py-2.5 truncate ${
                                                                                selected
                                                                                    ? 'font-medium'
                                                                                    : 'font-normal'
                                                                            }`}
                                                                        >
                                                                            Khám
                                                                            răng
                                                                            hàm
                                                                            mặt
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </Listbox.Option>
                                                            <Listbox.Option
                                                                value={
                                                                    'Khám tai mũi họng'
                                                                }
                                                            >
                                                                {({
                                                                    active,
                                                                    selected,
                                                                }) => (
                                                                    <div
                                                                        onClick={() =>
                                                                            handleServiceOptionChange(
                                                                                'Khám tai mũi họng',
                                                                            )
                                                                        }
                                                                        className={`cursor-pointer flex text-black text-[17px] select-none relative py-4 pl-3 pr-9 ${
                                                                            active
                                                                                ? 'bg-orange-100 '
                                                                                : ''
                                                                        }`}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-checkbox mr-2 appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500 absolute right-3 top-1/2 transform -translate-y-1/2"
                                                                            checked={selectedServices.includes(
                                                                                'Khám tai mũi họng',
                                                                            )}
                                                                        />
                                                                        <span
                                                                            className={`block text-[18px] py-2.5 truncate ${
                                                                                selected
                                                                                    ? 'font-medium'
                                                                                    : 'font-normal'
                                                                            }`}
                                                                        >
                                                                            Khám
                                                                            tai
                                                                            mũi
                                                                            họng
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </Listbox.Option>
                                                            <Listbox.Option
                                                                value={
                                                                    'Khám hô hấp'
                                                                }
                                                            >
                                                                {({
                                                                    active,
                                                                    selected,
                                                                }) => (
                                                                    <div
                                                                        onClick={() =>
                                                                            handleServiceOptionChange(
                                                                                'Khám hô hấp',
                                                                            )
                                                                        }
                                                                        className={`cursor-pointer flex text-black text-[17px] select-none relative py-4 pl-3 pr-9 ${
                                                                            active
                                                                                ? 'bg-orange-100 '
                                                                                : ''
                                                                        }`}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-checkbox mr-2 appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500 absolute right-3 top-1/2 transform -translate-y-1/2"
                                                                            checked={selectedServices.includes(
                                                                                'Khám hô hấp',
                                                                            )}
                                                                        />
                                                                        <span
                                                                            className={`block text-[18px] py-2.5 truncate ${
                                                                                selected
                                                                                    ? 'font-medium'
                                                                                    : 'font-normal'
                                                                            }`}
                                                                        >
                                                                            Khám
                                                                            hô
                                                                            hấp
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </Listbox.Option>
                                                            <Listbox.Option
                                                                value={
                                                                    'Khám tổng quát'
                                                                }
                                                            >
                                                                {({
                                                                    active,
                                                                    selected,
                                                                }) => (
                                                                    <div
                                                                        onClick={() =>
                                                                            handleServiceOptionChange(
                                                                                'Khám tổng quát',
                                                                            )
                                                                        }
                                                                        className={`cursor-pointer flex text-black text-[17px] select-none relative py-4 pl-3 pr-9 ${
                                                                            active
                                                                                ? 'bg-orange-100 '
                                                                                : ''
                                                                        }`}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-checkbox mr-2 appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500 absolute right-3 top-1/2 transform -translate-y-1/2"
                                                                            checked={selectedServices.includes(
                                                                                'Khám tổng quát',
                                                                            )}
                                                                        />
                                                                        <span
                                                                            className={`block text-[18px] py-2.5 truncate ${
                                                                                selected
                                                                                    ? 'font-medium'
                                                                                    : 'font-normal'
                                                                            }`}
                                                                        >
                                                                            Khám
                                                                            tổng
                                                                            quát
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </Listbox.Option>
                                                        </Listbox.Options>
                                                    </Transition>
                                                </>
                                            )}
                                        </Listbox>
                                    </th>
                                    <th className="border relative">
                                        <Listbox
                                            value={selectedTime}
                                            onChange={setSelectedTime}
                                        >
                                            {({ open }) => (
                                                <>
                                                    <Listbox.Button
                                                        className="relative "
                                                        onClick={() =>
                                                            setTimeOpen(
                                                                !timeOpen,
                                                            )
                                                        }
                                                    >
                                                        <div className="px-6 h-24 flex items-center w-[280px] font-bold text-start">
                                                            Thời gian cấp
                                                            <span className="absolute inset-y-0 right-4 flex items-center pr-2 pointer-events-none">
                                                                <svg
                                                                    className="h-10 w-10 text-white"
                                                                    fill="none"
                                                                    viewBox="0 0 20 20"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                                                    />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                    </Listbox.Button>
                                                    <Transition
                                                        show={open}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Listbox.Options
                                                            static
                                                            className="absolute w-[280px] text-start bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm"
                                                        >
                                                            {uniqueTimes.map(
                                                                (option) => (
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
                                                                            selected,
                                                                        }) => (
                                                                            <div
                                                                                className={`cursor-pointer text-black text-[17px] select-none relative py-4 pl-3 pr-9 ${
                                                                                    active
                                                                                        ? 'bg-orange-100 '
                                                                                        : ''
                                                                                }`}
                                                                            >
                                                                                <span
                                                                                    className={`block text-[18px] py-2.5 truncate ${
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
                                    </th>
                                    <th className="border relative">
                                        <Listbox
                                            value={selectedStatus}
                                            onChange={setSelectedStatus}
                                        >
                                            {({ open }) => (
                                                <>
                                                    <Listbox.Button
                                                        className="relative "
                                                        onClick={() =>
                                                            setStatusOpen(
                                                                !statusOpen,
                                                            )
                                                        }
                                                    >
                                                        <div className="px-6 h-24 flex items-center w-[280px] font-bold text-start">
                                                            Trạng thái
                                                            <span className="absolute inset-y-0 right-4 flex items-center pr-2 pointer-events-none">
                                                                <svg
                                                                    className="h-10 w-10 text-white"
                                                                    fill="none"
                                                                    viewBox="0 0 20 20"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                                                    />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                    </Listbox.Button>
                                                    <Transition
                                                        show={open}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Listbox.Options
                                                            static
                                                            className="absolute w-[280px] text-start bg-white border border-gray-300 rounded-xl shadow-lg max-h-68 overflow-auto focus:outline-none sm:text-sm"
                                                        >
                                                            {status.map(
                                                                (option) => (
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
                                                                            selected,
                                                                        }) => (
                                                                            <div
                                                                                className={`cursor-pointer text-black text-[17px] select-none relative py-4 pl-3 pr-9 ${
                                                                                    active
                                                                                        ? 'bg-orange-100 '
                                                                                        : ''
                                                                                }`}
                                                                            >
                                                                                <span
                                                                                    className={`block text-[18px] py-2.5 truncate ${
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
                                    </th>
                                    <th className="border relative rounded-tr-3xl">
                                        <Listbox
                                            value={selectedSource}
                                            onChange={setSelectedSource}
                                        >
                                            {({ open }) => (
                                                <>
                                                    <Listbox.Button
                                                        className="relative "
                                                        onClick={() =>
                                                            setSourceOpen(
                                                                !sourceOpen,
                                                            )
                                                        }
                                                    >
                                                        <div className="px-6 h-24 flex items-center w-[280px] font-bold text-start">
                                                            Nguồn cấp
                                                            <span className="absolute inset-y-0 right-4 flex items-center pr-2 pointer-events-none">
                                                                <svg
                                                                    className="h-10 w-10 text-white"
                                                                    fill="none"
                                                                    viewBox="0 0 20 20"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                                                    />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                    </Listbox.Button>
                                                    <Transition
                                                        show={open}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Listbox.Options
                                                            static
                                                            className="absolute w-[280px] text-start bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm"
                                                        >
                                                            {source.map(
                                                                (option) => (
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
                                                                            selected,
                                                                        }) => (
                                                                            <div
                                                                                className={`cursor-pointer text-black text-[17px] select-none relative py-4 pl-3 pr-9 ${
                                                                                    active
                                                                                        ? 'bg-orange-100 '
                                                                                        : ''
                                                                                }`}
                                                                            >
                                                                                <span
                                                                                    className={`block text-[18px] py-2.5 truncate ${
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
                                    </th>
                                </tr>
                            </thead>
                            <tbody>{displayNumbers}</tbody>
                        </table>

                        <button className="flex flex-col transition-colors duration-300 group cursor-pointer hover:bg-orange-alta absolute right-0 justify-center items-center w-40 h-48 bg-orange-100 rounded-tl-2xl rounded-bl-2xl drop-shadow-xl shadow-xl">
                            <div className="w-12 h-12 absolute-center bg-orange-500 group-hover:bg-orange-100 rounded-xl hover:text-white">
                                <FolderArrowDownIcon className="w-9 h-9 fill-orange-alta stroke-white group-hover:stroke-orange-alta group-hover:fill-orange-200 stroke-2" />
                            </div>
                            <div className="text-center text-orange-500 group-hover:text-orange-100 mt-4 w-36">
                                Tải về
                            </div>
                        </button>
                    </div>
                    <div className="flex w-full justify-end">
                        <ReactPaginate
                            previousLabel={
                                <ChevronLeftIcon className="w-10 h-10" />
                            }
                            nextLabel={
                                <ChevronRightIcon className="w-10 h-10" />
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
        </>
    );
};

export default ReportContainer;
