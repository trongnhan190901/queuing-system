import {
    Squares2X2Icon,
    ComputerDesktopIcon,
    ChatBubbleLeftRightIcon,
    Square3Stack3DIcon,
    DocumentChartBarIcon,
    Cog6ToothIcon,
    EllipsisVerticalIcon,
    ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../server/firebase';
import DeviceContainer from '../shared/device/DeviceContainer';
import NumberContainer from '../shared/number/NumberContainer';
import ReportContainer from '../shared/report/ReportContainer';
import ServiceContainer from '../shared/service/ServiceContainer';
import DashboardContainer from '../shared/dashboard/DashboardContainer';
import User from './User';
import UserInfo from '../pages/UserInfo';

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
            localStorage.removeItem('authToken');
            navigate('/login');
            console.log('Logout successful');
        } catch (error) {
            console.log('Logout failed', error);
        }
    };

    const handleTabChange = (index: number) => {
        setSelectedIndex(index);
    };

    return (
        <>
            <div className="relative full-size flex z-20">
                <div className="w-[240px] h-full font-medium font-primary flex flex-col">
                    <div className="flex justify-center w-full">
                        <img
                            className="w-[150px] my-12 h-fit"
                            src="/logo.png"
                            alt=""
                        />
                    </div>
                    <div className="flex w-[240px] flex-col space-y-4">
                        <div
                            className={`flex outline-0 text-3xl h-20 items-center ${
                                selectedIndex === 0
                                    ? 'bg-orange-alta text-white focus:outline-none pointer-events-none'
                                    : 'text-gray-600 focus:outline-none'
                            }`}
                            onClick={() => handleTabChange(0)}
                        >
                            <div className="hover:bg-orange-100 full-size pl-8 hover:text-orange-alta flex items-center">
                                <Squares2X2Icon className="w-12 h-12 mr-4" />
                                Dashboard
                            </div>
                        </div>
                        <div
                            className={`flex outline-0 text-3xl h-20 items-center ${
                                selectedIndex === 1
                                    ? 'bg-orange-alta text-white focus:outline-none pointer-events-none'
                                    : 'text-gray-600 focus:outline-none'
                            }`}
                            onClick={() => handleTabChange(1)}
                        >
                            <div className="hover:bg-orange-100 full-size pl-8 hover:text-orange-alta flex items-center">
                                <ComputerDesktopIcon className="w-12 h-12 mr-4" />
                                Thiết bị
                            </div>
                        </div>
                        <div
                            className={`flex outline-0 text-3xl h-20 items-center ${
                                selectedIndex === 2
                                    ? 'bg-orange-alta text-white focus:outline-none pointer-events-none'
                                    : 'text-gray-600 focus:outline-none'
                            }`}
                            onClick={() => handleTabChange(2)}
                        >
                            <div className="hover:bg-orange-100 full-size pl-8 hover:text-orange-alta flex items-center">
                                <ChatBubbleLeftRightIcon className="w-12 h-12 mr-4" />
                                Dịch vụ
                            </div>
                        </div>
                        <div
                            className={`flex outline-0 text-3xl h-20 items-center ${
                                selectedIndex === 3
                                    ? 'bg-orange-alta text-white focus:outline-none pointer-events-none'
                                    : 'text-gray-600 focus:outline-none'
                            }`}
                            onClick={() => handleTabChange(3)}
                        >
                            <div className="hover:bg-orange-100 full-size pl-8 hover:text-orange-alta flex items-center">
                                <Square3Stack3DIcon className="w-12 h-12 mr-4" />
                                Cấp số
                            </div>
                        </div>
                        <div
                            className={`flex outline-0 text-3xl h-20 items-center ${
                                selectedIndex === 4
                                    ? 'bg-orange-alta text-white focus:outline-none pointer-events-none'
                                    : 'text-gray-600 focus:outline-none'
                            }`}
                            onClick={() => handleTabChange(4)}
                        >
                            <div className="hover:bg-orange-100 full-size pl-8 hover:text-orange-alta flex items-center">
                                <DocumentChartBarIcon className="w-12 h-12 mr-4" />
                                Báo cáo
                            </div>
                        </div>
                        <div
                            className={`flex outline-0 text-3xl h-20 items-center ${
                                selectedIndex === 5
                                    ? 'bg-orange-alta text-white focus:outline-none'
                                    : 'text-gray-600 focus:outline-none hover:bg-orange-100 hover:text-orange-alta'
                            }`}
                            onClick={() => handleTabChange(5)}
                        >
                            <div className="full-size pl-8 flex items-center">
                                <Cog6ToothIcon className="w-12 h-12 mr-4" />
                                Cài đặt hệ thống
                            </div>
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
                        </div>
                    </div>

                    <button className="mx-4 my-12 rounded-2xl flex absolute w-[22rem] bottom-0 items-end text-orange-alta bg-orange-100 hover:bg-orange-alta hover:text-white">
                        <button
                            onClick={handleLogout}
                            className="flex pl-4 text-3xl h-20 items-center"
                        >
                            <ArrowUpTrayIcon className="w-12 stroke-2 rotate-90 h-12 mr-4" />
                            Đăng xuất
                        </button>
                    </button>
                </div>
                <div
                    onClick={() => handleTabChange(6)}
                    className="absolute right-2 top-2"
                >
                    <User />
                </div>
                <div className="full-size flex">
                    {/* Conditional rendering based on selectedIndex */}
                    {selectedIndex === 0 && <DashboardContainer />}
                    {selectedIndex === 1 && <DeviceContainer />}
                    {selectedIndex === 2 && <ServiceContainer />}
                    {selectedIndex === 3 && <NumberContainer />}
                    {selectedIndex === 4 && <ReportContainer />}
                    {/* {selectedIndex === 5 && <SystemSettings />} */}
                    {selectedIndex === 6 && <UserInfo />}
                </div>
            </div>
        </>
    );
};

export default Navbar;
