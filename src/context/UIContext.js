import React, { createContext, useState } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [loading, setLoading] = useState(false);
  const [isLogginIn, setIsLogginIn] = useState(false);
  const [isError, setIsError] = useState(false);

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
      isLogginIn,
      setIsLogginIn,
      isError,
      setIsError,
    }}>
      {children}
    </UIContext.Provider>
  );
};
