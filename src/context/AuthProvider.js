import { createContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken');
  const idToken = localStorage.getItem('idToken');
  const role = localStorage.getItem('role');
  const user = localStorage.getItem('user');
  const parsedUser = JSON.parse(user);
  const refreshToken = localStorage.getItem('refreshToken');
  const socketDataStore = useSelector((state) => state.DispatchReducer.socket);
  const [auth, setAuth] = useState({
    accessToken,
    idToken,
    refreshToken,
    role,
    user: parsedUser,
  });
  useEffect(() => {
    console.log('auth current : ', auth);
  }, [auth]);

  function logoutUser() {
    setAuth({
      accessToken: null,
      idToken: null,
      refreshToken: null,
      role: null,
      user: null,
    });
    if (socketDataStore) {
      socketDataStore.close();
    }
    localStorage.clear();
    window.location.href = '/login';
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
