import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import NumberContainer from '../shared/number/NumberContainer';

const NavbarNoLogin = () => {
    return (
        <>
            <div className='relative full-size flex z-20'>
                <div className='w-[240px] h-full font-medium font-primary flex flex-col'>
                    <div className='flex justify-center w-full'>
                        <img
                            className='w-[150px] my-12 h-fit'
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
                <div className='full-size flex'>
                    <NumberContainer />
                </div>
            </div>
        </>
    );
};

export default NavbarNoLogin;
