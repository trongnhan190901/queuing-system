import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { CameraIcon } from '@heroicons/react/24/outline';
import Navbar from '../partials/Navbar';
import User from '../partials/User';
import React from 'react';

const UserInfo = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    // const handleImageUpload = async (event: any) => {
    //     const file = event.target.files[0];
    //
    //     // Tạo reference đến Firebase Storage
    //     const storage = getStorage();
    //     const storageRef = ref(storage, `users/${user?.id}/${file.name}`);
    //
    //     // Upload ảnh lên Firebase Storage
    //     await uploadBytes(storageRef, file);
    //
    //     // Lấy URL của ảnh từ Firebase Storage
    //     const downloadURL = await getDownloadURL(storageRef);
    //
    //     // Lưu trữ URL của ảnh vào Firestore
    //     const userDocRef = doc(firestore, 'users', user?.id || '');
    //     await updateDoc(userDocRef, { profileImage: downloadURL });
    // };
    return (
        <>
            <div className='full-size flex relative'>
                <Navbar />
                <div className='absolute top-2 z-30 right-2'>
                    <User />
                </div>
                <div className='w-full h-screen bg-gray-200'>
                    <div className='h-32 mx-12 flex items-center mt-8'>
                        <div className='text-orange-alta text-4xl font-bold font-primary'>
                            Thông tin cá nhân
                        </div>
                    </div>
                    <div className='w-full h-full absolute-center'>
                        <div className='ml-14 mr-40 bg-white flex rounded-3xl drop-shadow-2xl w-full h-[400px] mb-96'>
                            <div className='mx-24 h-full flex items-center'>
                                <div className='w-[300px] flex-col h-[300px] flex items-center rounded-full'>
                                    <div className='w-full h-full relative absolute-center'>
                                        <img
                                            src={'/image.jpeg'}
                                            alt=''
                                            className='rounded-full h-[250px] w-[250px]'
                                        />
                                        <div className='w-16 group hover:bg-white hover:border-orange-alta transition-colors duration-300 absolute right-20 bottom-4 h-16 rounded-full border-white border-2 absolute-center bg-orange-alta'>
                                            <CameraIcon className='transition-colors duration-300 w-10 h-10 cursor-pointer stroke-white group-hover:stroke-orange-alta' />
                                            <label htmlFor='input'>
                                                <input
                                                    id='file-input'
                                                    type='file'
                                                    accept='image/*'
                                                    className='absolute inset-0 opacity-0 cursor-pointer'
                                                    // onChange={handleImageUpload}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className='text-4xl mt-12'>
                                        {user?.fullName}
                                    </div>
                                </div>
                            </div>

                            <div className='w-full h-full flex justify-center space-x-6 text-3xl'>
                                <div className='w-full flex'>
                                    <div className='h-full flex flex-col justify-center space-y-10 mx-12'>
                                        <div className='space-y-3'>
                                            <div>Tên người dùng</div>
                                            <div className='w-[400px] text-gray-600 px-6 flex items-center bg-gray-200 h-16 border rounded-xl'>
                                                {user?.fullName}
                                            </div>
                                        </div>
                                        <div className='space-y-3'>
                                            <div>Số điện thoại</div>
                                            <div className='w-[400px] text-gray-600 px-6 flex items-center bg-gray-200 h-16 border rounded-xl'>
                                                {user?.phone}
                                            </div>
                                        </div>
                                        <div className='space-y-3'>
                                            <div>Email</div>
                                            <div className='w-[400px] text-gray-600 px-6 flex items-center bg-gray-200 h-16 border rounded-xl'>
                                                {user?.email}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='h-full flex flex-col justify-center space-y-10 mx-6'>
                                        <div className='space-y-3'>
                                            <div>Tên đăng nhập</div>
                                            <div className='w-[400px] text-gray-600 px-6 flex items-center bg-gray-200 h-16 border rounded-xl'>
                                                {user?.username}
                                            </div>
                                        </div>
                                        <div className='space-y-3'>
                                            <div>Mật khẩu</div>
                                            <div className='w-[400px] text-gray-600 px-6 flex items-center bg-gray-200 h-16 border rounded-xl'>
                                                {user?.password}
                                            </div>
                                        </div>
                                        <div className='space-y-3'>
                                            <div>Vai trò</div>
                                            <div className='w-[400px] text-gray-600 px-6 flex items-center bg-gray-200 h-16 border rounded-xl'>
                                                {user?.role}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserInfo;
