import { ArrowUturnLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import NumberContainer from './NumberContainer';
import { NumberType } from 'types';
import { dateFormat2 } from 'helper/dateFormat';
import Navbar from '../../partials/Navbar';
import User from '../../partials/User';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../server/firebase';
import { useNavigate } from 'react-router-dom';

interface DetailNumberProp {
    numberData: NumberType | null;
    numberId: string;
}

const DetailDevice = ({ numberData, numberId }: DetailNumberProp) => {
    const [showDetailDevice, setShowDetailDevice] = useState(true);
    const [showContainer, setShowContainer] = useState(false);
    const [fetchedNumberData, setFetchedNumberData] = useState<NumberType | null>(null);
    const navigate = useNavigate();

    const showNumberContainer = () => {
        setShowDetailDevice(!showDetailDevice);
        setShowContainer(!showContainer);
        navigate('/numbers', { state: { data: null, id: null } });
    };

    useEffect(() => {
        const fetchNumberData = async () => {
            try {
                const numberDocRef = doc(firestore, 'numbers', numberId);
                const numberDocSnapshot = await getDoc(numberDocRef);
                if (numberDocSnapshot.exists()) {
                    const numberData = numberDocSnapshot.data() as NumberType;
                    setFetchedNumberData(numberData);
                } else {
                    // Handle case when the document doesn't exist
                    setFetchedNumberData(null);
                }
            } catch (error) {
                // Handle error
                console.log('Error fetching number data:', error);
            }
        };

        // Fetch number data only if the numberId is provided
        if (numberId) {
            fetchNumberData();
        }
    }, [numberId]);

    // Render the fetchedNumberData or numberData based on availability
    const numberDataToRender = numberId ? fetchedNumberData : numberData;


    return (
        <>
            {showDetailDevice && (
                <div className='full-size flex relative'>
                    <Navbar />
                    <div className='absolute top-2 z-30 right-2'>
                        <User />
                    </div>
                    <div className='w-full h-screen bg-gray-200'>
                        <div className='h-32 mx-12 flex items-center'>
                            <div className='text-gray-500 text-3xl font-bold font-primary'>
                                Cấp số
                            </div>
                            <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                            <div
                                onClick={showNumberContainer}
                                className='text-gray-500 cursor-pointer hover:text-orange-alta text-3xl font-bold font-primary'
                            >
                                Danh sách cấp số
                            </div>
                            <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                            <div className='text-orange-alta text-3xl font-bold font-primary'>
                                Chi tiết
                            </div>
                        </div>
                        <div className='m-12 my-12 text-4xl font-extrabold font-primary text-orange-alta'>
                            Quản lý cấp số
                        </div>
                        <div className='w-full h-[75%] flex'>
                            <div className='w-[88%] ml-14 h-full pb-24 rounded-3xl drop-shadow-xl shadow-xl bg-white'>
                                <div className='mx-14 pt-8 pb-40'>
                                    <div className='text-orange-alta text-[22px] font-bold font-primary'>
                                        Thông tin cấp số
                                    </div>
                                    <div className='flex w-full flex-col mt-12 leading-[2.8]'>
                                        <div className='flex w-full'>
                                            <div className='flex w-full'>
                                                <div className='flex font-bold font-primary text-[17px] flex-col'>
                                                    <div>Họ tên:</div>
                                                    <div>Tên dịch vụ:</div>
                                                    <div>Số thứ tự:</div>
                                                    <div>Thời gian cấp:</div>
                                                    <div>Hạn sử dụng:</div>
                                                </div>
                                                <div className='flex font-primary ml-24 text-[17px] flex-col'>
                                                    <div>
                                                        {numberDataToRender?.fullName}
                                                    </div>
                                                    <div>
                                                        {numberDataToRender?.serviceSelect}
                                                    </div>
                                                    <div>
                                                        {numberDataToRender?.number}
                                                    </div>
                                                    <div>
                                                        {/*// @ts-ignore*/}
                                                        {dateFormat2(numberDataToRender?.createdAt.toDate().toISOString())}
                                                    </div>
                                                    <div>
                                                        {/*// @ts-ignore*/}
                                                        {dateFormat2(numberDataToRender?.expirationTime.toDate().toISOString())}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex w-full'>
                                                <div className='flex font-bold font-primary text-[17px] flex-col'>
                                                    <div>Nguồn cấp:</div>
                                                    <div>Trạng thái:</div>
                                                    <div>Số điện thoại:</div>
                                                    <div>Địa chỉ Email:</div>
                                                </div>
                                                <div className='flex font-primary  ml-24 text-[17px] flex-col'>
                                                    <div>
                                                        {numberDataToRender?.source}
                                                    </div>
                                                    <div>
                                                        {numberDataToRender?.status === 'WAITING' ? (
                                                            <div className='flex'>
                                                                <div className='w-3 h-3 mt-8 mr-3 rounded-full bg-blue-500'></div>
                                                                <span>Đang chờ</span>
                                                            </div>
                                                        ) : numberDataToRender?.status === 'USED' ? (
                                                            <div className='flex'>
                                                                <div className='w-3 h-3 mt-8 mr-3 rounded-full bg-gray-500'></div>
                                                                <span>Đã sử dụng</span>
                                                            </div>
                                                        ) : (
                                                            <div className='flex'>
                                                                <div className='w-3 h-3 mt-8 mr-3 rounded-full bg-red-500'></div>
                                                                <span>Bỏ qua</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        {numberDataToRender?.phone}
                                                    </div>
                                                    <div>
                                                        {numberDataToRender?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={showNumberContainer}
                                className='flex text-[18px] flex-col transition-colors duration-300 group cursor-pointer hover:bg-orange-alta absolute right-0 justify-center items-center w-40 h-48 bg-orange-100 rounded-tl-2xl rounded-bl-2xl drop-shadow-xl shadow-xl'
                            >
                                <div className='w-11 h-11 absolute-center bg-orange-500 group-hover:bg-orange-100 rounded-xl hover:text-white'>
                                    <ArrowUturnLeftIcon className='w-6 h-6 stroke-orange-100 group-hover:stroke-orange-alta stroke-2' />
                                </div>
                                <div className='text-center font-medium text-orange-500 group-hover:text-orange-100 mt-4 w-36'>
                                    Quay lại
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

            )}
            {showContainer && <NumberContainer />}

        </>
    );
};

export default DetailDevice;
