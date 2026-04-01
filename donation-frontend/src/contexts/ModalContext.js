import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext({
    isDepositOpen: false,
    openDeposit: () => { },
    closeDeposit: () => { },
    isWithdrawOpen: false,
    openWithdraw: () => { },
    closeWithdraw: () => { },
});

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

    const openDeposit = () => setIsDepositOpen(true);
    const closeDeposit = () => setIsDepositOpen(false);

    const openWithdraw = () => setIsWithdrawOpen(true);
    const closeWithdraw = () => setIsWithdrawOpen(false);

    return (
        <ModalContext.Provider
            value={{
                isDepositOpen,
                openDeposit,
                closeDeposit,
                isWithdrawOpen,
                openWithdraw,
                closeWithdraw,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};
