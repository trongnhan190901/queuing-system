import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import ServiceContainer from './ServiceContainer';
import { firestore } from '../../../server/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const AddService = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [serviceCode, setServiceCode] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [description, setDescription] = useState('');

    const [showAddService, setShowAddService] = useState(true);
    const [showContainer, setShowContainer] = useState(false);

    const showAddServiceComponent = () => {
        setShowContainer(!showContainer);
        setShowAddService(!showAddService);
    };

    const [enableEditNumber, setEnableEditNumber] = useState(false);
    const [enableEditPrefix, setEnablePrefix] = useState(false);
    const [enableEditSurfix, setEnableEditSurfix] = useState(false);
    const [enableEditReset, setEnableEditReset] = useState(false);

    const [startValueNumber, setStartValueNumber] = useState('0001');
    const [startValuePrefix, setStartValuePrefix] = useState('0001');
    const [startValueSurfix, setStartValueSurfix] = useState('0001');

    const [endValueNumber, setEndValueNumber] = useState('9999');

    const handleEnableEditChange = (index: number) => {
        switch (index) {
            case 0:
                setEnableEditNumber(!enableEditNumber);
                break;
            case 1:
                setEnablePrefix(!enableEditPrefix);
                break;
            case 2:
                setEnableEditSurfix(!enableEditSurfix);
                break;
            case 3:
                setEnableEditReset(!enableEditReset);
                break;
            default:
                break;
        }
    };

    const handleStartValueChange = (event: any, index: number) => {
        switch (index) {
            case 0:
                setStartValueNumber(event.target.value);
                break;
            case 1:
                setStartValuePrefix(event.target.value);
                break;
            case 2:
                setStartValueSurfix(event.target.value);
                break;
            default:
                break;
        }
    };

    const handleEndValueChange = (event: any) => {
        setEndValueNumber(event.target.value);
    };

    const handleFormSubmit = async () => {
        setIsSubmitted(true);

        if (serviceCode && serviceName && description) {
            try {
                const data: any = {
                    serviceCode,
                    serviceName,
                    description,
                    enableEditNumber,
                    startValueNumber,
                    endValueNumber,
                    enableEditPrefix,
                    startValuePrefix,
                    enableEditSurfix,
                    startValueSurfix,
                    enableEditReset,
                    active: true,
                    createdAt: serverTimestamp(),
                };

                const docRef = await addDoc(
                    collection(firestore, 'services'),
                    data,
                );

                toast.success('Thêm dịch vụ thành công');
                console.log('Document written with ID: ', docRef.id);
            } catch (error) {
                toast.error('Thêm dịch vụ thất bại');
                console.error('Error adding document: ', error);
            }
        }
    };

    return (
        <>
            {showAddService && (
                <>
                    <div className="h-32 mx-12 flex items-center">
                        <div className="text-gray-500 text-3xl font-bold font-primary">
                            Dịch vụ
                        </div>
                        <ChevronRightIcon className="h-8 w-8 mx-6 stroke-gray-500" />
                        <div
                            onClick={showAddServiceComponent}
                            className="text-gray-500 cursor-pointer hover:text-orange-alta text-3xl font-bold font-primary"
                        >
                            Danh sách dịch vụ
                        </div>
                        <ChevronRightIcon className="h-8 w-8 mx-6 stroke-gray-500" />
                        <div className="text-orange-alta text-3xl font-bold font-primary">
                            Thêm dịch vụ
                        </div>
                    </div>
                    <div className="m-12 my-12 text-4xl font-extrabold font-primary text-orange-alta">
                        Quản lý dịch vụ
                    </div>
                    <div className="w-[95%] ml-14 h-[590px] pb-24 rounded-3xl drop-shadow-xl shadow-xl bg-white">
                        <div className="mx-14 pt-8 pb-24">
                            <div className="text-orange-alta text-[22px] font-bold font-primary">
                                Thông tin dịch vụ
                            </div>
                            <div className="mt-12 full-size">
                                <div className="flex space-x-8">
                                    <div className="flex w-full text-[16px] flex-col space-y-6">
                                        <div className="flex font-primary flex-col space-y-2">
                                            <label className="flex font-bold items-center space-x-2">
                                                <span>Mã dịch vụ:</span>
                                                <span className="text-red-500 mt-3 text-3xl">
                                                    {' '}
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                placeholder="Nhập mã dịch vụ"
                                                type="text"
                                                className={`w-[96%] focus:outline-none h-[40px] border rounded-xl px-6 ${
                                                    isSubmitted && !serviceCode
                                                        ? 'border-red-500'
                                                        : ''
                                                }`}
                                                value={serviceCode}
                                                onChange={(e) =>
                                                    setServiceCode(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex font-primary flex-col space-y-2">
                                            <label className="flex font-bold items-center space-x-2">
                                                <span>Tên dịch vụ:</span>
                                                <span className="text-red-500 mt-3 text-3xl">
                                                    {' '}
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                placeholder="Nhập tên dịch vụ"
                                                type="text"
                                                className={`w-[96%] focus:outline-none h-[40px] border rounded-xl px-6 ${
                                                    isSubmitted && !serviceName
                                                        ? 'border-red-500'
                                                        : ''
                                                }`}
                                                value={serviceName}
                                                onChange={(e) =>
                                                    setServiceName(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex w-full text-[16px] flex-col space-y-6">
                                        <div className="flex font-primary flex-col space-y-2">
                                            <label className="flex font-bold items-center space-x-2">
                                                <span>Mô tả:</span>
                                                <span className="text-red-500 mt-3 text-3xl">
                                                    {' '}
                                                    *
                                                </span>
                                            </label>
                                            <textarea
                                                placeholder="Mô tả dịch vụ"
                                                rows={4}
                                                className={`w-[96%] focus:outline-none h-[130px] border-gray-300 border rounded-xl py-2 px-6 ${
                                                    isSubmitted && !description
                                                        ? 'border-red-500'
                                                        : ''
                                                }`}
                                                value={description}
                                                onChange={(e) =>
                                                    setDescription(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full font-primary text-[16px] mt-6">
                                    <div className="flex  flex-col space-y-2">
                                        <div className="text-orange-alta text-[22px] font-bold font-primary">
                                            Quy tắc cấp số
                                        </div>
                                        <div className="flex text-[16px] h-20 items-center">
                                            <input
                                                type="checkbox"
                                                className="appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500"
                                                checked={enableEditNumber}
                                                onChange={() =>
                                                    handleEnableEditChange(0)
                                                }
                                            />
                                            <div className="mx-4 font-bold">
                                                Tăng tự động từ:
                                            </div>
                                            <input
                                                type="text"
                                                className="focus:outline-none h-[40px] border rounded-xl px-4 w-24"
                                                value={startValueNumber}
                                                onChange={(event) =>
                                                    handleStartValueChange(
                                                        event,
                                                        0,
                                                    )
                                                }
                                                readOnly={!enableEditNumber}
                                            />
                                            <div className="mx-4 font-bold">
                                                đến
                                            </div>
                                            <input
                                                type="text"
                                                className="focus:outline-none h-[40px] border rounded-xl px-4 w-24"
                                                value={endValueNumber}
                                                onChange={handleEndValueChange}
                                                readOnly={!enableEditNumber}
                                            />
                                        </div>

                                        <div className="flex text-[16px] h-20 items-center">
                                            <input
                                                type="checkbox"
                                                className="appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500"
                                                checked={enableEditPrefix}
                                                onChange={() =>
                                                    handleEnableEditChange(1)
                                                }
                                            />
                                            <div className="mx-4 font-bold">
                                                Prefix:
                                            </div>
                                            <input
                                                type="text"
                                                className="focus:outline-none ml-[7.5rem] h-[40px] border rounded-xl px-4 w-24"
                                                value={
                                                    enableEditPrefix
                                                        ? startValuePrefix
                                                        : '0001'
                                                }
                                                onChange={(event) =>
                                                    handleStartValueChange(
                                                        event,
                                                        1,
                                                    )
                                                }
                                                readOnly={!enableEditPrefix}
                                            />
                                        </div>

                                        <div className="flex text-[16px] h-20 items-center">
                                            <input
                                                type="checkbox"
                                                className="appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500"
                                                checked={enableEditSurfix}
                                                onChange={() =>
                                                    handleEnableEditChange(2)
                                                }
                                            />
                                            <div className="mx-4 font-bold">
                                                Surfix:
                                            </div>
                                            <input
                                                type="text"
                                                className="focus:outline-none ml-[7.5rem] h-[40px] border rounded-xl px-4 w-24"
                                                value={
                                                    enableEditSurfix
                                                        ? startValueSurfix
                                                        : '0001'
                                                }
                                                onChange={(event) =>
                                                    handleStartValueChange(
                                                        event,
                                                        2,
                                                    )
                                                }
                                                readOnly={!enableEditSurfix}
                                            />
                                        </div>

                                        <div className="flex text-[16px] h-20 items-center">
                                            <input
                                                type="checkbox"
                                                className="appearance-none w-9 h-9 border-2 border-blue-500 rounded-lg checked:bg-blue-500 checked:border-blue-500"
                                                checked={enableEditReset}
                                                onChange={() =>
                                                    handleEnableEditChange(3)
                                                }
                                            />
                                            <div className="mx-4 font-bold">
                                                Reset mỗi ngày
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center text-[15px] mt-4 space-x-1">
                                    <span className="text-red-500 font-bold mt-3 text-3xl">
                                        *{' '}
                                    </span>
                                    <span>Là trường thông tin bắt buộc</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full text-2xl justify-center flex space-x-6">
                            <button
                                onClick={showAddServiceComponent}
                                className="mt-6 w-[150px] rounded-xl h-[45px] bg-orange-100 border border-orange-alta text-orange-alta hover: font-secondary font-bold hover:bg-orange-alta hover:text-white"
                            >
                                Hủy bỏ
                            </button>

                            <button
                                onClick={handleFormSubmit}
                                type="submit"
                                className="mt-6 w-[150px] rounded-xl h-[45px] border-orange-alta bg-orange-alta text-white font-secondary font-bold hover:bg-orange-100 border hover:border-orange-alta hover:text-orange-alta"
                            >
                                Thêm dịch vụ
                            </button>
                        </div>
                    </div>
                </>
            )}
            {showContainer && <ServiceContainer />}
        </>
    );
};

export default AddService;
