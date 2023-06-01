import { useState } from 'react';
import { EyeSlashIcon } from '@heroicons/react/24/outline';
import { auth } from '~/server/firebase';

const ResetPassword = () => {
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const handleTogglePassword1Visibility = () => {
        setShowPassword1(!showPassword1);
    };

    const handleTogglePassword2Visibility = () => {
        setShowPassword2(!showPassword2);
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
                                    Đặt mật khẩu mới
                                </div>
                            </div>
                            <div className="flex relative flex-col space-y-3 mt-6">
                                <label>Mật khẩu</label>
                                <input
                                    type={showPassword1 ? 'text' : 'password'}
                                    value={password1}
                                    className="w-[400px] z-0 relative h-[40px] border rounded-xl px-6"
                                    onChange={(e) =>
                                        setPassword1(e.target.value)
                                    }
                                />
                                <div
                                    className="absolute top-16 right-2 transform -translate-y-1/2"
                                    onClick={handleTogglePassword1Visibility}
                                >
                                    <EyeSlashIcon className="w-9 h-9 mr-4" />
                                </div>
                            </div>
                        </div>
                        <div className="flex relative flex-col space-y-3 mt-6">
                            <label>Xác nhận mật khẩu</label>
                            <input
                                type={showPassword2 ? 'text' : 'password'}
                                value={password2}
                                className="w-[400px] z-0 relative h-[40px] border rounded-xl px-6"
                                onChange={(e) => setPassword2(e.target.value)}
                            />
                            <div
                                className="absolute top-16 right-2 transform -translate-y-1/2"
                                onClick={handleTogglePassword2Visibility}
                            >
                                <EyeSlashIcon className="w-9 h-9 mr-4" />
                            </div>
                        </div>
                        <div className="w-full mt-12 justify-center flex">
                            <button
                                type="submit"
                                className="mt-6 w-[150px] rounded-xl h-[40px] bg-orange-500 text-white font-secondary font-bold hover:bg-white border hover:border-orange-500 hover:text-orange-500"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
