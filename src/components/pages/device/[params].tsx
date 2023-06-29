import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import React from 'react';
import SettingKIO from '../../shared/device/SettingKIO';
import SettingMHQ from '../../shared/device/SettingMHQ';
import SettingMHTT from '../../shared/device/SettingMHTT';

const DevicePage = () => {
    const device = useSelector((state: RootState) => state.auth.device);

    return (
        <>
            <div className='w-full h-screen bg-gray-200'>
                {device?.deviceCode.includes('KIO') ? (
                    <SettingKIO />
                ) : device?.deviceCode.includes('MHQ') ? (
                    <SettingMHQ />
                ) : (
                    <SettingMHTT />
                )}
            </div>
        </>
    );
};

export default DevicePage;

