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
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from 'store/authSlice';

const Navbar = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [toggleSubMenu, setToggleSubMenu] = useState(false);

    const toggle = (show: boolean) => {
        setToggleSubMenu(show);
    };

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

    useEffect(() => {
        const currentPath = location.pathname;

        if (currentPath === '/') {
            setSelectedIndex(0);
        } else if (currentPath === '/devices') {
            setSelectedIndex(1);
        } else if (currentPath === '/services') {
            setSelectedIndex(2);
        } else if (currentPath.includes('/numbers')) {
            setSelectedIndex(3);
        } else if (currentPath === '/reports') {
            setSelectedIndex(4);
        } else if (currentPath === '/user') {
            setSelectedIndex(5);
        } else if (currentPath === '/roles') {
            setSelectedIndex(6);
        } else if (currentPath === '/accounts') {
            setSelectedIndex(7);
        } else if (currentPath === '/logs') {
            setSelectedIndex(8);
        }
    }, [location.pathname]);

    return (
        <>
            <div className="w-[240px] h-full font-bold font-primary flex flex-col">
                <Link to="/" className="flex justify-center w-full">
                    <img
                        className="w-[100px] my-24 h-fit"
                        src="/logo.png"
                        alt=""
                    />
                </Link>
                <div className="flex w-[240px] flex-col space-y-4">
                    <Link
                        to="/"
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
                    </Link>
                    <Link
                        to="/devices"
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
                    </Link>
                    <Link
                        to="/services"
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
                    </Link>
                    <Link
                        to="/numbers"
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
                    </Link>
                    <Link
                        to="/reports"
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
                    </Link>

                    <div
                        className={`flex outline-0 text-3xl h-20 items-center ${
                            selectedIndex === 6 ||
                            selectedIndex === 7 ||
                            selectedIndex === 8
                                ? 'bg-orange-alta text-white focus:outline-none'
                                : 'text-gray-600 focus:outline-none hover:bg-orange-100 hover:text-orange-alta'
                        }`}
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
                            <div className="w-[220px] absolute bg-white top-0 left-full rounded-tr-3xl rounded-br-3xl">
                                {toggleSubMenu && (
                                    <ul>
                                        <li>
                                            <Link
                                                to="/roles"
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
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/accounts"
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
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/logs"
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
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mx-4 my-12 z-20 cursor-pointer rounded-2xl flex absolute w-[22rem] bottom-0 items-end text-orange-alta bg-orange-100 hover:bg-orange-alta hover:text-white">
                <button
                    onClick={handleLogout}
                    className="flex pl-4 text-3xl cursor-pointer font-bold font-primary h-20 items-center"
                >
                    <ArrowUpTrayIcon className="w-12 stroke-2 rotate-90 h-12 mr-4" />
                    Đăng xuất
                </button>
            </div>
        </>
    );
};

export default Navbar;
