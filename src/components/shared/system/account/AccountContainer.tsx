import React, { useEffect, useState } from 'react';
import {
    ChevronDownIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    MagnifyingGlassIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';
import { firestore } from 'server/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import AddAccount from './AddAccount';
import { Account, Role } from 'types';
import { Listbox, Transition } from '@headlessui/react';
import UpdateAccount from './UpdateAccount';
import Loading from 'components/loading/Loading';

const AccountContainer = () => {
    const [isParentVisible, setIsParentVisible] = useState(true);
    const [showAddAccount, setShowAddAccount] = useState(false);
    const [showUpdateAccount, setShowUpdateAccount] = useState(false);
    const [isOpenRole, setIsOpenRole] = useState(false);

    const showAddAccountComponent = () => {
        setIsParentVisible(!isParentVisible);
        setShowAddAccount(!showAddAccount);
    };

    const [accountData, setAccountData] = useState<Account | null>(null);
    const [accountId, setAccountId] = useState('');

    const showUpdateAccountComponent = async (id: string) => {
        try {
            const accountRef = doc(firestore, 'users', id);
            const accountSnapshot = await getDoc(accountRef);
            const accountData = accountSnapshot.data() as Account | null;

            setAccountData(accountData);
            setAccountId(id);

            setIsParentVisible(!isParentVisible);
            setShowUpdateAccount(!showUpdateAccount);
        } catch (error) {
            console.log('Error fetching device data:', error);
        }
    };

    const [roles, setRoles] = useState<Role[]>([]);
    const [roleTypeSelect, setRoleTypeSelect] = useState('Tất cả');

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setIsLoading(true);
                const devicesRef = collection(firestore, 'roles');
                const querySnapshot = await getDocs(devicesRef);
                const rolesData = querySnapshot.docs.map((doc) => {
                    const roleData = doc.data() as Role;
                    const roleId = doc.id;
                    return { ...roleData, id: roleId };
                });

                // Thêm lựa chọn "Tất cả" vào đầu mảng roles
                const allRoleOption = { roleName: 'Tất cả', id: 'all' };
                const updatedRolesData = [allRoleOption, ...rolesData];

                // @ts-ignore
                setRoles(updatedRolesData);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log('Error fetching devices:', error);
            }
        };

        fetchRoles();
    }, []);

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

    const displayAccounts = accounts
        .filter((account) => {
            // Lọc theo vai trò
            if (roleTypeSelect === 'Tất cả') {
                // Hiển thị tất cả các tài khoản
                return true;
            }
            // Lọc dựa trên trường role của account
            return account.role === roleTypeSelect;
        })
        .filter((account) => {
            // Lọc theo từ khóa tìm kiếm
            if (!searchTerm) {
                return true;
            }
            // Lọc dựa trên thuộc tính
            return (
                account.username.toLowerCase().includes(searchTerm) ||
                account.fullName.toLowerCase().includes(searchTerm) ||
                account.phone.toLowerCase().includes(searchTerm) ||
                account.email.toLowerCase().includes(searchTerm) ||
                account.role.toLowerCase().includes(searchTerm) ||
                account.username.includes(searchTerm) ||
                account.fullName.includes(searchTerm) ||
                account.phone.includes(searchTerm) ||
                account.email.includes(searchTerm) ||
                account.role.includes(searchTerm)
            );
        })

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
                                className={`px-6 font-thin text-start ${roundedLeft}`}
                            >
                                {account.username}
                            </th>
                            <th className='border border-orange-200 w-[250px] px-6 font-thin text-start '>
                                {account.fullName}
                            </th>

                            <th className='border border-orange-200 w-[150px] px-6 font-thin text-start '>
                                {account.phone}
                            </th>
                            <th className='border  border-orange-200 w-[250px] px-6 font-thin text-start '>
                                {account.email}
                            </th>
                            <th className='border  border-orange-200 w-[150px] px-6 font-thin text-start '>
                                {account.role}
                            </th>
                            <th className='border  border-orange-200 w-[250px] px-6 font-thin text-start '>
                                {account.active ? (
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
                                    showUpdateAccountComponent(account.id)
                                }
                                className={`w-[108px] px-6 text-blue-500 cursor-pointer underline-offset-4 hover:no-underline underline font-thin text-start  ${roundedRight}`}
                            >
                                Cập nhật
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
                {isParentVisible && (
                    <>
                        <div className='flex full-size flex-col'>
                            <div className='h-32 mx-12 flex items-center'>
                                <div className='text-gray-500 text-3xl font-bold font-primary'>
                                    Cài đặt hệ thống
                                </div>
                                <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                                <div className='text-orange-500 text-3xl font-bold font-primary'>
                                    Quản lý tài khoản
                                </div>
                            </div>

                            <div className='m-12 my-12 text-4xl font-extrabold font-primary text-orange-500'>
                                Danh sách tài khoản
                            </div>
                            <div className='flex ml-12 mr-64 mb-12'>
                                <div className='w-[400px] z-20'>
                                    <div className='text-3xl'>
                                        Tên vai trò
                                    </div>
                                    <Listbox
                                        value={roleTypeSelect}
                                        onChange={(value) => {
                                            setRoleTypeSelect(value);
                                            setIsOpenRole(false);
                                        }}
                                    >
                                        {({ open }) => (
                                            <>
                                                <Listbox.Button
                                                    className={`relative mt-4 rounded-xl w-full bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-200 sm:text-sm ${
                                                        isOpenRole
                                                            ? 'ring-orange-200 ring-2'
                                                            : 'ring-gray-300'
                                                    }`}
                                                    onClick={() =>
                                                        setIsOpenRole(
                                                            !isOpenRole,
                                                        )
                                                    }
                                                >
                                                                 <span className='block text-3xl truncate'>
                                                                    {roleTypeSelect ||
                                                                        'Tất cả'}
                                                                </span>
                                                    <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                                                                    {isOpenRole ? (
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
                                                        className='absolute w-full mt-[1px] text-[16px] bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-scroll z-50 focus:outline-none'
                                                    >
                                                        {roles.map(
                                                            (
                                                                role,
                                                            ) => (
                                                                <Listbox.Option
                                                                    key={
                                                                        role.id
                                                                    }
                                                                    value={
                                                                        role.roleName
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
                                                                                                roleTypeSelect ===
                                                                                                role.roleName
                                                                                                    ? 'font-medium'
                                                                                                    : 'font-normal'
                                                                                            }`}
                                                                                        >
                                                                                            {
                                                                                                role.roleName
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
                                        <th className='border px-6 font-bold text-start rounded-tl-3xl'>
                                            Tên đăng nhập
                                        </th>
                                        <th className='border w-[250px] px-6 font-bold text-start'>
                                            Họ tên
                                        </th>
                                        <th className='border w-[150px] px-6 font-bold text-start'>
                                            Số điện thoại
                                        </th>
                                        <th className='border w-[250px] px-6 font-bold text-start'>
                                            Email
                                        </th>
                                        <th className='border w-[150px] px-6 font-bold text-start'>
                                            Vai trò
                                        </th>
                                        <th className='border w-[250px] px-6 font-bold text-start'>
                                            Trạng thái hoạt động
                                        </th>
                                        <th className='border px-6 w-[108px] font-bold text-start rounded-tr-3xl'></th>
                                    </tr>
                                    </thead>
                                    <tbody>{displayAccounts}</tbody>
                                </table>

                                <button
                                    onClick={showAddAccountComponent}
                                    className='flex flex-col transition-colors duration-300 group cursor-pointer hover:bg-orange-alta absolute right-0 justify-center items-center w-40 h-48 bg-orange-100 rounded-tl-2xl rounded-bl-2xl drop-shadow-xl shadow-xl'
                                >
                                    <div className='w-11 h-11 absolute-center bg-orange-500 group-hover:bg-orange-100 rounded-xl hover:text-white'>
                                        <PlusIcon className='w-8 h-8 stroke-white group-hover:stroke-orange-alta stroke-2' />
                                    </div>
                                    <div className='text-center text-orange-500 group-hover:text-orange-100 mt-4 w-36'>
                                        Thêm
                                    </div>
                                    <div className='text-center text-orange-500 group-hover:text-orange-100 w-36'>
                                        tài khoản
                                    </div>
                                </button>
                            </div>
                        </div>
                    </>
                )}
                {showAddAccount && <AddAccount />}
                {showUpdateAccount && <UpdateAccount
                    accountData={accountData}
                    accountId={accountId}
                />}
            </div>
        </>
    );
};

export default AccountContainer;
