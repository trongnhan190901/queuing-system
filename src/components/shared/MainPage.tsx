import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../../server/firebase';
import { useNavigate } from 'react-router-dom';
import Navbar from '../partials/Navbar';
import InformationModal from '../modal/InformationModal';

const MainPage = () => {
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const user = auth.currentUser;
            if (!user) {
                // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
                navigate('/login');
            } else {
                // Kiểm tra nếu người dùng chưa cung cấp thông tin cá nhân
                const userDocRef = firestore.collection('users').doc(user.uid);
                const userDocSnap = await userDocRef.get();

                if (
                    !userDocSnap.exists ||
                    !userDocSnap.data()?.fullName ||
                    !userDocSnap.data()?.phone
                ) {
                    // Hiển thị dialog thông tin cá nhân
                    setShowDialog(true);
                }
            }
        };

        checkUserLoggedIn();
    }, [navigate]);

    const checkUserInformation = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const userDocRef = firestore.collection('users').doc(user.uid);
                const userDocSnap = await userDocRef.get();

                if (userDocSnap.exists) {
                    const userData = userDocSnap.data();
                    console.log('Thông tin người dùng:', userData);
                } else {
                    console.log('Người dùng không tồn tại trong Firestore.');
                }
            } catch (error) {
                console.error('Lỗi khi truy xuất thông tin người dùng:', error);
            }
        } else {
            console.log('Người dùng chưa đăng nhập.');
        }
    };

    useEffect(() => {
        checkUserInformation();
    }, []);

    return (
        <>
            <div className="full-size flex">
                <Navbar />
            </div>
            <InformationModal
                showDialog={showDialog}
                setShowDialog={setShowDialog}
            />
        </>
    );
};

export default MainPage;
