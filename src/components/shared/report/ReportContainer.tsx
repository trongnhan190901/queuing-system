/* eslint-disable jsx-a11y/anchor-is-valid */
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { FolderArrowDownIcon } from '@heroicons/react/24/solid';
import { Number } from '../../../types';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { firestore } from '../../../server/firebase';
import { dateFormat2 } from '../../../helper/dateFormat';

const ReportContainer = () => {
    const [isLoading, setIsLoading] = useState(false);


    const [isParentVisible, setIsParentVisible] = useState(true);
    const [showAddNumber, setShowAddNumber] = useState(false);
    const [showDetailNumber, setShowDetailNumber] = useState(false);

    const showAddNumberComponent = () => {
        setIsParentVisible(!isParentVisible);
        setShowAddNumber(!showAddNumber);
    };

    const [numbers, setNumbers] = useState<Number[]>([]);

    useEffect(() => {
        const fetchNumbers = async () => {
            try {
                setIsLoading(true);
                const numbersRef = collection(firestore, 'numbers');
                const querySnapshot = await getDocs(numbersRef);
                const numbersData = querySnapshot.docs.map((doc) => {
                    const numberData = doc.data() as Number;
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

    const [numberData, setNumberData] = useState<Number | null>(null);
    const [numberId, setNumberId] = useState('');
    const showDetailNumberComponent = async (id: string) => {
        try {
            const numberRef = doc(firestore, 'numbers', id);
            const numberSnapshot = await getDoc(numberRef);
            const numberData = numberSnapshot.data() as Number | null;

            setNumberData(numberData);
            setNumberId(id);
            console.log(numberData);
            setIsParentVisible(!isParentVisible);
            setShowDetailNumber(!showDetailNumber);
        } catch (error) {
            console.log('Error fetching device data:', error);
        }
    };

    const [pageNumber, setPageNumber] = useState(0);

    const numbersPerPage = 9;
    const pagesVisited = pageNumber * numbersPerPage;

    const [searchTerm, setSearchTerm] = useState('');

    const displayNumbers = numbers
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
                            <th className='border border-orange-200 w-[250px] pl-6 pr-16 font-thin text-start '>
                                {number.serviceSelect}
                            </th>
                            <th className='border border-orange-200 px-6 font-thin text-start '>
                                {dateFormat2(number.createdAt)}
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
            <div className='w-full h-screen bg-gray-200'>
                <div className='h-32 mx-12 flex items-center mt-8'>
                    <div className='text-gray-500 text-3xl w-36 font-bold font-primary'>
                        Báo cáo
                    </div>
                    <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                    <div className='text-orange-500 text-3xl w-96 font-bold font-primary'>
                        Lập báo cáo
                    </div>
                </div>

                <div className='flex my-12 mr-72'>
                    <div className='w-[400px] ml-10 z-20 flex flex-col'>
                        <div className='text-3xl'>Chọn thời gian</div>
                        <div className='flex space-x-4'>
                            {' '}
                            {/*<Listbox*/}
                            {/*    value={selectedOption}*/}
                            {/*    onChange={setSelectedOption}*/}
                            {/*>*/}
                            {/*    {({ open }) => (*/}
                            {/*        <>*/}
                            {/*            <Listbox.Button*/}
                            {/*                className='relative mt-4 rounded-xl w-[180px] bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange-100 focus:border-orange-100 sm:text-sm'*/}
                            {/*                onClick={() => setIsOpen(!isOpen)}*/}
                            {/*            >*/}
                            {/*                <span className='block text-3xl truncate'>*/}
                            {/*                    {selectedOption}*/}
                            {/*                </span>*/}
                            {/*                <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>*/}
                            {/*                    <ChevronDownIcon className='w-8 h-8 stroke-2 stroke-orange-500' />*/}
                            {/*                </span>*/}
                            {/*            </Listbox.Button>*/}
                            {/*            <Transition*/}
                            {/*                show={open}*/}
                            {/*                enter='transition ease-out duration-100'*/}
                            {/*                enterFrom='transform opacity-0 scale-95'*/}
                            {/*                enterTo='transform opacity-100 scale-100'*/}
                            {/*                leave='transition ease-in duration-75'*/}
                            {/*                leaveFrom='transform opacity-100 scale-100'*/}
                            {/*                leaveTo='transform opacity-0 scale-95'*/}
                            {/*            >*/}
                            {/*                <Listbox.Options*/}
                            {/*                    static*/}
                            {/*                    className='absolute mt-1 w-[180px] text-3xl bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm'*/}
                            {/*                >*/}
                            {/*                    {options.map((option) => (*/}
                            {/*                        <Listbox.Option*/}
                            {/*                            key={option}*/}
                            {/*                            value={option}*/}
                            {/*                        >*/}
                            {/*                            {({*/}
                            {/*                                  active,*/}
                            {/*                                  selected,*/}
                            {/*                              }) => (*/}
                            {/*                                <div*/}
                            {/*                                    className={`cursor-default text-3xl select-none relative py-3 pl-3 pr-9 ${*/}
                            {/*                                        active*/}
                            {/*                                            ? 'bg-orange-100 text-black'*/}
                            {/*                                            : ''*/}
                            {/*                                    }`}*/}
                            {/*                                >*/}
                            {/*                                    <span*/}
                            {/*                                        className={`block text-2xl truncate ${*/}
                            {/*                                            selected*/}
                            {/*                                                ? 'font-medium'*/}
                            {/*                                                : 'font-normal'*/}
                            {/*                                        }`}*/}
                            {/*                                    >*/}
                            {/*                                        {option}*/}
                            {/*                                    </span>*/}
                            {/*                                </div>*/}
                            {/*                            )}*/}
                            {/*                        </Listbox.Option>*/}
                            {/*                    ))}*/}
                            {/*                </Listbox.Options>*/}
                            {/*            </Transition>*/}
                            {/*        </>*/}
                            {/*    )}*/}
                            {/*</Listbox>*/}
                            <div className='absolute-center h-full'>
                                <ChevronRightIcon className='h-8 w-8 mt-4 stroke-gray-500' />
                            </div>
                            {/*<Listbox*/}
                            {/*    value={selectedOption}*/}
                            {/*    onChange={setSelectedOption}*/}
                            {/*>*/}
                            {/*    {({ open }) => (*/}
                            {/*        <>*/}
                            {/*            <Listbox.Button*/}
                            {/*                className='relative mt-4 rounded-xl w-[180px] bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange-100 focus:border-orange-100 sm:text-sm'*/}
                            {/*                onClick={() => setIsOpen(!isOpen)}*/}
                            {/*            >*/}
                            {/*                <span className='block text-3xl truncate'>*/}
                            {/*                    {selectedOption}*/}
                            {/*                </span>*/}
                            {/*                <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>*/}
                            {/*                    <ChevronDownIcon className='w-8 h-8 stroke-2 stroke-orange-500' />*/}
                            {/*                </span>*/}
                            {/*            </Listbox.Button>*/}
                            {/*            <Transition*/}
                            {/*                show={open}*/}
                            {/*                enter='transition ease-out duration-100'*/}
                            {/*                enterFrom='transform opacity-0 scale-95'*/}
                            {/*                enterTo='transform opacity-100 scale-100'*/}
                            {/*                leave='transition ease-in duration-75'*/}
                            {/*                leaveFrom='transform opacity-100 scale-100'*/}
                            {/*                leaveTo='transform opacity-0 scale-95'*/}
                            {/*            >*/}
                            {/*                <Listbox.Options*/}
                            {/*                    static*/}
                            {/*                    className='absolute mt-1 w-[180px] text-3xl bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm'*/}
                            {/*                >*/}
                            {/*                    {options.map((option) => (*/}
                            {/*                        <Listbox.Option*/}
                            {/*                            key={option}*/}
                            {/*                            value={option}*/}
                            {/*                        >*/}
                            {/*                            {({*/}
                            {/*                                  active,*/}
                            {/*                                  selected,*/}
                            {/*                              }) => (*/}
                            {/*                                <div*/}
                            {/*                                    className={`cursor-default text-3xl select-none relative py-3 pl-3 pr-9 ${*/}
                            {/*                                        active*/}
                            {/*                                            ? 'bg-orange-100 text-black'*/}
                            {/*                                            : ''*/}
                            {/*                                    }`}*/}
                            {/*                                >*/}
                            {/*                                    <span*/}
                            {/*                                        className={`block text-2xl truncate ${*/}
                            {/*                                            selected*/}
                            {/*                                                ? 'font-medium'*/}
                            {/*                                                : 'font-normal'*/}
                            {/*                                        }`}*/}
                            {/*                                    >*/}
                            {/*                                        {option}*/}
                            {/*                                    </span>*/}
                            {/*                                </div>*/}
                            {/*                            )}*/}
                            {/*                        </Listbox.Option>*/}
                            {/*                    ))}*/}
                            {/*                </Listbox.Options>*/}
                            {/*            </Transition>*/}
                            {/*        </>*/}
                            {/*    )}*/}
                            {/*</Listbox>*/}
                        </div>
                    </div>
                </div>

                <div className='mx-12 text-start flex text-3xl font-light font-primary'>
                    <table className='table-auto rounded-tl-2xl text-start drop-shadow-xl'>
                        <thead>
                        <tr className='rounded-tl-2xl h-24 font-bold bg-orange-500 text-white'>
                            <th className='border relative px-6 w-[280px] font-bold text-start rounded-tl-3xl'>
                                Số thứ tự
                                <span className='absolute inset-y-0 right-4 flex items-center pr-2 pointer-events-none'>
                                        <svg
                                            className='h-10 w-10 text-white'
                                            fill='none'
                                            viewBox='0 0 20 20'
                                            stroke='currentColor'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M7 7l3-3 3 3m0 6l-3 3-3-3'
                                            />
                                        </svg>
                                    </span>
                            </th>
                            <th className='border relative w-[280px] px-6 font-bold text-start'>
                                Tên dịch vụ
                                <span className='absolute inset-y-0 right-4 flex items-center pr-2 pointer-events-none'>
                                        <svg
                                            className='h-10 w-10 text-white'
                                            fill='none'
                                            viewBox='0 0 20 20'
                                            stroke='currentColor'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M7 7l3-3 3 3m0 6l-3 3-3-3'
                                            />
                                        </svg>
                                    </span>
                            </th>
                            <th className='border px-6 relative w-[280px] font-bold text-start'>
                                Thời gian cấp
                                <span className='absolute inset-y-0 right-4 flex items-center pr-2 pointer-events-none'>
                                        <svg
                                            className='h-10 w-10 text-white'
                                            fill='none'
                                            viewBox='0 0 20 20'
                                            stroke='currentColor'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M7 7l3-3 3 3m0 6l-3 3-3-3'
                                            />
                                        </svg>
                                    </span>
                            </th>
                            <th className='border relative px-6w-[280px] font-bold text-start'>
                                Tình trạng
                                <span className='absolute inset-y-0 right-4 flex items-center pr-2 pointer-events-none'>
                                        <svg
                                            className='h-10 w-10 text-white'
                                            fill='none'
                                            viewBox='0 0 20 20'
                                            stroke='currentColor'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M7 7l3-3 3 3m0 6l-3 3-3-3'
                                            />
                                        </svg>
                                    </span>
                            </th>

                            <th className='border relative rounded-tr-3xl px-6 w-[280px] font-bold text-start'>
                                Nguồn cấp
                                <span className='absolute inset-y-0 right-4 flex items-center pr-2 pointer-events-none'>
                                        <svg
                                            className='h-10 w-10 text-white'
                                            fill='none'
                                            viewBox='0 0 20 20'
                                            stroke='currentColor'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M7 7l3-3 3 3m0 6l-3 3-3-3'
                                            />
                                        </svg>
                                    </span>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {displayNumbers}
                        </tbody>
                    </table>
                    <div className='flex flex-col absolute right-0 justify-center items-center w-40 h-48 bg-orange-100 rounded-tl-2xl rounded-bl-2xl drop-shadow-xl shadow-xl'>
                        <FolderArrowDownIcon className='w-14 h-14  fill-orange-500 stroke-2' />

                        <div className='text-center text-orange-500 mt-4 w-36'>
                            Tải về
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReportContainer;
