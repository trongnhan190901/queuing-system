import React, { useState } from 'react';

import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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
                                value={username}
                                className="w-[400px] focus:outline-none h-[40px] border rounded-xl px-6"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="w-full mt-12 justify-center flex space-x-6">
                            <Link to={'/login'}>
                                <button className="mt-6 w-[150px] rounded-xl h-[40px] bg-white border border-orange-500 text-orange-500 hover: font-secondary font-bold hover:bg-orange-500 hover:text-white">
                                    Hủy
                                </button>
                            </Link>

                            <Link to={'/resetpassword'}>
                                <button className="mt-6 w-[150px] rounded-xl h-[40px] bg-orange-500 text-white font-secondary font-bold hover:bg-white border hover:border-orange-500 hover:text-orange-500">
                                    Tiếp tục
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
