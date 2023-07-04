import React, { useState } from 'react';
import { EyeSlashIcon } from '@heroicons/react/24/outline';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { firestore } from '../../server/firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get('email');

    const handleTogglePassword1Visibility = () => {
        setShowPassword1(!showPassword1);
    };

    const handleTogglePassword2Visibility = () => {
        setShowPassword2(!showPassword2);
    };

    const resetPassword = async (email: string, newPassword: string): Promise<void> => {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userId = userDoc.id;

            // Cập nhật mật khẩu trong cơ sở dữ liệu hoặc thực hiện hành động khác để đặt lại mật khẩu
            await updateDoc(doc(usersRef, userId), { password: newPassword });
        } else {
            throw new Error('Email không tồn tại');
        }
    };

    const handleSubmit = async () => {
        if (password1 !== password2) {
            setPasswordMatch(false);
            return;
        }
        try {
            if (email) {
                await resetPassword(email, password1);
            }
            toast.success('Đổi mật khẩu thành công !');
            navigate('/login');
        } catch (error) {
            toast.error('Đổi mật khẩu thất bại !');
        }

    };

    return (
        <>
            <div className='flex full-size'>
                <div className='w-1/2 text-2xl bg-gray-100 h-screen flex items-center flex-col'>
                    <img
                        className='w-[250px] my-52 h-fit'
                        src='/logo.png'
                        alt=''
                    />

                    <div className='text-2xl font-primary'>
                        <div className='flex flex-col space-y-3'>
                            <div className='w-full flex-col mb-6 absolute-center space-y-4'>
                                <div className='font-bold text-4xl'>
                                    Đặt mật khẩu mới
                                </div>
                            </div>
                            <div className='flex relative text-3xl flex-col space-y-3 mt-6'>
                                <label>Mật khẩu</label>
                                <input
                                    type={showPassword1 ? 'text' : 'password'}
                                    value={password1}
                                    className={`w-[450px] z-0 relative h-[50px] border rounded-xl px-6 ${
                                        !passwordMatch ? 'border-red-500' : ''
                                    }`}
                                    onChange={(e) => {
                                        setPassword1(e.target.value);
                                        setPasswordMatch(true);
                                    }}
                                />
                                <div
                                    className='absolute cursor-pointer top-[48px] right-2 transform -translate-y-1/2'
                                    onClick={handleTogglePassword1Visibility}
                                >
                                    <EyeSlashIcon className='w-10 h-10 mr-4' />
                                </div>
                            </div>
                        </div>
                        <div className='flex text-3xl relative flex-col space-y-3 mt-6'>
                            <label>Xác nhận mật khẩu</label>
                            <input
                                type={showPassword2 ? 'text' : 'password'}
                                value={password2}
                                className={`w-[450px] z-0 relative h-[50px] border rounded-xl px-6 ${
                                    !passwordMatch ? 'border-red-500' : ''
                                }`}
                                onChange={(e) => {
                                    setPassword2(e.target.value);
                                    setPasswordMatch(true);
                                }}
                            />
                            <div
                                className='absolute top-[48px] cursor-pointer right-2 transform -translate-y-1/2'
                                onClick={handleTogglePassword2Visibility}
                            >
                                <EyeSlashIcon className='w-10 h-10 mr-4' />
                            </div>
                        </div>
                        <div className='h-12 mt-6'>
                            {!passwordMatch && (
                                <div className='text-red-500 mt-2'>
                                    Mật khẩu không trùng khớp
                                </div>
                            )}
                        </div>
                        <div className='w-full mt-6 justify-center flex'>
                            <button
                                type='submit'
                                className='mt-6 w-[150px] rounded-xl h-[40px] bg-orange-500 text-white font-secondary font-bold hover:bg-white border hover:border-orange-500 hover:text-orange-500'
                                onClick={handleSubmit}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
                <div className='w-1/2 text-2xl h-screen overflow-hidden absolute-center'>
                    <img
                        className='w-fit h-[600px]'
                        src='/Frame.png'
                        alt=''
                    />
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
