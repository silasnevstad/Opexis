import React, { createContext, useState } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  return (
    <UIContext.Provider value={{
      signUpModalOpen,
      setSignUpModalOpen,
      accountModalOpen,
      setAccountModalOpen,
      isSidebarOpen,
      setIsSidebarOpen,
      loading,
      setLoading,
    }}>
      {children}
    </UIContext.Provider>
  );
};
