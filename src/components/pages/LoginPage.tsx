import React, { useState } from 'react';
import { auth } from '../../server/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { EyeSlashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Generate a fake email based on the username
        const email = `${username.toLowerCase()}@fakeemail.com`;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
            console.log('Login successful');
        } catch (error: any) {
            // Login failed
            setError('Tên đăng nhập hoặc mật khẩu không đúng');
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

                    <form
                        onSubmit={handleLogin}
                        className="text-2xl font-secondary"
                    >
                        <div className="flex flex-col space-y-3">
                            <label>Tên đăng nhập *</label>
                            <input
                                type="text"
                                value={username}
                                className={`w-[400px] h-[40px] border rounded-xl px-6 ${
                                    error ? 'border-red-500' : ''
                                }`}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="flex relative flex-col space-y-3 mt-6">
                            <label>Mật khẩu *</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                className={`w-[400px] z-0 relative h-[40px] border rounded-xl px-6 ${
                                    error ? 'border-red-500' : ''
                                }`}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div
                                className="absolute top-16 right-2 transform -translate-y-1/2"
                                onClick={handleTogglePasswordVisibility}
                            >
                                {!showPassword ? (
                                    <EyeSlashIcon className="w-9 h-9 mr-4 stroke-2" />
                                ) : (
                                    <EyeIcon className="w-9 h-9 mr-4 stroke-2" />
                                )}
                            </div>
                        </div>
                        <div className="mt-6 h-24">
                            <Link
                                to={'/forgot-password'}
                                className="text-orange-500 hover:underline underline-offset-2 cursor-pointer"
                            >
                                Quên mật khẩu
                            </Link>
                            {error && (
                                <div className="text-red-500 mt-4">{error}</div>
                            )}
                        </div>
                        <div className="w-full justify-center flex">
                            <button
                                onClick={handleLogin}
                                type="submit"
                                className={`mt-6 w-[150px] rounded-xl h-[40px] bg-orange-500 text-white font-secondary font-bold hover:bg-white border hover:border-orange-500 hover:text-orange-500 ${
                                    error ? 'border-red-500' : ''
                                }`}
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
