import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../server/firebase';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');

    const handleRegister = async () => {
        try {
            await createUserWithEmailAndPassword(auth, username, password);
            // Registration successful
            console.log('Registration successful');
        } catch (error: any) {
            // Registration failed
            setError(error.message);
            console.log('Registration error:', error);
        }
    };
    return (
        <div>
            <h2 className="text-2xl mb-4">Register</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex items-center">
                <div className="mr-2">
                    <label htmlFor="username">Mật khẩu</label>
                    <input
                        type="text"
                        id="username"
                        className="border p-2"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mr-2">
                    <label htmlFor="password">:</label>
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
                        ></button>
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
