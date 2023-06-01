import { BellIcon } from '@heroicons/react/24/outline';
import { auth } from '../../server/firebase';

const User = () => {
    const user = auth.currentUser;

    return (
        <>
            <div className="h-20 flex justify-end w-full my-4">
                <div className="absolute-center h-full w-[350px]">
                    <div className="w-[32px] h-[32px] bg-orange-100 rounded-full absolute-center">
                        <BellIcon className="h-8 w-8 stroke-orange-400 fill-orange-400" />
                    </div>
                    {/* <div className="w-[32px] h-[32px] bg-orange-500 rounded-full absolute-center">
                        <BellIcon className="h-8 w-8 stroke-white fill-white" />
                    </div> */}
                    <div className="ml-8 mr-4">
                        <img
                            src="/logo.png"
                            alt=""
                            className="w-16 h-16 rounded-full"
                        />
                    </div>
                    <div>
                        <div className="text-gray-500">Xin chào</div>
                        <div className="text-2xl">{user?.email}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default User;
