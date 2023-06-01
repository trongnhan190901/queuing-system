import {
    Squares2X2Icon,
    ComputerDesktopIcon,
    ChatBubbleLeftRightIcon,
    Square3Stack3DIcon,
    DocumentChartBarIcon,
    Cog6ToothIcon,
    EllipsisVerticalIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import { useState } from 'react';
import DashboardChart from '../shared/DashboardChart';
import DashboardSub from '../shared/DashboardSub';
import DeviceContainer from '../shared/DeviceContainer';
import ServiceContainer from '../shared/ServiceContainer';
import NumberContainer from '../shared/NumberContainer';
import ReportContainer from '../shared/ReportContainer';
import { auth } from '../../server/firebase';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [toggleSubMenu, setToggleSubMenu] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const toggle = (show: boolean) => {
        setToggleSubMenu(show);
    };

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
            console.log('Logout successful');
            // Perform any additional actions after logout if needed
        } catch (error) {
            // Logout failed
            console.log('Logout failed', error);
        }
    };

    return (
        <>
            <div className="h-screen w-screen flex z-20">
                <Tab.Group
                    selectedIndex={selectedIndex}
                    onChange={setSelectedIndex}
                >
                    <div className="w-[230px] h-full font-secondary flex flex-col">
                        <div className="flex justify-center w-full">
                            <img
                                className="w-[150px] my-12 h-fit"
                                src="/logo.png"
                                alt=""
                            />
                        </div>
                        <Tab.List className="flex w-[230px] flex-col space-y-4">
                            <Tab
                                className={({ selected }) =>
                                    classNames(
                                        selected
                                            ? 'bg-orange-500 text-white focus:outline-none pointer-events-none'
                                            : 'text-gray-600 focus:outline-none',
                                    )
                                }
                            >
                                <div className="flex outline-0 text-3xl h-20 items-center">
                                    <div className="hover:bg-orange-100 full-size pl-8 hover:text-orange-500 flex items-center">
                                        <Squares2X2Icon className="w-12 h-12 mr-4" />
                                        Dashboard
                                    </div>
                                </div>
                            </Tab>
                            <Tab
                                className={({ selected }) =>
                                    classNames(
                                        selected
                                            ? 'bg-orange-500 text-white focus:outline-none pointer-events-none'
                                            : 'text-gray-600 focus:outline-none',
                                    )
                                }
                            >
                                <div className="flex outline-0 text-3xl h-20 items-center">
                                    <div className="hover:bg-orange-100 full-size pl-8 hover:text-orange-500 flex items-center">
                                        <ComputerDesktopIcon className="w-12 h-12 mr-4" />
                                        Thiết bị
                                    </div>
                                </div>
                            </Tab>
                            <Tab
                                className={({ selected }) =>
                                    classNames(
                                        selected
                                            ? 'bg-orange-500 text-white focus:outline-none pointer-events-none'
                                            : 'text-gray-600 focus:outline-none',
                                    )
                                }
                            >
                                <div className="flex outline-0 text-3xl h-20 items-center">
                                    <div className="hover:bg-orange-100 full-size pl-8 hover:text-orange-500 flex items-center">
                                        <ChatBubbleLeftRightIcon className="w-12 h-12 mr-4" />
                                        Dịch vụ
                                    </div>
                                </div>
                            </Tab>
                            <Tab
                                className={({ selected }) =>
                                    classNames(
                                        selected
                                            ? 'bg-orange-500 text-white focus:outline-none pointer-events-none'
                                            : 'text-gray-600 focus:outline-none',
                                    )
                                }
                            >
                                <div className="flex outline-0 text-3xl h-20 items-center">
                                    <div className="hover:bg-orange-100 full-size pl-8 hover:text-orange-500 flex items-center">
                                        <Square3Stack3DIcon className="w-12 h-12 mr-4" />
                                        Cấp số
                                    </div>
                                </div>
                            </Tab>
                            <Tab
                                className={({ selected }) =>
                                    classNames(
                                        selected
                                            ? 'bg-orange-500 text-white focus:outline-none pointer-events-none'
                                            : 'text-gray-600 focus:outline-none',
                                    )
                                }
                            >
                                <div className="flex outline-0 text-3xl h-20 items-center">
                                    <div className="hover:bg-orange-100 full-size pl-8 hover:text-orange-500 flex items-center">
                                        <DocumentChartBarIcon className="w-12 h-12 mr-4" />
                                        Báo cáo
                                    </div>
                                </div>
                            </Tab>
                            <Tab
                                className={({ selected }) =>
                                    classNames(
                                        selected
                                            ? 'bg-orange-500 text-white focus:outline-none '
                                            : 'text-gray-600 focus:outline-none hover:bg-orange-100 hover:text-orange-500',
                                    )
                                }
                            >
                                <div className="flex outline-0 text-3xl h-20 items-center">
                                    <div className="full-size pl-8  flex items-center">
                                        <Cog6ToothIcon className="w-12 h-12 mr-4" />
                                        Cài đặt hệ thống
                                    </div>

                                    <Tab.List>
                                        <div
                                            onMouseEnter={() => toggle(true)}
                                            onMouseLeave={() => toggle(false)}
                                            className="relative z-20"
                                        >
                                            <div className="h-20 flex items-center relative">
                                                <EllipsisVerticalIcon className="w-12 h-12 pr-4 " />
                                            </div>
                                            <div className="w-[220px] absolute bg-white top-0 left-full rounded-tr-2xl ">
                                                {toggleSubMenu && (
                                                    <ul>
                                                        <li className="flex hover:bg-orange-400 pl-8 rounded-tr-3xl hover:text-white text-3xl h-20 items-center text-gray-600">
                                                            Quản lý vài trò
                                                        </li>
                                                        <li className="flex text-3xl hover:bg-orange-400 pl-8 hover:text-white h-20 items-center text-gray-600">
                                                            Quản lý tài khoản
                                                        </li>
                                                        <li className="flex text-3xl hover:bg-orange-400 pl-8 rounded-br-3xl hover:text-white h-20 items-center text-gray-600">
                                                            Nhật ký người dùng
                                                        </li>
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </Tab.List>
                                </div>
                            </Tab>
                        </Tab.List>
                        <div className="h-full flex" />
                        <button className="mx-4 my-12 rounded-2xl flex  items-end text-orange-500 bg-orange-100 hover:bg-orange-500 hover:text-white">
                            <button
                                onClick={handleLogout}
                                className="flex pl-4 text-3xl h-20 items-center"
                            >
                                <ArrowRightOnRectangleIcon className="w-12 h-12 mr-4" />
                                Đăng xuất
                            </button>
                        </button>
                    </div>

                    <Tab.Panels className="full-size">
                        <Tab.Panel className="full-size flex flex-col">
                            <div className="flex">
                                <DashboardChart />
                                <DashboardSub />
                            </div>
                        </Tab.Panel>
                        <Tab.Panel className="full-size flex flex-col">
                            <div className="flex">
                                <DeviceContainer />
                            </div>
                        </Tab.Panel>
                        <Tab.Panel className="full-size flex flex-col">
                            <div className="flex">
                                <ServiceContainer />
                            </div>
                        </Tab.Panel>
                        <Tab.Panel className="full-size flex flex-col">
                            <div className="flex">
                                <NumberContainer />
                            </div>
                        </Tab.Panel>
                        <Tab.Panel className="full-size flex flex-col">
                            <div className="flex">
                                <ReportContainer />
                            </div>
                        </Tab.Panel>
                        <Tab.Panel></Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </>
    );
};

export default Navbar;
