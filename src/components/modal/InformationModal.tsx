import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

const InformationModal = ({ showDialog, setShowDialog }: any) => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [backupEmail, setBackupEmail] = useState('');
    const [isFullNameEmpty, setIsFullNameEmpty] = useState(false);
    const [isPhoneEmpty, setIsPhoneEmpty] = useState(false);

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //
    //     if (!fullName) {
    //         setIsFullNameEmpty(true);
    //     }
    //     if (!phone) {
    //         setIsPhoneEmpty(true);
    //     }
    //
    //     try {
    //         if (fullName && phone) {
    //             const user = auth.currentUser;
    //             if (user) {
    //                 const userDocRef = doc(firestore, 'users', user.uid);
    //                 const userDocSnap = await getDoc(userDocRef);
    //
    //                 if (userDocSnap.exists()) {
    //                     // Update the user document in Firestore with the new information
    //                     await setDoc(
    //                         userDocRef,
    //                         {
    //                             fullName: fullName,
    //                             phone: phone,
    //                             backupEmail: backupEmail,
    //                         },
    //                         { merge: true },
    //                     );
    //                 } else {
    //                     console.log('User document does not exist.');
    //                 }
    //
    //                 // Reset the form inputs
    //                 setFullName('');
    //                 setPhone('');
    //                 setBackupEmail('');
    //
    //                 // Close the dialog
    //                 setShowDialog(false);
    //             } else {
    //                 console.log('User is null.');
    //             }
    //         } else {
    //             console.log(
    //                 'Required information is missing. Cannot submit the form.',
    //             );
    //         }
    //     } catch (error) {
    //         console.error('Error submitting user information:', error);
    //     }
    // };

    return (
        <Transition.Root
            show={showDialog}
            as={Fragment}
        >
            <Dialog
                as='div'
                className='fixed absolute-center flex-col z-40 inset-0 overflow-y-auto'
                onClose={() => setShowDialog(false)}
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
                        <div className='inline-block flex-col align-bottom bg-white rounded-3xl text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-[500px] h-[500px]'>
                            {/* Modal content */}
                            {/* Replace the content below with your desired modal content */}
                            <div className='bg-white w-full px-4 pt-5 pb-4 sm:p-6 sm:pb-4 absolute-center'>
                                <div className='absolute-center'>
                                    <div className='mt-3 absolute-center flex-col'>
                                        <Dialog.Title
                                            as='h3'
                                            className='text-center h-20 absolute-center w-full text-4xl font-bold text-orange-alta leading-6 '
                                        >
                                            Điền thông tin của bạn
                                        </Dialog.Title>
                                        <div className='mt-16 text-2xl flex flex-col'>
                                            <div className='flex flex-col '>
                                                <label className='flex items-center space-x-1'>
                                                    <span>Họ và tên</span>
                                                    <span className='text-red-500 mt-3 text-3xl'>
                                                        {' '}
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type='text'
                                                    value={fullName}
                                                    onChange={(e) =>
                                                        setFullName(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`w-[400px] h-[40px] border rounded-xl px-6 ${
                                                        isFullNameEmpty
                                                            ? 'border-red-500'
                                                            : ''
                                                    }`}
                                                />
                                            </div>
                                            {' '}
                                            <div className='flex flex-col mt-3'>
                                                <label className='flex items-center space-x-1'>
                                                    <span>Số điện thoại</span>
                                                    <span className='text-red-500 mt-3 text-3xl'>
                                                        {' '}
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type='text'
                                                    value={phone}
                                                    onChange={(e) =>
                                                        setPhone(e.target.value)
                                                    }
                                                    className={`w-[400px] h-[40px] border rounded-xl px-6 ${
                                                        isPhoneEmpty
                                                            ? 'border-red-500'
                                                            : ''
                                                    }`}
                                                />
                                            </div>
                                            {' '}
                                            <div className='flex flex-col mt-3'>
                                                <label className='flex items-center space-x-1 mb-2'>
                                                    <span>Email</span>
                                                </label>
                                                <input
                                                    type='text'
                                                    value={backupEmail}
                                                    onChange={(e) =>
                                                        setBackupEmail(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className='w-[400px] h-[40px] border rounded-xl px-6'
                                                />
                                            </div>
                                            <div className='flex items-center space-x-1'>
                                                <span className='text-red-500 mt-3 text-3xl'>
                                                    *{' '}
                                                </span>
                                                <span>
                                                    Là trường thông tin bắt buộc
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal actions */}
                            {/* Replace the content below with your desired modal actions */}
                            <div className='absolute-center space-x-4 w-full text-2xl'>
                                <button
                                    onClick={() => setShowDialog(false)}
                                    className='mt-6 w-[150px] rounded-xl h-[40px] bg-white border border-orange-500 text-orange-500 hover: font-secondary hover:bg-orange-500 hover:text-white'
                                >
                                    Hủy
                                </button>

                                <button
                                    type='submit'
                                    // onClick={handleSubmit}
                                    className='mt-6 w-[150px] rounded-xl h-[40px] border-orange-500 bg-orange-500 text-white font-secondary hover:bg-white border hover:border-orange-500 hover:text-orange-500'
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default InformationModal;
