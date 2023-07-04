import { BellIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import React, { useEffect, useRef, useState } from 'react';
import { NumberType } from '../../types';
import { collection, DocumentSnapshot, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../server/firebase';
import { dateFormat4 } from '../../helper/dateFormat';
import { Link, useNavigate } from 'react-router-dom';

const User = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [notiOpen, setNotiOpen] = useState(false);
    const [numbers, setNumbers] = useState<NumberType[]>([]);

    useEffect(() => {
        const numbersRef = collection(firestore, 'numbers');
        const unsubscribe = onSnapshot(numbersRef, (snapshot) => {
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

            filteredNumbersData.sort((a, b) => {
                // @ts-ignore
                const createdAtA = a?.createdAt?.toDate();
                // @ts-ignore
                const createdAtB = b?.createdAt?.toDate();

                if (createdAtA && createdAtB) {
                    return createdAtB.getTime() - createdAtA.getTime();
                }

                return 0;
            });


            setNumbers(filteredNumbersData);
        });

        return () => {
            unsubscribe();
        };
    }, []);


    const notiContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notiContainerRef.current && !notiContainerRef.current.contains(event.target as HTMLElement)) {
                setNotiOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const [selectedNumber, setSelectedNumber] = useState<NumberType | null>(null);
    const navigate = useNavigate();

    const goDetail = (number: NumberType) => {
        setSelectedNumber(number);
        navigate('/numbers', { state: { data: `${number}`, id: `${number.id}` } });
    };


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
                <div
                    ref={notiContainerRef}
                    className='max-h-[400px] z-[100] border rounded-2xl mr-16 w-[400px] bg-white'
                >
                    <div className='full-size overflow-auto drop-shadow-2xl'>
                        <div className='h-20 rounded-tl-2xl rounded-tr-2xl text-white flex items-center px-5 bg-orange-alta text-[20px] font-primary font-bold'>
                            Thông báo
                        </div>
                        <div className='max-h-[650px] h-[650px] rounded-bl-2xl rounded-br-2xl z-20 w-full overflow-y-scroll bg-white overflow-x-hidden '>
                            {numbers?.length > 0 ? (
                                numbers.map((number, index) => (
                                    <div
                                        key={index}
                                        onClick={() => goDetail(number)}
                                        className='w-full cursor-pointer h-36 hover:bg-orange-100 flex justify-center flex-col pb-2 pl-6 pr-3 py-2 border-b border-gray-300'
                                    >
                                        <div className='text-[20px] my-1 font-primary font-semibold text-orange-800'>
                                            Người dùng: {number.fullName}
                                        </div>
                                        <div className='text-[17px] text-gray-600 font-primary font-medium'>
                                            Thời gian nhận
                                            {/*// @ts-ignore*/}
                                            số: {dateFormat4(number.createdAt.toDate().toISOString())}
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
