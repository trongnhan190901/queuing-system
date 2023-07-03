import { BellIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import React, { useEffect, useState } from 'react';
import { NumberType } from '../../types';
import { collection, DocumentSnapshot, onSnapshot, query, Timestamp, where } from 'firebase/firestore';
import { firestore } from '../../server/firebase';
import { dateFormat4 } from '../../helper/dateFormat';
import { Link } from 'react-router-dom';

const User = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [notiOpen, setNotiOpen] = useState(false);
    const [numbers, setNumbers] = useState<NumberType[]>([]);

    useEffect(() => {
        const currentDate = new Date();
        const startOfCurrentDay = Timestamp.fromDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
        const endOfCurrentDay = Timestamp.fromDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1));

        const numbersRef = collection(firestore, 'numbers');
        const numbersQuery = query(numbersRef, where('createdAt', '>=', startOfCurrentDay), where('createdAt', '<', endOfCurrentDay));
        const unsubscribe = onSnapshot(numbersQuery, (snapshot) => {
            const numbersData: NumberType[] = snapshot.docs.map((doc: DocumentSnapshot) => {
                const numberData = doc.data() as NumberType;
                const numberId = doc.id;
                return { ...numberData, id: numberId };
            });

            const filteredNumbersData = numbersData.filter((number, index) => {
                if (number.number === 'counter' && index === numbersData.length - 1) {
                    return true; // Giữ lại số cuối cùng nếu là "counter"
                }
                return number.number !== 'counter';
            });

            filteredNumbersData.sort((a, b) =>
                // @ts-ignore
                b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime(),
            );

            setNumbers(filteredNumbersData);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <>
            <div className='h-24 flex justify-end w-full my-4'>
                <div className='absolute-center h-full mx-6'>
                    <div className='w-[32px] cursor-pointer group z-20 h-[32px] hover:bg-orange-alta mx-4 bg-orange-100 rounded-full absolute-center'>
                        <BellIcon
                            onClick={() => setNotiOpen(!notiOpen)}
                            className='h-8 w-8 stroke-orange-400 fill-orange-400 group-hover:fill-white group-hover:stroke-white cursor-pointer'
                        />
                    </div>
                    <Link
                        to='/user'
                        className='rounded-full z-10 cursor-pointer transition-colors duration-300 hover:bg-orange-100 px-8 h-full absolute-center'
                    >
                        <div className='mr-4'>
                            <img
                                src='/image.jpeg'
                                alt=''
                                className='w-16 h-16 rounded-full'
                            />
                        </div>
                        <div>
                            <div className='text-gray-500'>Xin chào</div>
                            <div className='text-2xl'>{user?.fullName}</div>
                        </div>
                    </Link>
                </div>
            </div>
            {notiOpen && (
                <div className='max-h-[400px] border rounded-2xl mr-16 w-[400px] bg-white'>
                    <div className='full-size overflow-auto'>
                        <div className='h-20 rounded-tl-2xl rounded-tr-2xl text-white flex items-center px-5 bg-orange-alta text-[20px] font-primary font-bold'>
                            Thông báo
                        </div>
                        <div className='max-h-[350px] h-[350px] rounded-bl-2xl rounded-br-2xl z-20 w-full overflow-y-scroll bg-white overflow-x-hidden '>
                            {numbers?.length > 0 ? (
                                numbers.map((number, index) => (
                                    <div
                                        key={index}
                                        className='w-full h-32 flex justify-center flex-col pb-2 ml-6 mr-3 my-2 border-b border-gray-300'
                                    >
                                        <div className='text-[18px] my-1 font-primary font-semibold text-orange-800'>
                                            Người dùng: {number.fullName}
                                        </div>
                                        <div className='text-[16px] text-gray-600 font-primary font-medium'>
                                            {/*// @ts-ignore*/}
                                            Thời gian nhận số: {dateFormat4(number.createdAt.toDate().toISOString())}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className='text-[18px] full-size absolute-center text-gray-600 font-primary font-medium'>
                                    Không có thông báo
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default User;
