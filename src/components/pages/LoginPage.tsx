import React, { useState } from 'react';
import { auth } from '../../server/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { EyeSlashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, username, password);
            navigate('/');
            console.log('Login successful');
        } catch (error: any) {
            // Login failed
            setError(error.message);
            console.log('Login error:', error);
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                    {error && <p>{error}</p>}
                    <form
                        onSubmit={handleLogin}
                        className="text-2xl font-secondary"
                    >
                        <div className="flex flex-col space-y-3">
                            <label>Tên đăng nhập *</label>
                            <input
                                type="text"
                                value={username}
                                className="w-[400px] h-[40px] border rounded-xl px-6"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="flex relative flex-col space-y-3 mt-6">
                            <label>Mật khẩu *</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                className="w-[400px] z-0 relative h-[40px] border rounded-xl px-6"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div
                                className="absolute top-16 right-2 transform -translate-y-1/2"
                                onClick={handleTogglePasswordVisibility}
                            >
                                <EyeSlashIcon className="w-9 h-9 mr-4" />
                            </div>
                        </div>
                        <div className="mt-6">
                            <Link
                                to={'/forgotpassword'}
                                className="text-orange-500 hover:underline underline-offset-2 cursor-pointer"
                            >
                                Quên mật khẩu
                            </Link>
                        </div>
                        <div className="w-full mt-12 justify-center flex">
                            <button
                                onClick={handleLogin}
                                type="submit"
                                className="mt-6 w-[150px] rounded-xl h-[40px] bg-orange-500 text-white font-secondary font-bold hover:bg-white border hover:border-orange-500 hover:text-orange-500"
                            >
                                Đăng nhập
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
