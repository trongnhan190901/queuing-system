import { ChevronRightIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { firestore } from 'server/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import RoleContainer from './RoleContainer';
import Loading from 'components/loading/Loading';
import Navbar from '../../../partials/Navbar';
import User from '../../../partials/User';

const AddRole = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [roleName, setRoleName] = useState('');
    const [roleDes, setRoleDes] = useState('');

    const [showAddRole, setShowAddRole] = useState(true);
    const [showContainer, setShowContainer] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const showAddRoleContainer = () => {
        setShowContainer(!showContainer);
        setShowAddRole(!showAddRole);
    };

    const [allFeatA, setAllFeatA] = useState(false);
    const [featAX, setFeatAX] = useState(false);
    const [featAY, setFeatAY] = useState(false);
    const [featAZ, setFeatAZ] = useState(false);

    useEffect(() => {
        if (featAX && featAY && featAZ) {
            setAllFeatA(true);
        } else {
            setAllFeatA(false);
        }
    }, [featAX, featAY, featAZ]);

    const handleSelectAllChangeFeatA = (event: any) => {
        const checked = event.target.checked;
        setAllFeatA(checked);
        setFeatAX(checked);
        setFeatAY(checked);
        setFeatAZ(checked);
    };

    const handleCheckboxChangeFeatA = (checkbox: any, checked: boolean) => {
        if (checked) {
            setFeatAX(checkbox === 1 ? true : featAX);
            setFeatAY(checkbox === 2 ? true : featAY);
            setFeatAZ(checkbox === 3 ? true : featAZ);
        } else {
            setAllFeatA(false);
            setFeatAX(checkbox === 1 ? false : featAX);
            setFeatAY(checkbox === 2 ? false : featAY);
            setFeatAZ(checkbox === 3 ? false : featAZ);
        }
    };

    const [allFeatB, setAllFeatB] = useState(false);
    const [featBX, setFeatBX] = useState(false);
    const [featBY, setFeatBY] = useState(false);
    const [featBZ, setFeatBZ] = useState(false);

    useEffect(() => {
        if (featBX && featBY && featBZ) {
            setAllFeatB(true);
        } else {
            setAllFeatB(false);
        }
    }, [featBX, featBY, featBZ]);

    const handleSelectAllChangeFeatB = (event: any) => {
        const checked = event.target.checked;
        setAllFeatB(checked);
        setFeatBX(checked);
        setFeatBY(checked);
        setFeatBZ(checked);
    };

    const handleCheckboxChangeFeatB = (checkbox: any, checked: boolean) => {
        if (checked) {
            setFeatBX(checkbox === 1 ? true : featBX);
            setFeatBY(checkbox === 2 ? true : featBY);
            setFeatBZ(checkbox === 3 ? true : featBZ);
        } else {
            setAllFeatB(false);
            setFeatBX(checkbox === 1 ? false : featBX);
            setFeatBY(checkbox === 2 ? false : featBY);
            setFeatBZ(checkbox === 3 ? false : featBZ);
        }
    };

    const handleFormSubmit = async () => {
        setIsSubmitted(true);


        if (roleName && roleDes) {
            try {
                setIsLoading(true);
                const data: any = {
                    roleName,
                    roleDes,
                    featAX,
                    featAY,
                    featAZ,
                    featBX,
                    featBY,
                    featBZ,
                    roleCount: 0,
                };
                const docRef = await addDoc(
                    collection(firestore, 'roles'),
                    data,
                );
                toast.success('Thêm vai trò thành công');
                showAddRoleContainer();
                console.log('Document written with ID: ', docRef.id);
            } catch (error) {
                setIsLoading(false);
                toast.error('Thêm vai trò thất bại');
                console.error('Error adding document: ', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            {isLoading && <Loading />}
            {showAddRole && (
                <div className='full-size flex relative'>
                    <Navbar />
                    <div className='absolute top-2 right-2'>
                        <User />
                    </div>
                    <div className='w-full h-screen bg-gray-200'>
                        <div className='h-32 mx-12 flex items-center'>
                            <div className='text-gray-500 text-3xl font-bold font-primary'>
                                Cài đặt hệ thống
                            </div>
                            <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                            <div
                                onClick={showAddRoleContainer}
                                className='text-gray-500 cursor-pointer hover:text-orange-alta text-3xl font-bold font-primary'
                            >
                                Quản lý vai trò
                            </div>
                            <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                            <div className='text-orange-alta text-3xl font-bold font-primary'>
                                Thêm vai trò
                            </div>
                        </div>
                        <div className='m-12 my-12 text-4xl font-extrabold font-primary text-orange-alta'>
                            Danh sách vai trò
                        </div>
                        <div className='w-[95%] ml-14 h-[600px] pb-96 rounded-3xl drop-shadow-xl shadow-xl bg-white'>
                            <div className='mx-14 pt-8 pb-24'>
                                <div className='text-orange-alta text-[22px] font-bold font-primary'>
                                    Thông tin dịch vụ
                                </div>
                                <div className='mt-12 full-size'>
                                    <div className='flex space-x-8'>
                                        <div className='flex w-full text-[16px] flex-col space-y-6'>
                                            <div className='flex font-primary flex-col space-y-2'>
                                                <label className='flex font-bold items-center space-x-2'>
                                                    <span>Tên vai trò:</span>
                                                    <span className='text-red-500 mt-3 text-3xl'>
                                                    {' '}
                                                        *
                                                </span>
                                                </label>
                                                <input
                                                    placeholder='Nhập tên vai trò'
                                                    type='text'
                                                    className={`w-[96%] focus:outline-none h-[40px] border rounded-xl px-6 ${
                                                        isSubmitted && !roleName
                                                            ? 'border-red-500'
                                                            : ''
                                                    }`}
                                                    value={roleName}
                                                    onChange={(e) =>
                                                        setRoleName(e.target.value)
                                                    }
                                                />
                                            </div>
                                            <div className='flex font-primary flex-col space-y-2'>
                                                <label className='flex font-bold items-center space-x-2'>
                                                    <span>Mô tả:</span>
                                                    <span className='text-red-500 mt-3 text-3xl'>
                                                    {' '}
                                                        *
                                                </span>
                                                </label>
                                                <textarea
                                                    placeholder='Nhập mô tả'
                                                    rows={4}
                                                    className={`w-[96%] focus:outline-none h-[130px] border-gray-300 border rounded-xl py-2 px-6 ${
                                                        isSubmitted && !roleDes
                                                            ? 'border-red-500'
                                                            : ''
                                                    }`}
                                                    value={roleDes}
                                                    onChange={(e) =>
                                                        setRoleDes(e.target.value)
                                                    }
                                                />
                                            </div>
                                            <div className='flex items-center text-[15px] mt-4 space-x-1'>
                                            <span className='text-red-500 font-bold mt-3 text-3xl'>
                                                *{' '}
                                            </span>
                                                <span>
                                                Là trường thông tin bắt buộc
                                            </span>
                                            </div>
                                        </div>
                                        <div className='flex w-full text-[16px] flex-col space-y-6'>
                                            <div className='flex font-primary flex-col space-y-2'>
                                                <label className='flex font-bold items-center space-x-2'>
                                                <span>
                                                    Phân quyền chức năng:
                                                </span>
                                                </label>
                                                <div className='bg-orange-100 rounded-3xl mr-12 w-full h-[450px]'>
                                                    <div className='my-8 mx-12'>
                                                        <div className='text-orange-alta text-[22px] font-bold font-primary'>
                                                            Nhóm chức năng A
                                                        </div>
                                                        <div className='my-4'>
                                                            <div>
                                                                <div className='flex text-[16px] h-16 items-center'>
                                                                    <input
                                                                        type='checkbox'
                                                                        className='appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500'
                                                                        checked={
                                                                            allFeatA
                                                                        }
                                                                        onChange={
                                                                            handleSelectAllChangeFeatA
                                                                        }
                                                                    />
                                                                    <div className='mx-4'>
                                                                        Tất cả
                                                                    </div>
                                                                </div>
                                                                {' '}
                                                            </div>
                                                            <div>
                                                                <div className='flex text-[16px] h-16 items-center'>
                                                                    <input
                                                                        type='checkbox'
                                                                        className='appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500'
                                                                        checked={
                                                                            featAX
                                                                        }
                                                                        onChange={(
                                                                            event,
                                                                        ) =>
                                                                            handleCheckboxChangeFeatA(
                                                                                1,
                                                                                event
                                                                                    .target
                                                                                    .checked,
                                                                            )
                                                                        }
                                                                    />
                                                                    <div className='mx-4'>
                                                                        Chức năng x
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className='flex text-[16px] h-16 items-center'>
                                                                    <input
                                                                        type='checkbox'
                                                                        className='appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500'
                                                                        checked={
                                                                            featAY
                                                                        }
                                                                        onChange={(
                                                                            event,
                                                                        ) =>
                                                                            handleCheckboxChangeFeatA(
                                                                                2,
                                                                                event
                                                                                    .target
                                                                                    .checked,
                                                                            )
                                                                        }
                                                                    />
                                                                    <div className='mx-4'>
                                                                        Chức năng y
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className='flex text-[16px] h-16 items-center'>
                                                                    <input
                                                                        type='checkbox'
                                                                        className='appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500'
                                                                        checked={
                                                                            featAZ
                                                                        }
                                                                        onChange={(
                                                                            event,
                                                                        ) =>
                                                                            handleCheckboxChangeFeatA(
                                                                                3,
                                                                                event
                                                                                    .target
                                                                                    .checked,
                                                                            )
                                                                        }
                                                                    />
                                                                    <div className='mx-4'>
                                                                        Chức năng z
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='text-orange-alta text-[22px] font-bold font-primary'>
                                                            Nhóm chức năng B
                                                        </div>
                                                        <div className='my-4'>
                                                            <div>
                                                                <div className='flex text-[16px] h-16 items-center'>
                                                                    <input
                                                                        type='checkbox'
                                                                        className='appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500'
                                                                        checked={
                                                                            allFeatB
                                                                        }
                                                                        onChange={
                                                                            handleSelectAllChangeFeatB
                                                                        }
                                                                    />
                                                                    <div className='mx-4'>
                                                                        Tất cả
                                                                    </div>
                                                                </div>
                                                                {' '}
                                                            </div>
                                                            <div>
                                                                <div className='flex text-[16px] h-16 items-center'>
                                                                    <input
                                                                        type='checkbox'
                                                                        className='appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500'
                                                                        checked={
                                                                            featBX
                                                                        }
                                                                        onChange={(
                                                                            event,
                                                                        ) =>
                                                                            handleCheckboxChangeFeatB(
                                                                                1,
                                                                                event
                                                                                    .target
                                                                                    .checked,
                                                                            )
                                                                        }
                                                                    />
                                                                    <div className='mx-4'>
                                                                        Chức năng x
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className='flex text-[16px] h-16 items-center'>
                                                                    <input
                                                                        type='checkbox'
                                                                        className='appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500'
                                                                        checked={
                                                                            featBY
                                                                        }
                                                                        onChange={(
                                                                            event,
                                                                        ) =>
                                                                            handleCheckboxChangeFeatB(
                                                                                2,
                                                                                event
                                                                                    .target
                                                                                    .checked,
                                                                            )
                                                                        }
                                                                    />
                                                                    <div className='mx-4'>
                                                                        Chức năng y
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className='flex text-[16px] h-16 items-center'>
                                                                    <input
                                                                        type='checkbox'
                                                                        className='appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500'
                                                                        checked={
                                                                            featBZ
                                                                        }
                                                                        onChange={(
                                                                            event,
                                                                        ) =>
                                                                            handleCheckboxChangeFeatB(
                                                                                3,
                                                                                event
                                                                                    .target
                                                                                    .checked,
                                                                            )
                                                                        }
                                                                    />
                                                                    <div className='mx-4'>
                                                                        Chức năng z
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='w-full mt-12 text-2xl justify-center flex space-x-6'>
                            <button
                                onClick={showAddRoleContainer}
                                className='mt-6 w-[150px] rounded-xl h-[45px] bg-orange-100 border border-orange-alta text-orange-alta hover: font-secondary font-bold hover:bg-orange-alta hover:text-white'
                            >
                                Hủy bỏ
                            </button>

                            <button
                                onClick={handleFormSubmit}
                                type='submit'
                                className='mt-6 w-[150px] rounded-xl h-[45px] border-orange-alta bg-orange-alta text-white font-secondary font-bold hover:bg-orange-100 border hover:border-orange-alta hover:text-orange-alta'
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showContainer && <RoleContainer />}
        </>
    );
};

export default AddRole;
