import React, { useContext, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AuthContext } from '../../context/authContext';

interface InformationModalProps {
    closeModal: () => void;
}

const InformationModal: React.FC<InformationModalProps> = ({ closeModal }) => {
    const { setLoggedIn } = useContext(AuthContext);
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate and save the user's information
        // Replace with your actual logic for saving the information
        if (fullName.trim() === '' || phoneNumber.trim() === '') {
            // Display an error message or handle invalid input
            return;
        }

        // Set the user as logged in
        setLoggedIn(true);
        closeModal();
    };

    return (
        <Transition.Root show={true} as={React.Fragment}>
            <Dialog
                as="div"
                className="fixed z-10 inset-0 overflow-y-auto"
                onClose={closeModal}
            >
                {/* Modal content */}
            </Dialog>
        </Transition.Root>
    );
};

export default InformationModal;
