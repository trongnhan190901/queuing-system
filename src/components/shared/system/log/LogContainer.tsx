import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { firestore } from 'server/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Account } from 'types';
import Loading from 'components/loading/Loading';
import { dateFormat3 } from '../../../../helper/dateFormat';
import ReactPaginate from 'react-paginate';

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
                                {dateFormat3(account.updateTime)}
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
                        <div className='h-32 mx-12 flex items-center'>
                            <div className='text-gray-500 text-3xl font-bold font-primary'>
                                Cài đặt hệ thống
                            </div>
                            <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                            <div className='text-orange-500 text-3xl font-bold font-primary'>
                                Nhật ký hoạt động
                            </div>
                        </div>

                        <div className='flex ml-12 mr-64 mb-12'>
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
