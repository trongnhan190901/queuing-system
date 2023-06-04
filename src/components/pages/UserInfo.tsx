import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, firestore } from '../../server/firebase';
import { getFirestore, doc, getDoc, setDoc } from '@firebase/firestore';
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage';

interface User {
    fullName: string;
    username: string;
    password: string;
    phone: string;
    backupEmail: string;
    image: string;
}

const UserInfo = () => {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    const db = getFirestore();
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    const userDocSnapshot = await getDoc(userDocRef);
                    if (userDocSnapshot.exists()) {
                        const userData = userDocSnapshot.data() as User;
                        setUser(userData);
                    } else {
                        console.log('User document does not exist');
                    }
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.log('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);

    const handleFileInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setImageFile(files[0]);
        }
    };

    const handleUpload = async () => {
        if (imageFile) {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    const storage = getStorage();
                    const storageRef = ref(
                        storage,
                        `users/${currentUser.uid}/profile-image`,
                    );
                    const uploadTask = uploadBytesResumable(
                        storageRef,
                        imageFile,
                    );

                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress =
                                (snapshot.bytesTransferred /
                                    snapshot.totalBytes) *
                                100;
                            setUploadProgress(progress);
                        },
                        (error) => {
                            console.log('Error uploading image:', error);
                        },
                        async () => {
                            try {
                                const downloadURL = await getDownloadURL(
                                    uploadTask.snapshot.ref,
                                );
                                const db = getFirestore();
                                const userDocRef = doc(
                                    db,
                                    'users',
                                    currentUser.uid,
                                );
                                await setDoc(
                                    userDocRef,
                                    { image: downloadURL },
                                    { merge: true },
                                );
                                setUploadProgress(0);
                                setUser((prevUser) =>
                                    prevUser
                                        ? { ...prevUser, image: downloadURL }
                                        : prevUser,
                                );
                            } catch (error) {
                                console.log('Error uploading image:', error);
                            }
                        },
                    );
                }
            } catch (error) {
                console.log('Error uploading image:', error);
            }
        }
    };

    if (!user) {
        return <div>Loading user information...</div>;
    }

    return (
        <>
            <div className="w-full h-screen bg-gray-200">
                <div className="h-32 mx-12 flex items-center mt-8">
                    <div className="text-orange-alta text-3xl font-bold font-primary">
                        Thông tin cá nhân
                    </div>
                </div>
                <div className="w-full h-full absolute-center">
                    <div className="ml-14 mr-40 bg-white flex w-full h-[500px] mb-96">
                        <div className="mx-24 h-full flex items-center">
                            <div className="w-[300px] flex-col h-[400px] flex items-center rounded-full">
                                <img
                                    src={user.image} // Thay đổi đường dẫn hình ảnh
                                    alt=""
                                    className="rounded-full h-[300px] w-[300px]"
                                />
                                <div className="text-4xl mt-12">
                                    {user.fullName}
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-full flex justify-center space-x-6 text-3xl">
                            <div className="w-full flex">
                                <div className="h-full flex flex-col justify-center space-y-10 mx-12">
                                    <div className="space-y-3">
                                        <div>Tên người dùng</div>
                                        <div className="w-[400px] text-gray-600 px-6 flex items-center bg-gray-200 h-16 border rounded-xl">
                                            {user.fullName}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>Số điện thoại</div>
                                        <div className="w-[400px] text-gray-600 px-6 flex items-center bg-gray-200 h-16 border rounded-xl">
                                            {user.phone}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>Email</div>
                                        <div className="w-[400px] text-gray-600 px-6 flex items-center bg-gray-200 h-16 border rounded-xl">
                                            {user.backupEmail}
                                        </div>
                                    </div>
                                </div>

                                <div className="h-full flex flex-col justify-center space-y-10 mx-6">
                                    <div className="space-y-3">
                                        <div>Tên đăng nhập</div>
                                        <div className="w-[400px] text-gray-600 px-6 flex items-center bg-gray-200 h-16 border rounded-xl">
                                            {user.username}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>Mật khẩu</div>
                                        <div className="w-[400px] text-gray-600 px-6 flex items-center bg-gray-200 h-16 border rounded-xl">
                                            {user.password}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>Vai trò</div>
                                        <div className="w-[400px] text-gray-600 px-6 flex items-center bg-gray-200 h-16 border rounded-xl"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <input type="file" onChange={handleFileInputChange} />
                <button onClick={handleUpload}>Upload</button>
            </div>
        </>
    );
};

export default UserInfo;
