import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../server/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
    const [backupEmail, setBackupEmail] = useState('');
    const [emailExists, setEmailExists] = useState(true);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitClicked(true);

        try {
            await sendPasswordResetEmail(auth, backupEmail);

            console.log('Reset password email sent');
            navigate('/reset-password');

            // Tiếp tục xử lý reset mật khẩu ở đây
        } catch (error) {
            setError('Email không tồn tại!');
            setEmailExists(false);
            console.log(error);
        }
    };

    return (
        <>
            <div className="flex full-size">
                <div className="w-1/2 text-2xl pb-24 h-full mt-56 absolute-center flex-col">
                    <img
                        className="w-[250px] my-12 h-fit"
                        src="/logo.png"
                        alt=""
                    />

                    <div className="text-2xl font-secondary">
                        <div className="flex flex-col space-y-3">
                            <div className="w-full flex-col mb-6 absolute-center space-y-4">
                                <div className="font-bold text-4xl">
                                    Đặt lại mật khẩu
                                </div>
                            </div>

                            <label>
                                Vui lòng nhập email để đặt lại mật khẩu của bạn
                                *
                            </label>
                            <input
                                type="text"
                                value={backupEmail}
                                className={`w-[400px] mt-2 focus:outline-none h-[40px] border rounded-xl px-6 ${
                                    emailExists ? '' : 'border-red-500'
                                }`}
                                onChange={(e) => {
                                    setBackupEmail(e.target.value);
                                    setEmailExists(true);
                                    setError('');
                                }}
                            />
                            <div className="h-12 mt-6">
                                {submitClicked && !emailExists && (
                                    <div className="w-full flex-col mb-6 flex space-y-4">
                                        <div className="text-2xl text-red-500 block">
                                            {error ||
                                                'Email không đúng hoặc không tồn tại'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-full mt-4 justify-center flex space-x-6">
                            <Link to={'/login'}>
                                <button className="mt-6 w-[150px] rounded-xl h-[40px] bg-white border border-orange-alta text-orange-alta hover: font-secondary font-bold hover:bg-orange-alta hover:text-white">
                                    Hủy
                                </button>
                            </Link>

                            <button
                                onClick={handleResetPassword}
                                className="mt-6 w-[150px] rounded-xl h-[40px] border-orange-alta bg-orange-alta text-white font-secondary font-bold hover:bg-white border hover:border-orange-alta hover:text-orange-alta"
                            >
                                Tiếp tục
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
