import { ChevronDownIcon, ChevronRightIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Listbox, Transition } from '@headlessui/react';
import { useState } from 'react';

const NumberContainer = () => {
    const options = ['Tất cả', 'Hoạt động', 'Ngưng hoạt động'];
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className='w-full h-screen bg-gray-200'>
                <div className='h-32 mx-12 flex items-center mt-8'>
                    <div className='text-gray-500 text-3xl w-36 font-bold font-primary'>
                        Cấp số
                    </div>
                    <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                    <div className='text-orange-500 text-3xl w-96 font-bold font-primary'>
                        Danh sách cấp số
                    </div>
                </div>

                <div className='m-12 my-12 text-4xl font-extrabold font-primary text-orange-500'>
                    Quản lý cấp số
                </div>
                <div className='flex ml-12 mr-[135px] relative mb-12'>
                    <div className='w-[180px] z-20'>
                        <div className='text-3xl'>Tên dịch vụ</div>
                        <Listbox
                            value={selectedOption}
                            onChange={setSelectedOption}
                        >
                            {({ open }) => (
                                <>
                                    <Listbox.Button
                                        className='relative mt-4 rounded-xl w-full bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange-100 focus:border-orange-100 sm:text-sm'
                                        onClick={() => setIsOpen(!isOpen)}
                                    >
                                        <span className='block text-3xl truncate'>
                                            {selectedOption}
                                        </span>
                                        <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                                            <ChevronDownIcon className='w-8 h-8 stroke-2 stroke-orange-500' />
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
                                            className='absolute mt-1 w-full text-3xl bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm'
                                        >
                                            {options.map((option) => (
                                                <Listbox.Option
                                                    key={option}
                                                    value={option}
                                                >
                                                    {({ active, selected }) => (
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

                    <div className='w-[180px] ml-10 z-20'>
                        <div className='text-3xl'>Tình trạng</div>
                        <Listbox
                            value={selectedOption}
                            onChange={setSelectedOption}
                        >
                            {({ open }) => (
                                <>
                                    <Listbox.Button
                                        className='relative mt-4 rounded-xl w-full bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange-100 focus:border-orange-100 sm:text-sm'
                                        onClick={() => setIsOpen(!isOpen)}
                                    >
                                        <span className='block text-3xl truncate'>
                                            {selectedOption}
                                        </span>
                                        <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                                            <ChevronDownIcon className='w-8 h-8 stroke-2 stroke-orange-500' />
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
                                            className='absolute mt-1 w-full text-3xl bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm'
                                        >
                                            {options.map((option) => (
                                                <Listbox.Option
                                                    key={option}
                                                    value={option}
                                                >
                                                    {({ active, selected }) => (
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

                    <div className='w-[180px] ml-10 z-20'>
                        <div className='text-3xl'>Nguồn cấp</div>
                        <Listbox
                            value={selectedOption}
                            onChange={setSelectedOption}
                        >
                            {({ open }) => (
                                <>
                                    <Listbox.Button
                                        className='relative mt-4 rounded-xl w-full bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange-100 focus:border-orange-100 sm:text-sm'
                                        onClick={() => setIsOpen(!isOpen)}
                                    >
                                        <span className='block text-3xl truncate'>
                                            {selectedOption}
                                        </span>
                                        <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                                            <ChevronDownIcon className='w-8 h-8 stroke-2 stroke-orange-500' />
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
                                            className='absolute mt-1 w-full text-3xl bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm'
                                        >
                                            {options.map((option) => (
                                                <Listbox.Option
                                                    key={option}
                                                    value={option}
                                                >
                                                    {({ active, selected }) => (
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

                    <div className='w-[400px] ml-10 z-20 flex flex-col'>
                        <div className='text-3xl'>Chọn thời gian</div>
                        <div className='flex space-x-4'>
                            {' '}
                            <Listbox
                                value={selectedOption}
                                onChange={setSelectedOption}
                            >
                                {({ open }) => (
                                    <>
                                        <Listbox.Button
                                            className='relative mt-4 rounded-xl w-[180px] bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange-100 focus:border-orange-100 sm:text-sm'
                                            onClick={() => setIsOpen(!isOpen)}
                                        >
                                            <span className='block text-3xl truncate'>
                                                {selectedOption}
                                            </span>
                                            <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                                                <ChevronDownIcon className='w-8 h-8 stroke-2 stroke-orange-500' />
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
                                                className='absolute mt-1 w-[180px] text-3xl bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm'
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
                            <div className='absolute-center h-full'>
                                <ChevronRightIcon className='h-8 w-8 mt-4 stroke-gray-500' />
                            </div>
                            <Listbox
                                value={selectedOption}
                                onChange={setSelectedOption}
                            >
                                {({ open }) => (
                                    <>
                                        <Listbox.Button
                                            className='relative mt-4 rounded-xl w-[180px] bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange-100 focus:border-orange-100 sm:text-sm'
                                            onClick={() => setIsOpen(!isOpen)}
                                        >
                                            <span className='block text-3xl truncate'>
                                                {selectedOption}
                                            </span>
                                            <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                                                <ChevronDownIcon className='w-8 h-8 stroke-2 stroke-orange-500' />
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
                                                className='absolute mt-1 w-[180px] text-3xl bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm'
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

                    <div className='flex absolute right-2'>
                        <div className='w-[300px]'>
                            <div className='text-3xl'>Từ khóa</div>
                            <div className='h-16 relative'>
                                <input
                                    className='text-3xl w-full mt-4 rounded-2xl h-16 pl-6'
                                    placeholder='Nhập từ khóa'
                                    type='text'
                                />
                                <span className='absolute inset-y-0 top-1/2 mt-4 right-4 -translate-y-1/2 flex items-center pr-2 pointer-events-none'>
                                    <MagnifyingGlassIcon className='w-10 h-10 stroke-2 stroke-orange-500' />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mx-12 text-start flex text-3xl font-light font-primary'>
                    <table className='table-auto rounded-tl-2xl text-start drop-shadow-xl shadow-xl'>
                        <thead>
                        <tr className='rounded-tl-2xl h-24 font-bold bg-orange-500 text-white'>
                            <th className='border px-6 font-bold text-start rounded-tl-3xl'>
                                STT
                            </th>
                            <th className='border px-6 w-[250px] font-bold text-start'>
                                Tên khách hàng
                            </th>
                            <th className='border px-6 w-[250px] font-bold text-start'>
                                Tên dịch vụ
                            </th>
                            <th className='border px-6 font-bold text-start'>
                                Thời gian cấp
                            </th>
                            <th className='border px-6 font-bold text-start'>
                                Hạn sử dụng
                            </th>
                            <th className='border px-6 font-bold text-start'>
                                Trạng thái
                            </th>

                            <th className='border px-6 font-bold text-start'>
                                Nguồn cấp
                            </th>
                            <th className='border px-6 font-bold text-start rounded-tr-3xl'></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className='rounded-tl-2xl h-24 bg-white'>
                            <th className='border px-6 font-thin text-start '>
                                20100001
                            </th>
                            <th className='border w-[220px] px-6 font-thin text-start '>
                                Lê Huỳnh Ái Vân
                            </th>
                            <th className='border w-[220px] px-6 font-thin text-start '>
                                Khám tim mạch
                            </th>
                            <th className='border  px-6 font-thin text-start '>
                                14:35 - 07/11/2021
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                14:35 - 12/11/2021
                            </th>
                            <th className='border px-6 w-[160px] font-thin text-start '>
                                Đang chờ
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                Kiosk
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                Chi tiết
                            </th>
                        </tr>
                        {' '}
                        <tr className='rounded-tl-2xl h-24 bg-white'>
                            <th className='border px-6 font-thin text-start '>
                                20100001
                            </th>
                            <th className='border w-[220px] px-6 font-thin text-start '>
                                Lê Huỳnh Ái Vân
                            </th>
                            <th className='border w-[220px] px-6 font-thin text-start '>
                                Khám tim mạch
                            </th>
                            <th className='border  px-6 font-thin text-start '>
                                14:35 - 07/11/2021
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                14:35 - 12/11/2021
                            </th>
                            <th className='border px-6 w-[160px] font-thin text-start '>
                                Đang chờ
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                Kiosk
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                Chi tiết
                            </th>
                        </tr>
                        {' '}
                        <tr className='rounded-tl-2xl h-24 bg-white'>
                            <th className='border px-6 font-thin text-start '>
                                20100001
                            </th>
                            <th className='border w-[220px] px-6 font-thin text-start '>
                                Lê Huỳnh Ái Vân
                            </th>
                            <th className='border w-[220px] px-6 font-thin text-start '>
                                Khám tim mạch
                            </th>
                            <th className='border  px-6 font-thin text-start '>
                                14:35 - 07/11/2021
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                14:35 - 12/11/2021
                            </th>
                            <th className='border px-6 w-[160px] font-thin text-start '>
                                Đang chờ
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                Kiosk
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                Chi tiết
                            </th>
                        </tr>
                        {' '}
                        <tr className='rounded-tl-2xl h-24 bg-white'>
                            <th className='border px-6 font-thin text-start '>
                                20100001
                            </th>
                            <th className='border w-[220px] px-6 font-thin text-start '>
                                Lê Huỳnh Ái Vân
                            </th>
                            <th className='border w-[220px] px-6 font-thin text-start '>
                                Khám tim mạch
                            </th>
                            <th className='border  px-6 font-thin text-start '>
                                14:35 - 07/11/2021
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                14:35 - 12/11/2021
                            </th>
                            <th className='border px-6 w-[160px] font-thin text-start '>
                                Đang chờ
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                Kiosk
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                Chi tiết
                            </th>
                        </tr>
                        {' '}
                        <tr className='rounded-tl-2xl h-24 bg-white'>
                            <th className='border px-6 font-thin text-start '>
                                20100001
                            </th>
                            <th className='border w-[220px] px-6 font-thin text-start '>
                                Lê Huỳnh Ái Vân
                            </th>
                            <th className='border w-[220px] px-6 font-thin text-start '>
                                Khám tim mạch
                            </th>
                            <th className='border  px-6 font-thin text-start '>
                                14:35 - 07/11/2021
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                14:35 - 12/11/2021
                            </th>
                            <th className='border px-6 w-[160px] font-thin text-start '>
                                Đang chờ
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                Kiosk
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                Chi tiết
                            </th>
                        </tr>
                        {' '}
                        <tr className='rounded-tl-2xl h-24 bg-white'>
                            <th className='border px-6 font-thin text-start '>
                                20100001
                            </th>
                            <th className='border w-[220px] px-6 font-thin text-start '>
                                Lê Huỳnh Ái Vân
                            </th>
                            <th className='border w-[220px] px-6 font-thin text-start '>
                                Khám tim mạch
                            </th>
                            <th className='border  px-6 font-thin text-start '>
                                14:35 - 07/11/2021
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                14:35 - 12/11/2021
                            </th>
                            <th className='border px-6 w-[160px] font-thin text-start '>
                                Đang chờ
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                Kiosk
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                Chi tiết
                            </th>
                        </tr>
                        {' '}
                        <tr className='rounded-tl-2xl h-24 bg-white'>
                            <th className='border px-6 font-thin text-start '>
                                20100001
                            </th>
                            <th className='border w-[220px] px-6 font-thin text-start '>
                                Lê Huỳnh Ái Vân
                            </th>
                            <th className='border w-[220px] px-6 font-thin text-start '>
                                Khám tim mạch
                            </th>
                            <th className='border  px-6 font-thin text-start '>
                                14:35 - 07/11/2021
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                14:35 - 12/11/2021
                            </th>
                            <th className='border px-6 w-[160px] font-thin text-start '>
                                Đang chờ
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                Kiosk
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                Chi tiết
                            </th>
                        </tr>
                        {' '}
                        <tr className='rounded-tl-2xl h-24 bg-white'>
                            <th className='border px-6 font-thin text-start '>
                                20100001
                            </th>
                            <th className='border w-[220px] px-6 font-thin text-start '>
                                Lê Huỳnh Ái Vân
                            </th>
                            <th className='border w-[220px] px-6 font-thin text-start '>
                                Khám tim mạch
                            </th>
                            <th className='border  px-6 font-thin text-start '>
                                14:35 - 07/11/2021
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                14:35 - 12/11/2021
                            </th>
                            <th className='border px-6 w-[160px] font-thin text-start '>
                                Đang chờ
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                Kiosk
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                Chi tiết
                            </th>
                        </tr>
                        {' '}
                        <tr className='rounded-tl-2xl h-24 bg-white'>
                            <th className='rounded-bl-3xl px-6 font-thin text-start '>
                                20100001
                            </th>
                            <th className='border w-[220px] px-6 font-thin text-start '>
                                Lê Huỳnh Ái Vân
                            </th>
                            <th className='border w-[220px] px-6 font-thin text-start '>
                                Khám tim mạch
                            </th>
                            <th className='border  px-6 font-thin text-start '>
                                14:35 - 07/11/2021
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                14:35 - 12/11/2021
                            </th>
                            <th className='border px-6 w-[160px] font-thin text-start '>
                                Đang chờ
                            </th>
                            <th className='border px-6 font-thin text-start '>
                                Kiosk
                            </th>
                            <th className='rounded-br-3xl px-6 font-thin text-start '>
                                Chi tiết
                            </th>
                        </tr>
                        {' '}
                        </tbody>
                    </table>
                    <div className='flex flex-col absolute right-0 justify-center items-center w-40 h-48 bg-orange-100 rounded-tl-2xl rounded-bl-2xl drop-shadow-xl shadow-xl'>
                        <div className='w-11 h-11 absolute-center bg-orange-500 rounded-xl'>
                            <PlusIcon className='w-8 h-8 stroke-white stroke-2' />
                        </div>
                        <div className='text-center text-orange-500 mt-4 w-36'>
                            Cấp
                        </div>
                        <div className='text-center text-orange-500 w-36'>
                            số mới
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NumberContainer;
