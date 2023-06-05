import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../../server/firebase';
import { useNavigate } from 'react-router-dom';
import Navbar from '../partials/Navbar';
import InformationModal from '../modal/InformationModal';
import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';

const MainPage = () => {
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);

    const user = auth.currentUser;

    console.log(user);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const user = auth.currentUser;
            if (!user) {
                // User is not logged in, redirect to the login page
                navigate('/login');
            } else {
                // Check if the user has provided personal information
                const userDocRef = doc(
                    collection(firestore, 'users'),
                    user.uid,
                );
                const userDocSnap = await getDoc(userDocRef);

                if (
                    !userDocSnap.exists() ||
                    !userDocSnap.data()?.fullName ||
                    !userDocSnap.data()?.phone
                ) {
                    // Show the personal information dialog
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
                const userDocRef = doc(
                    collection(firestore, 'users'),
                    user.uid,
                );
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    console.log('User information:', userData);
                } else {
                    console.log('User does not exist in Firestore.');
                }
            } catch (error) {
                console.error('Error retrieving user information:', error);
            }
        } else {
            console.log('User is not logged in.');
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
