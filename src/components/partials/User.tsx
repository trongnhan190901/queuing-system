import { BellIcon } from '@heroicons/react/24/outline';
import { auth, firestore } from '../../server/firebase';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const User = () => {
    const user = auth.currentUser;
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        const fetchUserFullName = async () => {
            if (user) {
                try {
                    const userDocRef = firestore
                        .collection('users')
                        .doc(user.uid);
                    const userDocSnap = await userDocRef.get();

                    if (userDocSnap.exists) {
                        const userData = userDocSnap.data();
                        if (userData) {
                            setFullName(userData.fullName || '');
                        }
                    } else {
                        console.log('User document does not exist.');
                    }
                } catch (error) {
                    console.error('Error fetching user information:', error);
                }
            }
        };

        fetchUserFullName();
    }, [user]);

    return (
        <>
            <div className="h-24 flex justify-end w-full my-4">
                <div className="absolute-center h-full mx-6">
                    <div className="w-[32px] h-[32px] mx-4 bg-orange-100 rounded-full absolute-center">
                        <BellIcon className="h-8 w-8 stroke-orange-400 fill-orange-400" />
                    </div>
                    {/* <div className="w-[32px] h-[32px] bg-orange-500 rounded-full absolute-center">
                        <BellIcon className="h-8 w-8 stroke-white fill-white" />
                    </div> */}
                    <div className="rounded-full hover:bg-orange-100 px-8 h-full absolute-center">
                        <div className="mr-4">
                            <img
                                src="/logo.png"
                                alt=""
                                className="w-16 h-16 rounded-full"
                            />
                        </div>
                        <div>
                            <div className="text-gray-500">Xin chào</div>
                            <div className="text-2xl">{fullName}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default User;
