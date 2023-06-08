/* eslint-disable jsx-a11y/anchor-is-valid */
import { Listbox, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    MagnifyingGlassIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';
import AddDevice from './AddDevice';
import { firestore } from '../../../server/firebase';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import DetailDevice from './DetailDevice';
import UpdateDevice from './UpdateDevice';
import ReactPaginate from 'react-paginate';
import React from 'react';

interface Device {
    id: string;
    deviceCode: string;
    active: boolean;
    connect: boolean;
    deviceName: string;
    deviceTypeSelect: string;
    username: string;
    password: string;
    ipAddress: string;
    serviceUse: string;
}

const DeviceContainer = () => {
    const activeStatus = ['Tất cả', 'Hoạt động', 'Ngưng hoạt động'];
    const [activeStatusSelect, setActiveStatusSelect] = useState(
        activeStatus[0],
    );

    const connectStatus = ['Tất cả', 'Kết nối', 'Mất kết nối'];
    const [connectStatusSelect, setConnectStatusSelect] = useState(
        connectStatus[0],
    );
    const [activeOpen, setActiveOpen] = useState(false);
    const [connectOpen, setConnectOpen] = useState(false);
    const [isParentVisible, setIsParentVisible] = useState(true);
    const [showAddDevice, setShowAddDevice] = useState(false);
    const [showDetailDevice, setShowDetailDevice] = useState(false);
    const [showUpdateDevice, setShowUpdateDevice] = useState(false);

    const showAddDeviceComponent = () => {
        setIsParentVisible(!isParentVisible);
        setShowAddDevice(!showAddDevice);
    };

    const [deviceData, setDeviceData] = useState<Device | null>(null);
    const [deviceId, setDeviceId] = useState('');

    const showDetailDeviceComponent = async (id: string) => {
        try {
            const deviceRef = doc(firestore, 'devices', id);
            const deviceSnapshot = await getDoc(deviceRef);
            const deviceData = deviceSnapshot.data() as Device | null;

            setDeviceData(deviceData);
            setDeviceId(id);

            setIsParentVisible(!isParentVisible);
            setShowDetailDevice(!showDetailDevice);
        } catch (error) {
            console.log('Error fetching device data:', error);
        }
    };

    const showUpdateDeviceComponent = async (id: string) => {
        try {
            const deviceRef = doc(firestore, 'devices', id);
            const deviceSnapshot = await getDoc(deviceRef);
            const deviceData = deviceSnapshot.data() as Device | null;

            setDeviceData(deviceData);
            setDeviceId(id);

            setIsParentVisible(!isParentVisible);
            setShowUpdateDevice(!showUpdateDevice);
        } catch (error) {
            console.log('Error fetching device data:', error);
        }
    };

    const [devices, setDevices] = useState<Device[]>([]);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const devicesRef = collection(firestore, 'devices');
                const querySnapshot = await getDocs(devicesRef);
                const devicesData = querySnapshot.docs.map((doc) => {
                    const deviceData = doc.data() as Device;
                    const deviceId = doc.id;
                    return { ...deviceData, id: deviceId };
                });
                setDevices(devicesData);
                console.log(devicesData);
            } catch (error) {
                console.log('Error fetching devices:', error);
            }
        };

        fetchDevices();
    }, []);

    const [pageNumber, setPageNumber] = useState(0);

    const devicesPerPage = 9;
    const pagesVisited = pageNumber * devicesPerPage;

    const [expandedIndex, setExpandedIndex] = useState(-1);

    const [searchTerm, setSearchTerm] = useState('');

    const handleToggleExpand = (index: number) => {
        if (expandedIndex === index) {
            setExpandedIndex(-1);
        } else {
            setExpandedIndex(index);
        }
    };

    const displayDevices = devices
        .filter((device) => {
            // Lọc theo trạng thái hoạt động
            if (activeStatusSelect === 'Tất cả') {
                return true;
            }
            return (
                (activeStatusSelect === 'Hoạt động' && device.active) ||
                (activeStatusSelect === 'Ngưng hoạt động' && !device.active)
            );
        })
        .filter((device) => {
            // Lọc theo trạng thái kết nối
            if (connectStatusSelect === 'Tất cả') {
                return true;
            }
            return (
                (connectStatusSelect === 'Kết nối' && device.connect) ||
                (connectStatusSelect === 'Mất kết nối' && !device.connect)
            );
        })
        .filter((device) => {
            // Lọc theo từ khóa tìm kiếm
            if (!searchTerm) {
                return true;
            }
            // Lọc dựa trên thuộc tính của device mà bạn muốn tìm kiếm, ví dụ: device.deviceCode, device.deviceName, ...
            return (
                device.deviceCode.includes(searchTerm) ||
                device.deviceName.includes(searchTerm) ||
                device.ipAddress.includes(searchTerm) ||
                device.serviceUse.toLowerCase().includes(searchTerm)
            );
        })
        .slice(pagesVisited, pagesVisited + devicesPerPage)
        .map((device, index, array) => {
            const isExpanded = expandedIndex === index;

            const isMultipleOfTwo = (index + 1) % 2 === 0;
            const trClasses = isMultipleOfTwo ? 'bg-orange-50' : 'bg-white';

            const isLast = index === array.length - 1;
            const isMultipleOfNine = (index + 1) % 9 === 0;

            // Kiểm tra và áp dụng kiểu bo cong tương ứng
            const roundedRight = `${
                isLast || isMultipleOfNine
                    ? 'rounded-br-3xl border-solid '
                    : 'border border-orange-200'
            } `;

            const roundedLeft = `${
                isLast || isMultipleOfNine
                    ? 'rounded-bl-3xl border-solid '
                    : 'border border-orange-200'
            } `;

            return (
                <>
                    <React.Fragment key={device.id}>
                        <tr className={`rounded-tl-2xl h-24 ${trClasses}`}>
                            <th
                                className={`px-6 font-thin text-start ${roundedLeft}`}
                            >
                                {device.deviceCode}
                            </th>
                            <th className="border border-orange-200 px-6 font-thin text-start ">
                                {device.deviceName}
                            </th>
                            <th className="border border-orange-200 w-[166px] pl-6 pr-16 font-thin text-start ">
                                {device.ipAddress}
                            </th>
                            <th className="border border-orange-200 px-6 font-thin text-start ">
                                {device.active ? (
                                    <div className="flex">
                                        <div className="w-3 h-3 mt-3 mr-3 rounded-full bg-green-500"></div>
                                        <span>Đang hoạt động</span>
                                    </div>
                                ) : (
                                    <div className="flex">
                                        <div className="w-3 h-3 mt-3 mr-3 rounded-full bg-red-500"></div>
                                        <span>Ngưng hoạt động</span>
                                    </div>
                                )}
                            </th>
                            <th className="border border-orange-200 px-6 font-thin text-start ">
                                {device.connect ? (
                                    <div className="flex">
                                        <div className="w-3 h-3 mt-3 mr-3 rounded-full bg-green-500"></div>
                                        <span>Kết nối</span>
                                    </div>
                                ) : (
                                    <div className="flex">
                                        <div className="w-3 h-3 mt-3 mr-3 rounded-full bg-red-500"></div>
                                        <span>Mất kết nối</span>
                                    </div>
                                )}
                            </th>
                            <th className="border border-orange-200 py-2 pl-6 w-[350px] leading-snug font-thin text-start">
                                <div
                                    className={`leading-normal ${
                                        isExpanded
                                            ? 'h-auto'
                                            : 'line-clamp-1 w-[240px]'
                                    }`}
                                >
                                    {device.serviceUse}
                                </div>
                                <div
                                    onClick={() => handleToggleExpand(index)}
                                    className="cursor-pointer underline-offset-4 hover:no-underline underline text-blue-500"
                                >
                                    {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                                </div>
                            </th>
                            <th
                                onClick={() =>
                                    showDetailDeviceComponent(device.id)
                                }
                                className="border border-orange-200 w-[92px] px-6 text-blue-500 cursor-pointer underline-offset-4 hover:no-underline underline font-thin text-start "
                            >
                                Chi tiết
                            </th>
                            <th
                                onClick={() =>
                                    showUpdateDeviceComponent(device.id)
                                }
                                className={` w-[108px] px-6 text-blue-500 cursor-pointer underline-offset-4 hover:no-underline underline font-thin text-start  ${roundedRight}`}
                            >
                                Cập nhật
                            </th>
                        </tr>
                    </React.Fragment>
                </>
            );
        });

    const pageCount = Math.ceil(devices.length / devicesPerPage);

    const changePage = ({ selected }: any) => {
        setPageNumber(selected);
    };

    return (
        <>
            <div className="w-full h-screen bg-gray-200">
                {isParentVisible && (
                    <>
                        <div className="flex full-size flex-col">
                            <div className="h-32 mx-12 flex items-center">
                                <div className="text-gray-500 text-3xl font-bold font-primary">
                                    Thiết bị
                                </div>
                                <ChevronRightIcon className="h-8 w-8 mx-6 stroke-gray-500" />
                                <div className="text-orange-500 text-3xl font-bold font-primary">
                                    Danh sách thiết bị
                                </div>
                            </div>

                            <div className="m-12 my-12 text-4xl font-extrabold font-primary text-orange-500">
                                Danh sách thiết bị
                            </div>
                            <div className="flex ml-12 mr-64 mb-12">
                                <div className="w-[400px] z-20">
                                    <div className="text-3xl">
                                        Trạng thái hoạt động
                                    </div>
                                    <Listbox
                                        value={activeStatusSelect}
                                        onChange={(value) => {
                                            setActiveStatusSelect(value);
                                            setActiveOpen(false);
                                        }}
                                    >
                                        {({ open }) => (
                                            <>
                                                <Listbox.Button
                                                    className={`relative mt-4 rounded-xl w-full bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-200 sm:text-sm ${
                                                        activeOpen
                                                            ? 'ring-orange-200 ring-2'
                                                            : ''
                                                    }`}
                                                    onClick={() =>
                                                        setActiveOpen(
                                                            !activeOpen,
                                                        )
                                                    }
                                                >
                                                    <span className="block text-3xl truncate">
                                                        {activeStatusSelect}
                                                    </span>
                                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                        {activeOpen ? (
                                                            <ChevronUpIcon className="w-8 h-8 stroke-2 stroke-orange-500" />
                                                        ) : (
                                                            <ChevronDownIcon className="w-8 h-8 stroke-2 stroke-orange-500" />
                                                        )}
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
                                                        className="absolute z-20 w-full text-3xl bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm"
                                                    >
                                                        {activeStatus.map(
                                                            (option) => (
                                                                <Listbox.Option
                                                                    key={option}
                                                                    value={
                                                                        option
                                                                    }
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
                                                                                {
                                                                                    option
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </Listbox.Option>
                                                            ),
                                                        )}
                                                    </Listbox.Options>
                                                </Transition>
                                            </>
                                        )}
                                    </Listbox>
                                </div>

                                <div className="w-[400px] ml-32 z-20">
                                    <div className="text-3xl">
                                        Trạng thái kết nối
                                    </div>
                                    <Listbox
                                        value={connectStatusSelect}
                                        onChange={(value) => {
                                            setConnectStatusSelect(value);
                                            setConnectOpen(false);
                                        }}
                                    >
                                        {({ open }) => (
                                            <>
                                                <Listbox.Button
                                                    className={`relative mt-4 rounded-xl w-full bg-white border border-gray-300 shadow-sm pl-6 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-200 sm:text-sm ${
                                                        connectOpen
                                                            ? 'ring-orange-200 ring-2'
                                                            : ''
                                                    }`}
                                                    onClick={() =>
                                                        setConnectOpen(
                                                            !connectOpen,
                                                        )
                                                    }
                                                >
                                                    <span className="block text-3xl truncate">
                                                        {connectStatusSelect}
                                                    </span>
                                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                        {connectOpen ? (
                                                            <ChevronUpIcon className="w-8 h-8 stroke-2 stroke-orange-500" />
                                                        ) : (
                                                            <ChevronDownIcon className="w-8 h-8 stroke-2 stroke-orange-500" />
                                                        )}
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
                                                        className="absolute z-20 w-full text-3xl bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm"
                                                    >
                                                        {connectStatus.map(
                                                            (option) => (
                                                                <Listbox.Option
                                                                    key={option}
                                                                    value={
                                                                        option
                                                                    }
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
                                                                                {
                                                                                    option
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </Listbox.Option>
                                                            ),
                                                        )}
                                                    </Listbox.Options>
                                                </Transition>
                                            </>
                                        )}
                                    </Listbox>
                                </div>

                                <div className="flex w-full mr-2 justify-end">
                                    <div className="w-[300px] ">
                                        <div className="text-3xl">Từ khóa</div>
                                        <div className="h-16 relative">
                                            <input
                                                className="text-3xl w-full mt-4 rounded-2xl h-16 pl-6"
                                                placeholder="Nhập từ khóa"
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <span className="absolute inset-y-0 top-1/2 mt-4 right-4 -translate-y-1/2 flex items-center pr-2 pointer-events-none">
                                                <MagnifyingGlassIcon className="w-10 h-10 stroke-2 stroke-orange-500" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mx-12 z-0 text-start flex text-3xl font-light font-primary">
                                <table className="table-auto relative z-0 rounded-tl-2xl text-start drop-shadow-xl ">
                                    <thead>
                                        <tr className=" rounded-tl-2xl h-24 font-bold bg-orange-500 text-white">
                                            <th className="border px-6 font-bold text-start rounded-tl-3xl">
                                                Mã thiết bị
                                            </th>
                                            <th className="border px-6 font-bold text-start">
                                                Tên thiết bị
                                            </th>
                                            <th className="border w-[166px] pl-6 pr-16 font-bold text-start">
                                                Địa chỉ IP
                                            </th>
                                            <th className="border px-6 font-bold text-start">
                                                Trạng thái hoạt động
                                            </th>
                                            <th className="border px-6 font-bold text-start">
                                                Trạng thái kết nối
                                            </th>
                                            <th className="border px-6 w-[350px] font-bold text-start">
                                                Dịch vụ sử dụng
                                            </th>
                                            <th className="border w-[92px] px-6 font-bold text-start"></th>
                                            <th className="border px-6 w-[108px] font-bold text-start rounded-tr-3xl"></th>
                                        </tr>
                                    </thead>
                                    <tbody>{displayDevices}</tbody>
                                </table>

                                <button
                                    onClick={showAddDeviceComponent}
                                    className="flex flex-col transition-colors duration-300 group cursor-pointer hover:bg-orange-alta absolute right-0 justify-center items-center w-40 h-48 bg-orange-100 rounded-tl-2xl rounded-bl-2xl drop-shadow-xl shadow-xl"
                                >
                                    <div className="w-11 h-11 absolute-center bg-orange-500 group-hover:bg-orange-100 rounded-xl hover:text-white">
                                        <PlusIcon className="w-8 h-8 stroke-white group-hover:stroke-orange-alta stroke-2" />
                                    </div>
                                    <div className="text-center text-orange-500 group-hover:text-orange-100 mt-4 w-36">
                                        Thêm thiết bị{' '}
                                    </div>
                                </button>
                            </div>
                            <div className="flex w-full justify-end">
                                <ReactPaginate
                                    previousLabel={
                                        <ChevronLeftIcon className="w-10 h-10" />
                                    }
                                    nextLabel={
                                        <ChevronRightIcon className="w-10 h-10" />
                                    }
                                    pageCount={pageCount}
                                    onPageChange={changePage}
                                    containerClassName={'pagination'}
                                    previousLinkClassName={'previous_page'}
                                    nextLinkClassName={'next_page'}
                                    disabledClassName={'pagination_disabled'}
                                    activeClassName={'pagination_active'}
                                    pageLinkClassName={'page_link'}
                                />
                            </div>
                        </div>
                    </>
                )}

                {showAddDevice && <AddDevice />}
                {showDetailDevice && (
                    <DetailDevice deviceData={deviceData} deviceId={deviceId} />
                )}
                {showUpdateDevice && (
                    <UpdateDevice deviceData={deviceData} deviceId={deviceId} />
                )}
            </div>
        </>
    );
};

export default DeviceContainer;
