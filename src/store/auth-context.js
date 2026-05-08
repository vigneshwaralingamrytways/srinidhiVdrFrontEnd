import { MarkChatRead } from '@mui/icons-material';
import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

let logoutTimer;

const AuthContext = React.createContext({
  token: '',
  roleId:'',
  userId:'',
  refreshToken:'',
  userName:'',
  machineName:'',
  userType:'',
  isLoggedIn: false,
  login: (token, expirationTime,roleId,userId,refreshToken,userName,machineName,userType) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  console.log(new Date().getTime())
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return expirationTime;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime');
  const roleId = localStorage.getItem('roleId');
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const machineName = localStorage.getItem('machineName');
  const userType = localStorage.getItem('userType');
  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 7500) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
    roleId:roleId,
    userId : userId,
    userName : userName,
    machineName : machineName,
    userType : userType
  };
};

export const AuthContextProvider = (props) => {
  const history = useHistory();
  
  const tokenData = retrieveStoredToken();
  
  let initialToken;
  let role;
  let user;
  let users;
  let machines;
  let userTypes;
  if (tokenData) {
    initialToken = tokenData.token;
    role = tokenData.roleId
    user = tokenData.userId
    users = tokenData.userName
    machines = tokenData.machineName
    userTypes = tokenData.userType
  }

  const [token, setToken] = useState(initialToken);
  const [roleId,setRoleId] = useState(role);
  const [userId,setUserId] = useState(user);
  const [userName, setUserName] = useState(users);
  const [machineName, setMachineName] = useState(machines);
  const [userType, setUserType] = useState(userTypes);
  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    setRoleId(null); // Assuming you want to clear roleId as well
    setUserId(null); 
    setUserName(null);
    setMachineName(null);
    setUserType(null);
    localStorage.removeItem('token');
    localStorage.removeItem('roleId');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('refreshToken'); 
    localStorage.removeItem('userName');
    localStorage.removeItem('machineName');
    localStorage.removeItem('transactionId');
    localStorage.removeItem('userType');
  
    history.push('/');
  
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, [history]);
  

  const loginHandler = (token, expirationTime,roleId,userId,refreshToken,userName,machineName,userType) => {
    setToken(token);
    setRoleId(roleId);
    setUserName(userName);
    setUserName(machineName);
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime);
    localStorage.setItem('roleId', roleId);
    localStorage.setItem('userId',userId);
    localStorage.setItem('refreshToken',refreshToken);
    localStorage.setItem('userName',userName);
    localStorage.setItem('machineName',machineName);
    localStorage.setItem('userType',userType)
    const remainingTime = calculateRemainingTime(expirationTime);

   // logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
    //  logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    roleId:roleId,
    userId:userId,
    userName:userName,
    machineName:machineName,
    userType:userType,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;