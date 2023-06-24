import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { NumberType } from 'types';
import { dateFormat1 } from '../../helper/dateFormat';

interface NumberModalProp {
    showResult: boolean;
    setShowResult: any;
    resultData: NumberType | null;
}

const NumberModal = ({ showResult, setShowResult, resultData }: NumberModalProp) => {


    return (
        <>
            <Transition.Root
                show={showResult}
                as={Fragment}
            >
                <Dialog
                    as='div'
                    className='fixed absolute-center flex-col z-40 inset-0 overflow-y-auto'
                    onClose={() => setShowResult(false)}
                >
                    <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                        <Transition.Child
                            as={Fragment}
                            enter='ease-out duration-300'
                            enterFrom='opacity-0'
                            enterTo='opacity-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                        >
                            <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
                        </Transition.Child>

                        <span
                            className='hidden sm:inline-block sm:align-middle sm:h-screen'
                            aria-hidden='true'
                        >
                        &#8203;
                    </span>

                        <Transition.Child
                            as={Fragment}
                            enter='ease-out duration-300'
                            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                            enterTo='opacity-100 translate-y-0 sm:scale-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                        >
                            <div className='inline-block flex-col align-bottom bg-white rounded-3xl text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-[500px] h-[400px]'>
                                <div className='bg-white w-full h-[280px] px-4 pt-5 pb-4 sm:p-6 sm:pb-4 absolute-center'>
                                    <div className='full-size flex flex-col'>
                                        <div className='w-full h-12 flex'>
                                            <div className='w-full'></div>
                                            <XMarkIcon
                                                onClick={() => setShowResult(!showResult)}
                                                className='w-12 hover:stroke-red-500 h-12 stroke-orange-400 stroke-2'
                                            />
                                        </div>
                                        <div className='w-full mt-6 text-5xl font-bold font-primary'>
                                            Số thứ tự được cấp
                                        </div>
                                        <div className='font-extrabold font-primary text-[5.5rem] text-orange-400 h-48 absolute-center'>{resultData?.number}</div>
                                        <span className='text-[19px]'>
                                            DV: {resultData?.serviceSelect}
                                            <span className='font-bold font-primary'> (tại quầy số 1)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className='w-full text-[22px] text-white font-bold font-primary absolute-center h-[120px] flex flex-col space-y-4 bg-orange-400'>
                                    <div>Thời gian cấp: {dateFormat1(resultData?.createdAt)}</div>
                                    <div>Hạn sử dụng: {dateFormat1(resultData?.expirationTime)}</div>

                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
};

export default NumberModal;
