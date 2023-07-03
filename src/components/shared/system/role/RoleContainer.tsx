import React, { useEffect, useState } from 'react';
import { ChevronRightIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { firestore } from 'server/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import AddRole from './AddRole';
import UpdateRole from './UpdateRole';
import { Role } from 'types';
import Loading from 'components/loading/Loading';
import Navbar from '../../../partials/Navbar';
import User from '../../../partials/User';

const RoleContainer = () => {
    const [isParentVisible, setIsParentVisible] = useState(true);
    const [showAddRole, setShowAddRole] = useState(false);
    const [showUpdateRole, setShowUpdateRole] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const showAddRoleComponent = () => {
        setIsParentVisible(!isParentVisible);
        setShowAddRole(!showAddRole);
    };

    const [roleData, setRoleData] = useState<Role | null>(null);
    const [roleId, setRoleId] = useState('');

    const showUpdateDeviceComponent = async (id: string) => {
        try {
            const roleRef = doc(firestore, 'roles', id);
            const roleSnapshot = await getDoc(roleRef);
            const roleData = roleSnapshot.data() as Role | null;

            setRoleData(roleData);
            setRoleId(id);

            setIsParentVisible(!isParentVisible);
            setShowUpdateRole(!showUpdateRole);
        } catch (error) {
            console.log('Error fetching role data:', error);
        }
    };

    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setIsLoading(true);
                const rolesRef = collection(firestore, 'roles');
                const querySnapshot = await getDocs(rolesRef);
                const rolesData = querySnapshot.docs.map((doc) => {
                    const roleData = doc.data() as Role;
                    const roleId = doc.id;
                    return { ...roleData, id: roleId };
                });
                setRoles(rolesData);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log('Error fetching roles:', error);
            }
        };

        fetchRoles();
    }, []);

    const [searchTerm, setSearchTerm] = useState('');

    const displayRoles = roles
        .filter((role) => {
            // Lọc theo từ khóa tìm kiếm
            if (!searchTerm) {
                return true;
            }
            // Lọc dựa trên thuộc tính
            return (
                role.roleName.toLowerCase().includes(searchTerm) ||
                role.roleDes.toLowerCase().includes(searchTerm) ||
                role.roleName.includes(searchTerm) ||
                role.roleDes.includes(searchTerm)
            );
        })

        .map((role, index, array) => {
            const isMultipleOfTwo = (index + 1) % 2 === 0;
            const trClasses = isMultipleOfTwo ? 'bg-orange-50' : 'bg-white';

            const isLast = index === array.length - 1;
            const isMultipleOfNine = (index + 1) % 9 === 0;

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
                    <React.Fragment key={role.id}>
                        <tr className={`rounded-tl-2xl h-24 ${trClasses}`}>
                            <th
                                className={`px-6 w-[250px] font-thin text-start ${roundedLeft}`}
                            >
                                {role.roleName}
                            </th>
                            <th className='border border-orange-200 w-[250px] pl-6 pr-16 font-thin text-start '>
                                {role.roleCount}
                            </th>

                            <th className='border  border-orange-200 w-[700px] pl-6 pr-16 font-thin text-start '>
                                {role.roleDes}
                            </th>
                            <th
                                onClick={() =>
                                    showUpdateDeviceComponent(role.id)
                                }
                                className={`w-[150px] px-6 text-blue-500 cursor-pointer underline-offset-4 hover:no-underline underline font-thin text-start  ${roundedRight}`}
                            >
                                Cập nhật
                            </th>
                        </tr>
                    </React.Fragment>
                </>
            );
        });

    return (
        <>
            {isLoading && <Loading />}
            {isParentVisible && (
                <div className='full-size flex relative'>
                    <Navbar />
                    <div className='absolute top-2 right-2'>
                        <User />
                    </div>
                    <div className='w-full h-screen bg-gray-200'>
                        <div className='flex full-size flex-col'>
                            <div className='h-32 mx-12 flex items-center'>
                                <div className='text-gray-500 text-3xl font-bold font-primary'>
                                    Cài đặt hệ thống
                                </div>
                                <ChevronRightIcon className='h-8 w-8 mx-6 stroke-gray-500' />
                                <div className='text-orange-500 text-3xl font-bold font-primary'>
                                    Quản lý vai trò
                                </div>
                            </div>

                            <div className='m-12 my-12 text-4xl font-extrabold font-primary text-orange-500'>
                                Danh sách vai trò
                            </div>
                            <div className='flex ml-12 mr-64 mb-12'>
                                <div className='flex w-full mr-2 justify-end'>
                                    <div className='w-[300px] '>
                                        <div className='text-3xl'>Từ khóa</div>
                                        <div className='h-16 relative'>
                                            <input
                                                className='text-3xl w-full mt-4 rounded-2xl h-16 pl-6'
                                                placeholder='Nhập từ khóa'
                                                type='text'
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <span className='absolute inset-y-0 top-1/2 mt-4 right-4 -translate-y-1/2 flex items-center pr-2 pointer-events-none'>
                                                <MagnifyingGlassIcon className='w-10 h-10 stroke-2 stroke-orange-500' />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='mx-12 z-0 text-start flex text-3xl font-light font-primary'>
                                <table className='table-auto relative z-0 rounded-tl-2xl text-start drop-shadow-xl '>
                                    <thead>
                                    <tr className='h-24 font-bold bg-orange-500 text-white'>
                                        <th className='border w-[250px] px-6 font-bold text-start rounded-tl-3xl'>
                                            Tên vai trò
                                        </th>
                                        <th className='border w-[250px] px-6 font-bold text-start'>
                                            Số người dùng
                                        </th>
                                        <th className='border w-[700px] pl-6 pr-16 font-bold text-start'>
                                            Mô tả
                                        </th>
                                        <th className='border px-6 w-[150px] font-bold text-start rounded-tr-3xl'></th>
                                    </tr>
                                    </thead>
                                    <tbody>{displayRoles}</tbody>
                                </table>

                                <button
                                    onClick={showAddRoleComponent}
                                    className='flex flex-col transition-colors duration-300 group cursor-pointer hover:bg-orange-alta absolute right-0 justify-center items-center w-40 h-48 bg-orange-100 rounded-tl-2xl rounded-bl-2xl drop-shadow-xl shadow-xl'
                                >
                                    <div className='w-11 h-11 absolute-center bg-orange-500 group-hover:bg-orange-100 rounded-xl hover:text-white'>
                                        <PlusIcon className='w-8 h-8 stroke-white group-hover:stroke-orange-alta stroke-2' />
                                    </div>
                                    <div className='text-center text-orange-500 group-hover:text-orange-100 mt-4 w-36'>
                                        Thêm
                                    </div>
                                    <div className='text-center text-orange-500 group-hover:text-orange-100 w-36'>
                                        vai trò
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showAddRole && <AddRole />}
            {showUpdateRole && (
                <UpdateRole
                    roleData={roleData}
                    roleId={roleId}
                />
            )}
        </>
    );
};

export default RoleContainer;
