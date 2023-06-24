import {
    ArrowUpTrayIcon,
    ChatBubbleLeftRightIcon,
    Cog6ToothIcon,
    ComputerDesktopIcon,
    DocumentChartBarIcon,
    EllipsisVerticalIcon,
    Square3Stack3DIcon,
    Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeviceContainer from '../shared/device/DeviceContainer';
import NumberContainer from '../shared/number/NumberContainer';
import ReportContainer from '../shared/report/ReportContainer';
import ServiceContainer from '../shared/service/ServiceContainer';
import DashboardContainer from '../shared/dashboard/DashboardContainer';
import User from './User';
import UserInfo from '../pages/UserInfo';
import RoleContainer from '../shared/system/role/RoleContainer';
import AccountContainer from '../shared/system/account/AccountContainer';
import { useDispatch } from 'react-redux';
import { logout } from 'store/authSlice';
import LogContainer from '../shared/system/log/LogContainer';

const Navbar = () => {
    const [toggleSubMenu, setToggleSubMenu] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);


    const toggle = (show: boolean) => {
        setToggleSubMenu(show);
    };

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            dispatch(logout());
            navigate('/login');
        } catch (error) {
            console.log('Logout failed', error);
        }
    };

    const handleTabChange = (index: number) => {
        setSelectedIndex(index);
    };

    return (
        <>
            <div className='relative full-size flex z-20'>
                <div className='w-[240px] h-full font-bold font-primary flex flex-col'>
                    <div className='flex justify-center w-full'>
                        <img
                            className='w-[150px] my-12 h-fit'
                            src='/logo.png'
                            alt=''
                        />
                    </div>
                    <div className='flex w-[240px] flex-col space-y-4'>
                        <div
                            className={`flex outline-0 text-3xl h-20 items-center ${
                                selectedIndex === 0
                                    ? 'bg-orange-alta text-white focus:outline-none pointer-events-none'
                                    : 'text-gray-600 focus:outline-none'
                            }`}
                            onClick={() => handleTabChange(0)}
                        >
                            <div className='hover:bg-orange-100 full-size pl-8 hover:text-orange-alta flex items-center'>
                                <Squares2X2Icon className='w-12 h-12 mr-4' />
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
                            <div className='hover:bg-orange-100 full-size pl-8 hover:text-orange-alta flex items-center'>
                                <ComputerDesktopIcon className='w-12 h-12 mr-4' />
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
                            <div className='hover:bg-orange-100 full-size pl-8 hover:text-orange-alta flex items-center'>
                                <ChatBubbleLeftRightIcon className='w-12 h-12 mr-4' />
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
                            <div className='hover:bg-orange-100 full-size pl-8 hover:text-orange-alta flex items-center'>
                                <Square3Stack3DIcon className='w-12 h-12 mr-4' />
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
                            <div className='hover:bg-orange-100 full-size pl-8 hover:text-orange-alta flex items-center'>
                                <DocumentChartBarIcon className='w-12 h-12 mr-4' />
                                Báo cáo
                            </div>
                        </div>
                        <div
                            className={`flex outline-0 text-3xl h-20 items-center ${
                                selectedIndex === 6 ||
                                selectedIndex === 7 ||
                                selectedIndex === 8
                                    ? 'bg-orange-alta text-white focus:outline-none'
                                    : 'text-gray-600 focus:outline-none hover:bg-orange-100 hover:text-orange-alta'
                            }`}
                        >
                            <div className='full-size pl-8 flex items-center'>
                                <Cog6ToothIcon className='w-12 h-12 mr-4' />
                                Cài đặt hệ thống
                            </div>
                            <div
                                onMouseEnter={() => toggle(true)}
                                onMouseLeave={() => toggle(false)}
                                className='relative z-20'
                            >
                                <div className='h-20 flex items-center relative'>
                                    <EllipsisVerticalIcon className='w-12 h-12 pr-4 ' />
                                </div>
                                <div className='w-[220px] absolute bg-white top-0 left-full rounded-tr-3xl rounded-br-3xl'>
                                    {toggleSubMenu && (
                                        <ul>
                                            <li
                                                onClick={() =>
                                                    handleTabChange(6)
                                                }
                                                className={`flex outline-0 text-3xl h-20  pl-8 rounded-tr-3xl items-center ${
                                                    selectedIndex === 6
                                                        ? 'bg-orange-alta text-white focus:outline-none pointer-events-none'
                                                        : 'text-gray-600 focus:outline-none hover:bg-orange-100 hover:text-orange-alta'
                                                }`}
                                            >
                                                Quản lý vài trò
                                            </li>
                                            <li
                                                onClick={() =>
                                                    handleTabChange(7)
                                                }
                                                className={`flex outline-0 text-3xl h-20  pl-8 items-center ${
                                                    selectedIndex === 7
                                                        ? 'bg-orange-alta text-white focus:outline-none pointer-events-none'
                                                        : 'text-gray-600 focus:outline-none hover:bg-orange-100 hover:text-orange-alta'
                                                }`}
                                            >
                                                Quản lý tài khoản
                                            </li>
                                            <li
                                                onClick={() =>
                                                    handleTabChange(8)
                                                }
                                                className={`flex outline-0 text-3xl h-20  pl-8 rounded-br-3xl items-center ${
                                                    selectedIndex === 8
                                                        ? 'bg-orange-alta text-white focus:outline-none pointer-events-none'
                                                        : 'text-gray-600 focus:outline-none hover:bg-orange-100 hover:text-orange-alta'
                                                }`}
                                            >
                                                Nhật ký người dùng
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => handleTabChange(5)}
                    className='absolute right-2 top-2'
                >
                    <User />
                </div>
                <div className='full-size flex'>
                    {/* Conditional rendering based on selectedIndex */}
                    {selectedIndex === 0 && <DashboardContainer />}
                    {selectedIndex === 1 && <DeviceContainer />}
                    {selectedIndex === 2 && <ServiceContainer />}
                    {selectedIndex === 3 && <NumberContainer />}
                    {selectedIndex === 4 && <ReportContainer />}
                    {selectedIndex === 5 && <UserInfo />}
                    {selectedIndex === 6 && <RoleContainer />}
                    {selectedIndex === 7 && <AccountContainer />}
                    {selectedIndex === 8 && <LogContainer />}
                </div>
            </div>
            <div className='mx-4 my-12 z-20 cursor-pointer rounded-2xl flex absolute w-[22rem] bottom-0 items-end text-orange-alta bg-orange-100 hover:bg-orange-alta hover:text-white'>
                <button
                    onClick={handleLogout}
                    className='flex pl-4 text-3xl cursor-pointer font-bold font-primary h-20 items-center'
                >
                    <ArrowUpTrayIcon className='w-12 stroke-2 rotate-90 h-12 mr-4' />
                    Đăng xuất
                </button>
            </div>
        </>
    );
};

export default Navbar;
