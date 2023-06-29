import React, { useEffect, useRef, useState } from 'react';
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { firestore } from 'server/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Account } from 'types';
import Loading from 'components/loading/Loading';
import ReactPaginate from 'react-paginate';
import { dateFormat3 } from '../../../../helper/dateFormat';
import { Listbox, Transition } from '@headlessui/react';
import Calendar from 'react-calendar';

const LogContainer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [accounts, setAccounts] = useState<Account[]>([]);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                setIsLoading(true);
                const devicesRef = collection(firestore, 'users');
                const querySnapshot = await getDocs(devicesRef);
                const accountsData = querySnapshot.docs.map((doc) => {
                    const accountData = doc.data() as Account;
                    const accountId = doc.id;
                    return { ...accountData, id: accountId };
                });
                setAccounts(accountsData);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log('Error fetching devices:', error);
            }
        };

        fetchAccounts();
    }, []);

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

    const [searchTerm, setSearchTerm] = useState('');

    const [pageNumber, setPageNumber] = useState(0);

    const numbersPerPage = 9;
    const pagesVisited = pageNumber * numbersPerPage;

    const pageCount = Math.ceil(accounts.length / numbersPerPage);

    const changePage = ({ selected }: any) => {
        setPageNumber(selected);
    };

    const displayAccounts = accounts
        .filter((account) => {
            // Lọc theo từ khóa tìm kiếm
            if (!searchTerm) {
                return true;
            }
            // Lọc dựa trên thuộc tính
            return (
                account.username.toLowerCase().includes(searchTerm) ||
                account.logs.toLowerCase().includes(searchTerm) ||
                account.username.includes(searchTerm) ||
                account.logs.includes(searchTerm)

            );
        })
        .filter((account) => {
            // Lọc theo startDate và endDate
            if (selectedStartDate && selectedEndDate) {
                // @ts-ignore
                const accountCreatedAt = account.updateTime.toDate(); // Chuyển đổi timestamp thành đối tượng Date
                return accountCreatedAt >= selectedStartDate && accountCreatedAt <= selectedEndDate;
            }
            return true;
        })
        .slice(pagesVisited, pagesVisited + numbersPerPage)
        .map((account, index, array) => {
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
                    <React.Fragment key={account.id}>
                        <tr className={`rounded-tl-2xl h-24 ${trClasses}`}>
                            <th
                                className={`px-6 w-[350px] font-thin text-start ${roundedLeft}`}
                            >
                                {account.username}
                            </th>
                            <th className='border border-orange-200 w-[250px] px-6 font-thin text-start '>
                                {/*// @ts-ignore*/}
                                {dateFormat3(account.updateTime.toDate().toISOString())}
                            </th>
                            <th className='border  border-orange-200 w-[250px] px-6 font-thin text-start '>
                                192.168.1.1
                            </th>
                            <th

                                className={`w-[500px] px-6 font-thin text-start  ${roundedRight}`}
                            >
                                {account.logs}
                            </th>
                        </tr>
                    </React.Fragment>
                </>
            );
        });

    return (
        <>
            <div className='w-full h-screen bg-gray-200'>
                {isLoading && <Loading />}

                <>
                    <div className='flex full-size flex-col'>
                        <div className='h-32 mx-12 flex items-center mt-8'>
                            <div className='text-gray-500 text-3xl font-bold font-primary'>
                                Cài đặt hệ thống
                            </div>
                            <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                            <div className='text-orange-500 text-3xl font-bold font-primary'>
                                Nhật ký hoạt động
                            </div>
                        </div>

                        <div className='flex ml-12 mr-64 mt-12 mb-12'>
                            <div className='flex'>
                                <div className='w-[360px] z-20 flex flex-col'>
                                    <div className='text-3xl'>Chọn thời gian</div>
                                    <div className='flex space-x-4'>
                                        <div className='flex'>
                                            <div className='flex flex-col'>
                                                <Listbox>
                                                    {({ open }) => (
                                                        <>
                                                            <Listbox.Button
                                                                className={`relative mt-4 flex rounded-xl w-[180px] bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange-100 focus:border-orange-100 sm:text-sm ${
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
                                                                className={`relative mt-4 flex rounded-xl w-[180px] bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange-100 focus:border-orange-100 sm:text-sm ${
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
                                <tr className='h-24 font-bold bg-orange-500 text-white'>
                                    <th className='border w-[350px] px-6 font-bold text-start rounded-tl-3xl'>
                                        Tên đăng nhập
                                    </th>
                                    <th className='border w-[250px] px-6 font-bold text-start'>
                                        Thơi gian tác động
                                    </th>
                                    <th className='border w-[250px] px-6 font-bold text-start'>
                                        IP thực hiện
                                    </th>
                                    <th className='border px-6 w-[500px] font-bold text-start rounded-tr-3xl'>
                                        Thao tác thực hiện
                                    </th>
                                </tr>
                                </thead>
                                <tbody>{displayAccounts}</tbody>
                            </table>
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
                </>

            </div>
        </>
    );
};

export default LogContainer;
