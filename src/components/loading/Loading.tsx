import React from 'react';
import { RotateSpinner } from 'react-spinners-kit';

const Loading = () => {
    return (
        <>
            <div className='fixed top-0 left-0 w-full h-screen z-40'>
                <div className='absolute top-0 left-0 w-full h-full backdrop-filter backdrop-blur-sm backdrop-brightness-50 z-40'></div>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'>
                    <RotateSpinner
                        size={60}
                        color='#FF7506'
                        animationDuration='0.75'
                        visible={true}
                    />
                </div>
            </div>

        </>

    );
};


export default Loading;
