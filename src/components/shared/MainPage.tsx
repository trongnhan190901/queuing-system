import Navbar from '../partials/Navbar';
import { AuthContext } from '../../context/authContext';
import InformationModal from '../modal/InformationModal';
import { useContext, useEffect } from 'react';
import { auth } from '../../server/firebase';

const MainPage = () => {
    const user = auth.currentUser;
    const { loggedIn, showInformationModal, setShowInformationModal } =
        useContext(AuthContext);

    const handleOpenModal = () => {
        setShowInformationModal(true);
    };

    const handleCloseModal = () => {
        setShowInformationModal(false);
    };

    console.log(user);

    // useEffect(() => {
    //     if (loggedIn && !showInformationModal) {
    //         // Add your logic here to check if the user is missing information
    //         const isMissingInformation = false; // Replace with your actual logic

    //         if (isMissingInformation) {
    //             setShowInformationModal(true);
    //         }
    //     }
    // }, [loggedIn, showInformationModal, setShowInformationModal]);
    return (
        <>
            <div className="full-size flex">
                <Navbar />
                {/* {showInformationModal && (
                    <InformationModal closeModal={handleCloseModal} />
                )} */}
            </div>
        </>
    );
};

export default MainPage;
