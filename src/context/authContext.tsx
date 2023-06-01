import React, { ReactNode, createContext, useState } from 'react';

interface AuthContextValue {
    loggedIn: boolean;
    setLoggedIn: (value: boolean) => void;
    showInformationModal: boolean;
    setShowInformationModal: (value: boolean) => void;
}

const initialAuthContextValue: AuthContextValue = {
    loggedIn: false,
    setLoggedIn: () => {},
    showInformationModal: false,
    setShowInformationModal: () => {},
};

export const AuthContext = createContext<AuthContextValue>(
    initialAuthContextValue,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [showInformationModal, setShowInformationModal] =
        useState<boolean>(false);

    const authContextValue: AuthContextValue = {
        loggedIn,
        setLoggedIn,
        showInformationModal,
        setShowInformationModal,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
