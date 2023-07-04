import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from 'server/firebase'; // Thay đổi import này nếu cần

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [emailExists, setEmailExists] = useState(true);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();


    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitClicked(true);

        try {
            const q = query(
                collection(firestore, 'users'),
                where('email', '==', email),
            );
            const userQuery = await getDocs(q);

            if (userQuery.empty) {
                setError('Email không tồn tại');
                setEmailExists(false);
                return;
            }

            console.log('Email exists');
            navigate(`/reset-password?email=${encodeURIComponent(email)}`);

            // Tiếp tục xử lý reset mật khẩu ở đây
        } catch (error) {
            setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            setEmailExists(false);
            console.log(error);
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

                    <div className='text-3xl font-primary'>
                        <div className='flex flex-col space-y-3'>
                            <div className='w-full flex-col mb-6 absolute-center space-y-4'>
                                <div className='font-bold text-4xl'>
                                    Đặt lại mật khẩu
                                </div>
                            </div>

                            <label>
                                Vui lòng nhập email để đặt lại mật khẩu của bạn
                                *
                            </label>
                            <input
                                type='text'
                                value={email}
                                className={`w-[450px] mt-2 focus:outline-none h-[50px] border rounded-xl px-6 ${
                                    emailExists ? '' : 'border-red-500'
                                }`}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailExists(true);
                                    setError('');
                                }}
                            />
                            <div className='h-12 mt-6'>
                                {submitClicked && !emailExists && (
                                    <div className='w-full flex-col mb-6 flex space-y-4'>
                                        <div className='text-2xl text-red-500 block'>
                                            {error ||
                                                'Email không đúng hoặc không tồn tại'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='w-full mt-4 justify-center text-2xl flex space-x-6'>
                            <Link to={'/login'}>
                                <button className='mt-6 w-[150px] rounded-xl h-[40px] bg-transparent border border-orange-alta text-orange-alta hover: font-secondary font-bold hover:bg-orange-alta hover:text-white'>
                                    Hủy
                                </button>
                            </Link>

                            <button
                                onClick={handleResetPassword}
                                className='mt-6 w-[150px] rounded-xl h-[40px] border-orange-alta bg-orange-alta text-white font-secondary font-bold hover:bg-white border hover:border-orange-alta hover:text-orange-alta'
                            >
                                Tiếp tục
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

export default ForgotPassword;
