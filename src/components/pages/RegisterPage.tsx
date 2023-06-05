import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../../server/firebase';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                `${username.toLowerCase()}@fakeemail.com`,
                password,
            );
            const user = userCredential.user;

            if (user) {
                console.log('Registration successful', user.uid);

                // Lưu thông tin người dùng trong Firestore collection
                const userDocRef = doc(
                    collection(firestore, 'users'),
                    user.uid,
                );
                console.log('User information stored in Firestore');

                // Thêm thông tin người dùng vào document

                await setDoc(userDocRef, {
                    username: username,
                    password: password,
                    // Add other user information fields here
                });

                navigate('/login'); // Chuyển hướng đến trang chính sau khi đăng ký thành công
            } else {
                console.log('User registration failed');
            }
        } catch (error) {
            console.log('Registration failed', error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl mb-4">Register</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex items-center">
                <div className="mr-2">
                    <label htmlFor="username">Tên đăng nhập</label>
                    <input
                        type="text"
                        id="username"
                        className="border p-2"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mr-2">
                    <label htmlFor="password">Mật khẩu</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            className="border p-2 pr-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>
                <button
                    type="button"
                    className="bg-blue-500 mt-12 text-white py-2 px-4 rounded"
                    onClick={handleRegister}
                >
                    Register
                </button>
            </div>
        </div>
    );
};

export default RegisterPage;
