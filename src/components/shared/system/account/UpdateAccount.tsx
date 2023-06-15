import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Listbox, Transition } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { firestore } from 'server/firebase';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    increment,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { Account, Role } from 'types';
import Loading from '../../../loading/Loading';
import AccountContainer from './AccountContainer';

interface UpdateAccountProp {
    accountData: Account | null;
    accountId: string | null;
}

const UpdateAccount = ({ accountData, accountId }: UpdateAccountProp) => {
    const [isOpenRole, setIsOpenRole] = useState(false);
    const [isOpenActive, setIsOpenActive] = useState(false);
    const activeType = ['Hoạt động', 'Ngưng hoạt động'];
    const [activeTypeSelect, setActiveTypeSelect] = useState(accountData?.active ? activeType[0] : activeType[1]);
    const [active, setActive] = useState(true);

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [fullName, setFullName] = useState(accountData?.fullName);
    const [phone, setPhone] = useState(accountData?.phone);
    const [email, setEmail] = useState(accountData?.email);
    const [username, setUsername] = useState(accountData?.username);
    const [password, setPassword] = useState(accountData?.password);

    const [rePassword, setRePassword] = useState(accountData?.password);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const existingUser = false;
    const existingEmail = false;

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleRePasswordVisibility = () => {
        setShowRePassword(!showRePassword);
    };


    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value);
        setPasswordMatch(true);
    };

    const handleRePasswordChange = (e: any) => {
        setRePassword(e.target.value);
        setPasswordMatch(true);
    };

    const [roles, setRoles] = useState<Role[]>([]);
    const [roleTypeSelect, setRoleTypeSelect] = useState(accountData?.role || null);

    useEffect(() => {
        // Khi activeTypeSelect thay đổi, cập nhật giá trị active tương ứng
        if (activeTypeSelect === activeType[0]) {
            setActive(true);
        } else {
            setActive(false);
        }
    }, [activeTypeSelect]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const devicesRef = collection(firestore, 'roles');
                const querySnapshot = await getDocs(devicesRef);
                const rolesData = querySnapshot.docs.map((doc) => {
                    const roleData = doc.data() as Role;
                    const roleId = doc.id;
                    return { ...roleData, id: roleId };
                });
                setRoles(rolesData);
                console.log(rolesData);
            } catch (error) {
                console.log('Error fetching devices:', error);
            }
        };

        fetchRoles();
    }, []);

    //Tạo collection username và email để đảm bảo tính duy nhất
    const uniqueUsernamesRef = collection(firestore, 'uniqueUsernames');
    const uniqueEmailsRef = collection(firestore, 'uniqueEmails');


    const handleFormSubmit = async () => {

        setIsSubmitted(true);

        if (password !== rePassword) {
            setPasswordMatch(false);
            setIsLoading(false);
            return;
        }

        if (
            fullName &&
            phone &&
            email &&
            username &&
            password &&
            rePassword &&
            password === rePassword &&
            activeTypeSelect &&
            roleTypeSelect
        ) {
            try {
                setIsLoading(true);
                // Lấy thông tin tài khoản hiện tại
                // @ts-ignore
                const accountSnapshot = await getDoc(doc(firestore, 'users', accountId));
                const accountData = accountSnapshot.data();

                // Kiểm tra xem username đã tồn tại hay chưa (nếu có thay đổi username)
                if (accountData?.username !== username) {
                    const usernameQuerySnapshot = await getDocs(
                        query(uniqueUsernamesRef, where('name', '==', username)),
                    );
                    const existingUser = !usernameQuerySnapshot.empty;

                    if (existingUser) {
                        toast.error('Tên tài khoản đã tồn tại');
                        setIsLoading(false);
                        return;
                    }

                    // Xóa tên tài khoản cũ trong collection "uniqueUsernames"
                    const oldUsernameQuerySnapshot = await getDocs(
                        query(uniqueUsernamesRef, where('name', '==', accountData?.username)),
                    );
                    oldUsernameQuerySnapshot.forEach(async (doc) => {
                        await deleteDoc(doc.ref);
                    });

                    // Thêm tên tài khoản mới vào collection "uniqueUsernames"
                    await addDoc(uniqueUsernamesRef, { name: username });
                }

                // Kiểm tra xem email đã tồn tại hay chưa (nếu có thay đổi email)
                if (accountData?.email !== email) {
                    const emailQuerySnapshot = await getDocs(
                        query(uniqueEmailsRef, where('email', '==', email)),
                    );
                    const existingEmail = !emailQuerySnapshot.empty;

                    if (existingEmail) {
                        toast.error('Email đã tồn tại');
                        setIsLoading(false);
                        return;
                    }

                    // Xóa email cũ trong collection "uniqueEmails"
                    const oldEmailQuerySnapshot = await getDocs(
                        query(uniqueEmailsRef, where('email', '==', accountData?.email)),
                    );
                    oldEmailQuerySnapshot.forEach(async (doc) => {
                        await deleteDoc(doc.ref);
                    });

                    // Thêm email mới vào collection "uniqueEmails"
                    await addDoc(uniqueEmailsRef, { email });
                }

                // Lấy ID của vai trò đã chọn
                const selectedRole = roles.find((role) => role.roleName === roleTypeSelect);

                if (selectedRole) {
                    const roleId = selectedRole.id;

                    if (roleId) {
                        // Cập nhật roleCount tương ứng với role đã chọn (nếu có thay đổi role)
                        if (accountData?.role !== roleTypeSelect) {
                            const previousRole = roles.find((role) => role.roleName === accountData?.role);

                            if (previousRole) {
                                const previousRoleId = previousRole.id;
                                const previousRoleDocRef = doc(firestore, 'roles', previousRoleId);
                                await updateDoc(previousRoleDocRef, { roleCount: increment(-1) });
                            }

                            const selectedRoleDocRef = doc(firestore, 'roles', roleId);
                            await updateDoc(selectedRoleDocRef, { roleCount: increment(1) });
                        }
                    } else {
                        console.log('Không tìm thấy vai trò');
                        setIsLoading(false);
                        return;
                    }
                }

                // Cập nhật tài khoản
                // @ts-ignore
                const accountDocRef = doc(firestore, 'users', accountId);
                await updateDoc(accountDocRef, {
                    fullName,
                    phone,
                    email,
                    username,
                    password,
                    active: active,
                    role: roleTypeSelect,
                });

                toast.success('Cập nhật tài khoản thành công');
                setIsLoading(false);
                showUpdateAccountComponent();
                console.log('Account updated');
            } catch (error) {
                setIsLoading(false);
                toast.error('Cập nhật tài khoản thất bại');
                console.error('Error updating account: ', error);
            } finally {
                setIsLoading(false);
            }
        }
    };


    const [showUpdateAccount, setShowUpdateAccount] = useState(true);
    const [showContainer, setShowContainer] = useState(false);

    const showUpdateAccountComponent = () => {
        setShowContainer(!showContainer);
        setShowUpdateAccount(!showUpdateAccount);
    };

    return (
        <>
            {isLoading && <Loading />}
            {showUpdateAccount && (
                <>
                    <div className='h-32 mx-12 flex items-center'>
                        <div className='text-gray-500 text-3xl font-bold font-primary'>
                            Cài đặt hệ thống
                        </div>
                        <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                        <div
                            onClick={showUpdateAccountComponent}
                            className='text-gray-500 cursor-pointer hover:text-orange-alta text-3xl font-bold font-primary'
                        >
                            Quản lý tài khoản
                        </div>
                        <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                        <div className='text-orange-alta text-3xl font-bold font-primary'>
                            Cập nhật tài khoản
                        </div>
                    </div>
                    <div className='m-12 my-12 text-4xl font-extrabold font-primary text-orange-alta'>
                        Quản lý tài khoản
                    </div>
                    <div className='w-[95%] ml-14 h-[580px] pb-24 rounded-3xl drop-shadow-xl shadow-xl bg-white'>
                        <div className='mx-14 pt-8 pb-40'>
                            <div className='text-orange-alta text-[22px] font-bold font-primary'>
                                Thông tin tài khoản
                            </div>
                            <div className='mt-12 full-size'>
                                <div className='flex space-x-8'>
                                    <div className='flex w-full text-[16px] flex-col space-y-6'>
                                        <div className='flex font-primary flex-col space-y-2'>
                                            <label className='flex font-bold items-center space-x-2'>
                                                <span>Họ tên:</span>
                                                <span className='text-red-500 mt-3 text-3xl'>
                                                   *
                                                </span>
                                            </label>
                                            <input
                                                placeholder='Nhập họ tên'
                                                type='text'
                                                className={`w-[96%] focus:outline-none h-[40px] border rounded-xl px-6 ${
                                                    isSubmitted && !fullName
                                                        ? 'border-red-500'
                                                        : ''
                                                }`}
                                                value={fullName}
                                                onChange={(e) =>
                                                    setFullName(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className='flex font-primary flex-col space-y-2'>
                                            <label className='flex font-bold items-center space-x-2'>
                                                <span>Số điện thoại:</span>
                                                <span className='text-red-500 mt-3 text-3xl'>
                                                    {' '}
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                placeholder='Nhập số điện thoại'
                                                type='text'
                                                className={`w-[96%] focus:outline-none h-[40px] border rounded-xl px-6 ${
                                                    isSubmitted && !phone
                                                        ? 'border-red-500'
                                                        : ''
                                                }`}
                                                value={phone}
                                                onChange={(e) =>
                                                    setPhone(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className='flex font-primary flex-col space-y-2'>
                                            <label className='flex font-bold items-center space-x-2'>
                                                <span>Email:</span>
                                                <span className='text-red-500 mt-3 text-3xl'>
                                                    {' '}
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                placeholder='Nhập email'
                                                type='text'
                                                className={`w-[96%] focus:outline-none h-[40px] border rounded-xl px-6 ${
                                                    (isSubmitted && !email) || existingEmail
                                                        ? 'border-red-500'
                                                        : ''
                                                }`}
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className='flex font-primary flex-col space-y-2'>
                                            <label className='flex font-bold items-center space-x-2'>
                                                <span>Vai trò:</span>
                                                <span className='text-red-500 mt-3 text-[16px]'>
                                                    {' '}
                                                    *
                                                </span>
                                            </label>
                                            <div>
                                                <Listbox
                                                    value={roleTypeSelect}
                                                    onChange={
                                                        setRoleTypeSelect
                                                    }
                                                >
                                                    {({ open }) => (
                                                        <>
                                                            <Listbox.Button
                                                                className={`relative rounded-xl w-[96%] bg-white border ${
                                                                    roleTypeSelect
                                                                        ? 'border-gray-300'
                                                                        : isSubmitted
                                                                            ? 'border-red-500'
                                                                            : 'border-gray-300'
                                                                } shadow-sm pl-6 pr-10 text-left cursor-default focus:outline-none sm:text-sm h-[40px]`}
                                                                onClick={() =>
                                                                    setIsOpenRole(
                                                                        !isOpenRole,
                                                                    )
                                                                }
                                                            >
                                                                <span
                                                                    className={` text-[16px] h-full flex items-center mb-2 ${
                                                                        roleTypeSelect
                                                                            ? 'text-black'
                                                                            : isSubmitted
                                                                                ? 'text-gray-500'
                                                                                : 'text-gray-500'
                                                                    }`}
                                                                >
                                                                    {roleTypeSelect ||
                                                                        'Chọn loại thiết bị'}
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
                                                                    className='absolute w-[96%] text-[16px] bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden z-50 focus:outline-none'
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
                                        </div>
                                    </div>
                                    <div className='flex w-full text-[16px] flex-col space-y-6'>
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
                                                className={`w-[96%] focus:outline-none h-[40px] border rounded-xl px-6 ${
                                                    (isSubmitted && !username) || existingUser
                                                        ? 'border-red-500'
                                                        : ''
                                                }`}
                                                value={username}
                                                onChange={(e) =>
                                                    setUsername(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className='flex relative font-primary flex-col space-y-2'>
                                            <label className='flex font-bold items-center space-x-2'>
                                                <span>Mật khẩu:</span>
                                                <span className='text-red-500 mt-3 text-3xl'>
                                                    {' '}
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                placeholder='Nhập mật khẩu'
                                                type={showPassword ? 'text' : 'password'}
                                                className={`w-[96%] focus:outline-none h-[40px] border-gray-300 border rounded-xl px-6 ${
                                                    (isSubmitted && !password && !passwordMatch) || (!passwordMatch && password !== rePassword)
                                                        ? 'border-red-500'
                                                        : ''
                                                }`}
                                                value={password}
                                                onChange={(e) =>
                                                    handlePasswordChange(e)
                                                }
                                            />
                                            <div
                                                className='absolute cursor-pointer top-20 right-12 transform -translate-y-1/2'
                                                onClick={handleTogglePasswordVisibility}
                                            >
                                                {!showPassword ? (
                                                    <EyeSlashIcon className='w-9 h-9 mr-4 stroke-2' />
                                                ) : (
                                                    <EyeIcon className='w-9 h-9 mr-4 stroke-2' />
                                                )}
                                            </div>
                                        </div>
                                        <div className='flex relative font-primary flex-col space-y-2'>
                                            <label className='flex font-bold items-center space-x-2'>
                                                <span>Nhập lại mật khẩu:</span>
                                                <span className='text-red-500 mt-3 text-3xl'>
                                                    {' '}
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                placeholder='Nhập lại mật khẩu'
                                                type={showRePassword ? 'text' : 'password'}
                                                className={`w-[96%] focus:outline-none h-[40px] border-gray-300 border rounded-xl px-6 ${
                                                    (isSubmitted && !rePassword && !passwordMatch) || (!passwordMatch && password !== rePassword)
                                                        ? 'border-red-500'
                                                        : ''
                                                }`}
                                                value={rePassword}
                                                onChange={(e) =>
                                                    handleRePasswordChange(e)
                                                }
                                            />
                                            <div
                                                className='absolute cursor-pointer top-20 right-12 transform -translate-y-1/2'
                                                onClick={handleToggleRePasswordVisibility}
                                            >
                                                {!showRePassword ? (
                                                    <EyeSlashIcon className='w-9 h-9 mr-4 stroke-2' />
                                                ) : (
                                                    <EyeIcon className='w-9 h-9 mr-4 stroke-2' />
                                                )}
                                            </div>
                                        </div>
                                        <div className='flex font-primary flex-col space-y-2'>
                                            <label className='flex font-bold items-center space-x-2'>
                                                <span>Trạng thái:</span>
                                                <span className='text-red-500 mt-3 text-[16px]'>
                                                    {' '}
                                                    *
                                                </span>
                                            </label>
                                            <div>
                                                <Listbox
                                                    value={activeTypeSelect}
                                                    onChange={
                                                        setActiveTypeSelect
                                                    }
                                                >
                                                    {({ open }) => (
                                                        <>
                                                            <Listbox.Button
                                                                className={`relative rounded-xl w-[96%] bg-white border ${
                                                                    activeTypeSelect
                                                                        ? 'border-gray-300'
                                                                        : isSubmitted
                                                                            ? 'border-red-500'
                                                                            : 'border-gray-300'
                                                                } shadow-sm pl-6 pr-10 text-left cursor-default focus:outline-none sm:text-sm h-[40px]`}
                                                                onClick={() =>
                                                                    setIsOpenActive(
                                                                        !isOpenActive,
                                                                    )
                                                                }
                                                            >
                                                                <span
                                                                    className={` text-[16px] h-full flex items-center mb-2 ${
                                                                        activeTypeSelect
                                                                            ? 'text-black'
                                                                            : isSubmitted
                                                                                ? 'text-gray-500'
                                                                                : 'text-gray-500'
                                                                    }`}

                                                                >
                                                                    {activeTypeSelect}
                                                                </span>
                                                                <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                                                                    {isOpenActive ? (
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
                                                                    {activeType.map(
                                                                        (
                                                                            type, index,
                                                                        ) => (
                                                                            <Listbox.Option
                                                                                key={
                                                                                    index
                                                                                }
                                                                                value={
                                                                                    type
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
                                                                                                activeTypeSelect ===
                                                                                                type
                                                                                                    ? 'font-medium'
                                                                                                    : 'font-normal'
                                                                                            }`}
                                                                                        >
                                                                                            {
                                                                                                type
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
                                onClick={showUpdateAccountComponent}
                                className='mt-6 w-[150px] rounded-xl h-[45px] bg-orange-100 border border-orange-alta text-orange-alta hover: font-secondary font-bold hover:bg-orange-alta hover:text-white'
                            >
                                Hủy bỏ
                            </button>

                            <button
                                onClick={handleFormSubmit}
                                type='submit'
                                className='mt-6 w-[150px] rounded-xl h-[45px] border-orange-alta bg-orange-alta text-white font-secondary font-bold hover:bg-orange-100 border hover:border-orange-alta hover:text-orange-alta'
                            >
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </>
            )}
            {showContainer && <AccountContainer />}
        </>
    );
};

export default UpdateAccount;
