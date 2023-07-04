import Loading from 'components/loading/Loading';
import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import NumberContainer from './NumberContainer';
import { Listbox, Transition } from '@headlessui/react';
import InformationModal from 'components/modal/InformationModal';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
import { firestore } from 'server/firebase';
import { toast } from 'react-hot-toast';
import NumberModal from 'components/modal/NumberModal';
import { NumberType } from 'types';
import Navbar from '../../partials/Navbar';
import User from '../../partials/User';


const AddNumber = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showAddNumber, setShowAddNumber] = useState(true);
    const [showNumberContainer, setShowNumberContainer] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [docData, setDocData] = useState<NumberType | null>(null);


    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const user = useSelector((state: RootState) => state.auth.user);

    const [isServiceSelected, setIsServiceSelected] = useState(false);

    const showAddNumberComponent = () => {
        setShowAddNumber(!showAddNumber);
        setShowNumberContainer(!showNumberContainer);
    };

    const [isSubmitted, setIsSubmitted] = useState(false);
    const services = ['Khám tim mạch', 'Khám sản - Phụ khoa', 'Khám răng hàm mặt', 'Khám tai mũi họng', 'Khám hô hấp', 'Khám tổng quát'];
    const [serviceSelect, setServiceSelect] = useState('');
    const [serviceOpen, setServiceOpen] = useState(false);
    const [displayRedBorder, setDisplayRedBorder] = useState(false);

    const handleSubmit = () => {
        if (!serviceSelect) {
            setServiceOpen(true);
            setIsServiceSelected(false);
            setDisplayRedBorder(true);
            return;
        }

        setDisplayRedBorder(false);

        if (!isLoggedIn) {
            setShowDialog(true);
            return;
        }

        if (serviceSelect) {
            setIsServiceSelected(true);
        }

        handleFormSubmit(user, 'Hệ thống');
    };

    const handleModalSubmit = (modalData: any) => {
        console.log(modalData);
        handleFormSubmit(modalData, 'Kiosk');
        setShowDialog(false);
    };


    const handleFormSubmit = async (user: any, source: string) => {
        setIsSubmitted(true);

        if (serviceSelect && user.fullName && user.phone) {
            setIsServiceSelected(true);
            try {
                setIsLoading(true);

                // Tạo số thứ tự từ 2010001 đến 2019999
                const counterRef = doc(firestore, 'counters', 'numberCounter');
                const counterSnap = await getDoc(counterRef);
                let number = 2010001;
                if (counterSnap.exists()) {
                    number = counterSnap.data().number + 1;
                }

                // Tăng số tự động
                await setDoc(counterRef, { number: number });

                const currentTime = new Date();

                // Tính toán thời gian hết hạn
                let expirationTime = new Date(currentTime);
                expirationTime.setHours(18, 0, 0, 0);

                if (currentTime.getHours() >= 18) {
                    expirationTime.setDate(expirationTime.getDate() + 1);
                }

                const data = {
                    fullName: user.fullName,
                    phone: user.phone,
                    email: user.email,
                    source,
                    status: 'WAITING',
                    serviceSelect,
                    number: String(number),
                    createdAt: serverTimestamp(),
                    expirationTime: Timestamp.fromDate(expirationTime),
                };

                const docRef = await addDoc(collection(firestore, 'numbers'), data);

                setIsLoading(false);
                fetchDocData(docRef.id);
                setShowResult(true);
                console.log('Document written with ID: ', docRef.id);
            } catch (error) {
                toast.error('Thêm dịch vụ thất bại');
                console.error('Error adding document: ', error);
            } finally {
                setIsLoading(false);

            }
        }
    };


    const fetchDocData = async (docId: string) => {
        setIsLoading(true);
        const docRef = doc(firestore, 'numbers', docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data) {
                const convertedData: NumberType = {
                    id: data.id as string,
                    fullName: data.fullName as string,
                    phone: data.phone as string,
                    email: data.email as string,
                    status: data.status as string,
                    createdAt: data.createdAt.toDate().toISOString(),
                    expirationTime: data.expirationTime.toDate().toISOString(),
                    serviceSelect: data.serviceSelect as string,
                    source: data.source as string,
                    number: data.number as string,
                };
                setDocData(convertedData as NumberType);
            }
        } else {
            setDocData(null);
        }
        setIsLoading(false);
    };


    return (
        <>
            {isLoading && <Loading />}
            <InformationModal
                onSubmit={handleModalSubmit}
                setShowDialog={setShowDialog}
                showDialog={showDialog}
            />
            {showAddNumber && (
                <>
                    <div className='full-size flex relative'>
                        {isLoggedIn && <Navbar />}
                        <div className='absolute top-2 z-30 right-2'>
                            {isLoggedIn && <User />}
                        </div>
                        <div className='w-full h-screen bg-gray-200'>
                            <div className='h-32 mx-12 flex items-center'>
                                <div className='text-gray-500 text-3xl font-bold font-primary'>
                                    Cấp số
                                </div>
                                <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                                {isLoggedIn ? (
                                    <div
                                        onClick={showAddNumberComponent}
                                        className='text-gray-500 cursor-pointer hover:text-orange-alta text-3xl font-bold font-primary'
                                    >
                                        Danh sách cấp số
                                    </div>
                                ) : (
                                    <div
                                        className='text-gray-500 text-3xl font-bold font-primary'
                                    >
                                        Danh sách cấp số
                                    </div>
                                )}
                                <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                                <div className='text-orange-alta text-3xl font-bold font-primary'>
                                    Cấp số mới
                                </div>
                            </div>
                            <div className='m-12 my-12 text-4xl font-extrabold font-primary text-orange-alta'>
                                Quản lý cấp số
                            </div>
                            <div className='w-[95%] ml-14 h-[80%] pb-4 rounded-3xl drop-shadow-xl shadow-xl bg-white'>
                                <div className='w-full flex-col flex items-center pt-8 pb-6 font-primary'>
                                    <div className='text-orange-alta uppercase mt-4 mb-16 text-6xl font-bold'>
                                        Cấp số mới
                                    </div>
                                    <div className='text-3xl font-bold'>
                                        Dịch vụ khách hàng lựa chọn
                                    </div>
                                </div>
                                <div className='flex w-full justify-center'>
                                    <div className='w-[400px] z-20'>
                                        <Listbox
                                            value={serviceSelect}
                                            onChange={(value) => {
                                                setServiceSelect(value);
                                                setServiceOpen(false);
                                            }}
                                        >
                                            {({ open }) => (
                                                <>
                                                    <Listbox.Button
                                                        className={`relative mt-4 rounded-xl w-full bg-white border-2 ${
                                                            displayRedBorder ? 'border-red-500' : 'border-gray-300'
                                                        } shadow-sm pl-6 pr-10 py-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-200 sm:text-sm ${
                                                            serviceOpen ? 'ring-orange-200 ring-2' : ''
                                                        }`}
                                                        onClick={() => setServiceOpen(!serviceOpen)}
                                                    >
                        <span
                            className={`text-[16px] py-2 h-full flex items-center ${
                                serviceSelect
                                    ? 'text-black'
                                    : isSubmitted
                                        ? 'text-gray-500'
                                        : 'text-gray-500'
                            }`}
                        >
                          {serviceSelect || 'Chọn dịch vụ'}
                        </span>
                                                        <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                          {serviceOpen ? (
                              <ChevronUpIcon className='w-8 h-8 stroke-2 stroke-orange-alta' />
                          ) : (
                              <ChevronDownIcon className='w-8 h-8 stroke-2 stroke-orange-alta' />
                          )}
                        </span>
                                                    </Listbox.Button>
                                                    <Transition
                                                        show={open}
                                                        enter='transition ease-out duration-100'
                                                        enterFrom='transform opacity-0 scale-95'
                                                        enterTo='transform opacity-100 scale-100'
                                                        leave='transition ease-in duration-75'
                                                        leaveFrom='transform opacity-100 scale-100'
                                                        leaveTo='transform opacity-0 scale-95'
                                                    >
                                                        <Listbox.Options
                                                            static
                                                            className='absolute mt-[1px] max-h-56 z-20 w-full text-3xl bg-white border border-gray-300 rounded-2xl shadow-lg overflow-auto focus:outline-none sm:text-sm'
                                                        >
                                                            {services.map((option) => (
                                                                <Listbox.Option
                                                                    key={option}
                                                                    value={option}
                                                                >
                                                                    {({ active, selected }) => (
                                                                        <div
                                                                            className={`cursor-pointer text-[16px] select-none relative py-3 pl-3 pr-9 ${
                                                                                active ? 'bg-orange-100 text-black' : ''
                                                                            }`}
                                                                        >
                                  <span
                                      className={`block text-[16px] py-3 truncate ${
                                          selected ? 'font-medium' : 'font-normal'
                                      }`}
                                  >
                                    {option}
                                  </span>
                                                                        </div>
                                                                    )}
                                                                </Listbox.Option>
                                                            ))}
                                                        </Listbox.Options>
                                                    </Transition>
                                                </>
                                            )}
                                        </Listbox>
                                    </div>
                                </div>
                                <div className='w-full mt-32 text-2xl justify-center flex space-x-12'>
                                    <button
                                        onClick={showAddNumberComponent}
                                        className='mt-6 w-[120px] rounded-xl h-[45px] bg-orange-100 border border-orange-alta text-orange-alta hover: font-secondary font-bold hover:bg-orange-alta hover:text-white'
                                    >
                                        Hủy bỏ
                                    </button>

                                    <button
                                        onClick={handleSubmit}
                                        type='submit'
                                        className='mt-6 w-[120px] rounded-xl h-[45px] border-orange-alta bg-orange-alta text-white font-secondary font-bold hover:bg-orange-100 border hover:border-orange-alta hover:text-orange-alta'
                                    >
                                        In số
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <NumberModal
                        showResult={showResult}
                        setShowResult={setShowResult}
                        resultData={docData}
                    />
                </>
            )}
            {showNumberContainer && <NumberContainer />}

        </>
    );
};

export default AddNumber;
