/* eslint-disable jsx-a11y/anchor-is-valid */
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Listbox, Transition } from '@headlessui/react';
import { useState, Fragment } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { FolderArrowDownIcon } from '@heroicons/react/24/solid';
import User from '../partials/User';

const ReportContainer = () => {
    const options = ['Tất cả', 'Hoạt động', 'Ngưng hoạt động'];
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="w-full h-screen bg-gray-200">
                <div className="h-32 mx-12 flex items-center mt-8">
                    <div className="text-gray-500 text-3xl w-36 font-bold font-primary">
                        Báo cáo
                    </div>
                    <ChevronRightIcon className="h-8 w-8 mx-6 stroke-gray-500" />
                    <div className="text-orange-500 text-3xl w-96 font-bold font-primary">
                        Lập báo cáo
                    </div>
                    <div className="w-full flex justify-end">
                        <User />
                    </div>
                </div>

                <div className="flex my-12 mr-72">
                    <div className="w-[400px] ml-10 z-20 flex flex-col">
                        <div className="text-3xl">Chọn thời gian</div>
                        <div className="flex space-x-4">
                            {' '}
                            <Listbox
                                value={selectedOption}
                                onChange={setSelectedOption}
                            >
                                {({ open }) => (
                                    <>
                                        <Listbox.Button
                                            className="relative mt-4 rounded-xl w-[180px] bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange-100 focus:border-orange-100 sm:text-sm"
                                            onClick={() => setIsOpen(!isOpen)}
                                        >
                                            <span className="block text-3xl truncate">
                                                {selectedOption}
                                            </span>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <ChevronDownIcon className="w-8 h-8 stroke-2 stroke-orange-500" />
                                            </span>
                                        </Listbox.Button>
                                        <Transition
                                            show={open}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Listbox.Options
                                                static
                                                className="absolute mt-1 w-[180px] text-3xl bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm"
                                            >
                                                {options.map((option) => (
                                                    <Listbox.Option
                                                        key={option}
                                                        value={option}
                                                    >
                                                        {({
                                                            active,
                                                            selected,
                                                        }) => (
                                                            <div
                                                                className={`cursor-default text-3xl select-none relative py-3 pl-3 pr-9 ${
                                                                    active
                                                                        ? 'bg-orange-100 text-black'
                                                                        : ''
                                                                }`}
                                                            >
                                                                <span
                                                                    className={`block text-2xl truncate ${
                                                                        selected
                                                                            ? 'font-medium'
                                                                            : 'font-normal'
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
                            <div className="absolute-center h-full">
                                <ChevronRightIcon className="h-8 w-8 mt-4 stroke-gray-500" />
                            </div>
                            <Listbox
                                value={selectedOption}
                                onChange={setSelectedOption}
                            >
                                {({ open }) => (
                                    <>
                                        <Listbox.Button
                                            className="relative mt-4 rounded-xl w-[180px] bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange-100 focus:border-orange-100 sm:text-sm"
                                            onClick={() => setIsOpen(!isOpen)}
                                        >
                                            <span className="block text-3xl truncate">
                                                {selectedOption}
                                            </span>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <ChevronDownIcon className="w-8 h-8 stroke-2 stroke-orange-500" />
                                            </span>
                                        </Listbox.Button>
                                        <Transition
                                            show={open}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Listbox.Options
                                                static
                                                className="absolute mt-1 w-[180px] text-3xl bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm"
                                            >
                                                {options.map((option) => (
                                                    <Listbox.Option
                                                        key={option}
                                                        value={option}
                                                    >
                                                        {({
                                                            active,
                                                            selected,
                                                        }) => (
                                                            <div
                                                                className={`cursor-default text-3xl select-none relative py-3 pl-3 pr-9 ${
                                                                    active
                                                                        ? 'bg-orange-100 text-black'
                                                                        : ''
                                                                }`}
                                                            >
                                                                <span
                                                                    className={`block text-2xl truncate ${
                                                                        selected
                                                                            ? 'font-medium'
                                                                            : 'font-normal'
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
                </div>

                <div className="mx-12 text-start flex text-3xl font-light font-primary">
                    <table className="table-auto rounded-tl-2xl text-start drop-shadow-xl shadow-xl">
                        <thead>
                            <tr className="rounded-tl-2xl h-24 font-bold bg-orange-500 text-white">
                                <th className="border relative px-6 w-[280px] font-bold text-start rounded-tl-3xl">
                                    Số thứ tự
                                    <span className="absolute inset-y-0 right-4 flex items-center pr-2 pointer-events-none">
                                        <svg
                                            className="h-10 w-10 text-white"
                                            fill="none"
                                            viewBox="0 0 20 20"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                            />
                                        </svg>
                                    </span>
                                </th>
                                <th className="border relative w-[280px] px-6 font-bold text-start">
                                    Tên dịch vụ
                                    <span className="absolute inset-y-0 right-4 flex items-center pr-2 pointer-events-none">
                                        <svg
                                            className="h-10 w-10 text-white"
                                            fill="none"
                                            viewBox="0 0 20 20"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                            />
                                        </svg>
                                    </span>
                                </th>
                                <th className="border px-6 relative w-[280px] font-bold text-start">
                                    Thời gian cấp
                                    <span className="absolute inset-y-0 right-4 flex items-center pr-2 pointer-events-none">
                                        <svg
                                            className="h-10 w-10 text-white"
                                            fill="none"
                                            viewBox="0 0 20 20"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                            />
                                        </svg>
                                    </span>
                                </th>
                                <th className="border relative px-6w-[280px] font-bold text-start">
                                    Tình trạng
                                    <span className="absolute inset-y-0 right-4 flex items-center pr-2 pointer-events-none">
                                        <svg
                                            className="h-10 w-10 text-white"
                                            fill="none"
                                            viewBox="0 0 20 20"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                            />
                                        </svg>
                                    </span>
                                </th>

                                <th className="border relative rounded-tr-3xl px-6 w-[280px] font-bold text-start">
                                    Nguồn cấp
                                    <span className="absolute inset-y-0 right-4 flex items-center pr-2 pointer-events-none">
                                        <svg
                                            className="h-10 w-10 text-white"
                                            fill="none"
                                            viewBox="0 0 20 20"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                            />
                                        </svg>
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="rounded-tl-2xl h-24 bg-white">
                                <th className="border px-6 w-[280px] font-thin text-start ">
                                    20100001
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    Khám tim mạch
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    07:20 - 07/10/2021
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    Đang chờ
                                </th>
                                <th className="border px-6 w-[280px] font-thin text-start ">
                                    Kiosk
                                </th>
                            </tr>{' '}
                            <tr className="rounded-tl-2xl h-24 bg-white">
                                <th className="border px-6 w-[280px] font-thin text-start ">
                                    20100001
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    Khám tim mạch
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    07:20 - 07/10/2021
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    Đang chờ
                                </th>
                                <th className="border px-6 w-[280px] font-thin text-start ">
                                    Kiosk
                                </th>
                            </tr>{' '}
                            <tr className="rounded-tl-2xl h-24 bg-white">
                                <th className="border px-6 w-[280px] font-thin text-start ">
                                    20100001
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    Khám tim mạch
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    07:20 - 07/10/2021
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    Đang chờ
                                </th>
                                <th className="border px-6 w-[280px] font-thin text-start ">
                                    Kiosk
                                </th>
                            </tr>{' '}
                            <tr className="rounded-tl-2xl h-24 bg-white">
                                <th className="border px-6 w-[280px] font-thin text-start ">
                                    20100001
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    Khám tim mạch
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    07:20 - 07/10/2021
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    Đang chờ
                                </th>
                                <th className="border px-6 w-[280px] font-thin text-start ">
                                    Kiosk
                                </th>
                            </tr>{' '}
                            <tr className="rounded-tl-2xl h-24 bg-white">
                                <th className="border px-6 w-[280px] font-thin text-start ">
                                    20100001
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    Khám tim mạch
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    07:20 - 07/10/2021
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    Đang chờ
                                </th>
                                <th className="border px-6 w-[280px] font-thin text-start ">
                                    Kiosk
                                </th>
                            </tr>{' '}
                            <tr className="rounded-tl-2xl h-24 bg-white">
                                <th className="border px-6 w-[280px] font-thin text-start ">
                                    20100001
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    Khám tim mạch
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    07:20 - 07/10/2021
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    Đang chờ
                                </th>
                                <th className="border px-6 w-[280px] font-thin text-start ">
                                    Kiosk
                                </th>
                            </tr>{' '}
                            <tr className="rounded-tl-2xl h-24 bg-white">
                                <th className="border px-6 w-[280px] font-thin text-start ">
                                    20100001
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    Khám tim mạch
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    07:20 - 07/10/2021
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    Đang chờ
                                </th>
                                <th className="border px-6 w-[280px] font-thin text-start ">
                                    Kiosk
                                </th>
                            </tr>{' '}
                            <tr className="rounded-tl-2xl h-24 bg-white">
                                <th className="border px-6 w-[280px] font-thin text-start ">
                                    20100001
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    Khám tim mạch
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    07:20 - 07/10/2021
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    Đang chờ
                                </th>
                                <th className="border px-6 w-[280px] font-thin text-start ">
                                    Kiosk
                                </th>
                            </tr>{' '}
                            <tr className="rounded-tl-2xl h-24 bg-white">
                                <th className="rounded-bl-3xl px-6 w-[280px] font-thin text-start ">
                                    20100001
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    Khám tim mạch
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    07:20 - 07/10/2021
                                </th>
                                <th className="border w-[280px] px-6 font-thin text-start ">
                                    Đang chờ
                                </th>
                                <th className="px-6 w-[280px] rounded-br-3xl font-thin text-start ">
                                    Kiosk
                                </th>
                            </tr>{' '}
                        </tbody>
                    </table>
                    <div className="flex flex-col absolute right-0 justify-center items-center w-40 h-48 bg-orange-100 rounded-tl-2xl rounded-bl-2xl drop-shadow-xl shadow-xl">
                        <FolderArrowDownIcon className="w-14 h-14  fill-orange-500 stroke-2" />

                        <div className="text-center text-orange-500 mt-4 w-36">
                            Tải về
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReportContainer;
