import { createContext, useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    // Set the user data when the user logs in
    console.log("this is user ----->", user)
    console.log("this is userData ----->", userData)
    setUser(userData);
  };

  const logout = () => {
    // Clear user data when the user logs out
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};