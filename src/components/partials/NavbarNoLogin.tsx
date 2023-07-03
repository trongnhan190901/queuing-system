import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import AddNumber from '../shared/number/AddNumber';

const NavbarNoLogin = () => {
    return (
        <>
            <div className='relative full-size flex z-20'>
                <div className='w-[240px] h-full font-bold font-primary flex flex-col'>
                    <div className='flex justify-center w-full'>
                        <img
                            className='w-[100px] my-24 h-fit'
                            src='/logo.png'
                            alt=''
                        />
                    </div>
                    <div className='flex w-[240px] flex-col space-y-4'>
                        <div
                            className='flex outline-0 text-3xl h-20 items-center bg-orange-alta text-white focus:outline-none pointer-events-none'
                        >
                            <div className='hover:bg-orange-100 full-size pl-8 hover:text-orange-alta flex items-center'>
                                <Square3Stack3DIcon className='w-12 h-12 mr-4' />
                                Cấp số
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full max-h-screen h-screen flex flex-col bg-gray-200'>
                    <AddNumber />
                </div>
            </div>
        </>
    );
};

export default NavbarNoLogin;
