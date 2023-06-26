import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userApiKey, setUserApiKey] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');

  return (
    <UserContext.Provider value={{
      userApiKey,
      setUserApiKey,
      userEmail,
      setUserEmail,
      userId,
      setUserId,
    }}>
      {children}
    </UserContext.Provider>
  );
};