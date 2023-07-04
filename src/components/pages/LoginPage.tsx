import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../store/authSlice';
import { RootState } from 'store/store';
import Loading from 'components/loading/Loading';
import { ExclamationCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const isLoading = useSelector((state: RootState) => state.auth.loading);

    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const resultAction = await dispatch(login({ username, password }) as any);
            if (resultAction.payload) {
                const { user, device } = resultAction.payload;

                if (user && user.active) {
                    navigate('/');
                } else if (device && device.active) {
                    const { deviceCode } = device;
                    navigate(`/device/${deviceCode}`);
                } else {
                    setError('Sai mật khẩu hoặc tên đăng nhập');
                }
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            setError('Sai mật khẩu hoặc tên đăng nhập');
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <div className='flex full-size'>
                {isLoading &&
                    <Loading />
                };
                <div className='w-1/2 text-2xl bg-gray-100 h-screen flex items-center flex-col'>
                    <img
                        className='w-[250px] my-52 h-fit'
                        src='/logo.png'
                        alt=''
                    />

                    <form
                        onSubmit={handleLogin}
                        className='text-3xl font-primary'
                    >
                        <div className='flex flex-col space-y-3'>
                            <label>Tên đăng nhập *</label>
                            <input
                                type='text'
                                value={username}
                                className={`w-[450px] h-[50px] border rounded-xl px-6 ${
                                    error ? 'border-red-500' : ''
                                }`}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className='flex relative flex-col space-y-3 mt-12'>
                            <label>Mật khẩu *</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                className={`w-[450px] z-0 relative h-[50px] border rounded-xl px-6 ${
                                    error ? 'border-red-500' : ''
                                }`}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div
                                className='absolute cursor-pointer top-[4.8rem] right-2 transform -translate-y-1/2'
                                onClick={handleTogglePasswordVisibility}
                            >
                                {!showPassword ? (
                                    <EyeSlashIcon className='w-10 h-10 mr-4 stroke-2' />
                                ) : (
                                    <EyeIcon className='w-10 h-10 mr-4 stroke-2' />
                                )}
                            </div>
                        </div>
                        <div className='mt-8 h-12'>
                            {!error ? (
                                <Link
                                    to={'/forgot-password'}
                                    className='text-red-500 mt-4 hover:underline underline-offset-2 cursor-pointer'
                                >
                                    Quên mật khẩu
                                </Link>) : (
                                <div className='flex items-center text-red-500 mt-4'>
                                    <ExclamationCircleIcon className='w-10 h-10 stroke-[2.5] mr-2' />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>
                        <div className='w-full absolute-center flex-col'>
                            <button
                                onClick={handleLogin}
                                type='submit'
                                className='mt-6 text-2xl w-[150px] rounded-xl h-[45px] bg-orange-500 text-white font-secondary font-bold hover:bg-white border-orange-alta hover:border-orange-500 hover:border-2 hover:text-orange-500'
                            >
                                Đăng nhập
                            </button>
                            {error && (
                                <Link
                                    to={'/forgot-password'}
                                    className='text-red-500 mt-4 hover:underline underline-offset-2 cursor-pointer'
                                >
                                    Quên mật khẩu
                                </Link>
                            )}
                        </div>
                    </form>
                </div>
                <div className='w-1/2 relative text-2xl h-screen overflow-hidden absolute-center'>
                    <img
                        className='w-fit h-[750px]'
                        src='/loginIMG.png'
                        alt=''
                    />
                    <div className='absolute right-20 font-primary text-orange-alta'>
                        <div className='text-6xl font-medium'>Hệ thống</div>
                        <div className='text-7xl font-bold'>Quản lý xếp hàng</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
