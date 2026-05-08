import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import SubMenu from './SubMenu';
import classes from './SideBar.modules.css'
import { Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { moduleActions } from '../store/module-slice';
import { Link, useHistory } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa'
import Logo from '../images/Srilogo.png';
import { Masters } from './SidebarModulewise/Masters';
import { MisEntryMenu } from './SidebarModulewise/MisEntryMenu';
import { Meeting } from './SidebarModulewise/Meeting';
import { Setting } from './SidebarModulewise/Setting';
import { HRMS } from './SidebarModulewise/HRMS';
import { modalActions } from '../store/modal-Slice';
import api from '../Api';
import useFetch from 'use-http';
import { DynamicSideMenu } from './SidebarModulewise/DynamicSideMenu';

const MobileNavigator = styled(Row)`
  font-size: 1.5em;
  margin-right: 10px;
  margin-top: 1rem;
  background: ${({ sidebar }) => (sidebar ? 'none' : '#736b6b')};
  top: ${({ sidebar }) => (sidebar ? '2vh' : '5.5vh')};
  color: 'white';
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  margin: 0;
  display: flex;
  position: fixed; 
  align-items: center;
  cursor: pointer;
  left: ${({ sidebar }) => (sidebar ? '17.6%' : '9%')};
  transition: left ${({ sidebar }) => (sidebar ? '350ms' : 'none')};
  z-index: ${({ sidebar }) => (sidebar ? '1000' : '999')};
  @media (max-width: 600px) {
    left: ${({ sidebar }) => (sidebar ? '90.5%' : '1%')};
  }
  @media (min-width: 601px) {
    display: none;
  }
`;

const FaCloseIcon = styled(FaIcons.FaTimes)`
  padding: 0;
  margin: 0;
  height: 1.5rem; 
  color: white !important;
`;

const FaBarIcon = styled(FaIcons.FaBars)`
  padding: 0;
  margin: 0;
  height: 1rem;
`;

const Navigator = styled(Row)`
  font-size: 1.5em;
  margin-right: 10px;
  margin-top: 2rem;
  background: #736b6b;
  top: 40vh;
  color: 'white';
  width: .5rem;
  height: 2.5rem;
  padding: 0;
  margin: 0;
  display: flex;
  position: fixed; 
  align-items: center;
  cursor: pointer;
  left: ${({ sidebar }) => (sidebar ? '17.6%' : '5%')};
  transition: left ${({ sidebar }) => (sidebar ? '550ms' : '200ms')};
  z-index: 999; 
  @media (max-width: 600px) {
    display:none;
  }
`;

const ChevronLeftIcon = styled(FaIcons.FaChevronLeft)`
  color: yellow;
  height: 2.5rem;
`;

const ChevronRightIcon = styled(FaIcons.FaChevronRight)`
  color: yellow;
  height: 2.5rem;
`;

const NavHeader = styled(Row)`
  display: flex;
  height: 80px;
  justify-content: center;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 60px;
  display: flex;
  align-items: center;
`;

const SidebarNav = styled(Col)`
  background: #1d2430;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0;

  /* ? KEY FIX */
  width: ${({ sidebar, visible }) =>
    visible ? (sidebar ? '17.6%' : '5%') : '0'};

  transition: width 350ms;
  z-index: 999;
  overflow-y: auto;

  /* ? Prevent empty gap */
  overflow: hidden;

  @media (max-width: 600px) {
    width: ${({ sidebar, visible }) =>
      visible ? (sidebar ? '100%' : '-100%') : '0'};
    left: ${({ sidebar, visible }) =>
      visible ? '0' : '-100%'};
  }
`;

const SidebarWrap = styled(Row)`
  width: 100%;
  display:flex;
  position:absolute; 
`;

const SideMenu = styled(Row)``;

const LogoImage = styled.img`
  width: 11rem;
  height: 4.5rem;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

const LogoHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin:1.5rem 0;
`;

const FaHomeIcon = styled(FaIcons.FaHome)`
  font-size: 2rem;
  color: white;
  cursor: pointer;
`;

function SideBar(props) {
  const dispatch = useDispatch();
  const history = useHistory(); 

  // const moduleId = useSelector((state) => state.sideBar.moduleId);

  // let SideBarData = [];
  // if (moduleId === 10) SideBarData = Masters;
  // if (moduleId === 30) SideBarData = Meeting;
  // if (moduleId === 40) SideBarData = Setting;
  // if (moduleId === 50) SideBarData = HRMS;

  // const history = useHistory();
  // const dispatch = useDispatch();

  // const setModuleId = () => {
  //   props.onHide();
  //   dispatch(moduleActions.selectModuleId({ moduleId: '' }));
  //   history.push('/modules');
  // };

  const moduleId = useSelector((state) => state.sideBar.moduleId);
  
  const roleId = Number(localStorage.getItem("roleId"));
  const userId = Number(localStorage.getItem("userId"));
  const [menu, setMenu] = useState([]);

  const { post, get, response } = useFetch({ data: [] });
  const loadDynamicMenu = useCallback(async () => {
    if (!moduleId) return;
    const res = await get(api + "/activityMaster/getByProcessId/" + moduleId);

    if (response.ok && Array.isArray(res)) {
      setMenu(res);

      }
      else{
        setMenu([])
      }
  }, [get, response, moduleId]);

  useEffect(() => {
    loadDynamicMenu();
  }, [loadDynamicMenu]);
  const setModuleId = () => {
    props.onHide();
    dispatch(moduleActions.selectModuleId({ moduleId: "" }));
    history.push("/processModule");
  };

  const handleActivityClick = (activity) => {
    dispatch(moduleActions.selectActivityId({ activityId: activity.activityId }));
    if (activity.path) {
      history.push(activity.path);
    }
  };

  if (menu.length === 0) {
    return null; 
  }
  return (
    menu.length ? (<SideMenu onClick={() => dispatch(modalActions.hideModalHandler())}>

      <MobileNavigator sidebar={props.sidebar} onClick={props.onIconClick}>
        {props.sidebar ? <FaCloseIcon /> : <FaBarIcon />}
      </MobileNavigator>

      <Navigator sidebar={props.sidebar} onClick={props.onIconClick}>
        {props.sidebar ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </Navigator>

      {/* ? visible prop added */}
      <SidebarNav sidebar={props.sidebar} visible={!!moduleId}>
        <LogoHeader>
          {props.sidebar ? (
            <LogoImage src={Logo} alt="Logo" onClick={setModuleId} />
          ) : (
            <FaHomeIcon onClick={setModuleId} />
          )}
        </LogoHeader>

        <SidebarWrap>
         {DynamicSideMenu(menu).map((item, index) => (
              <SubMenu 
                item={item} 
                key={index} 
                sidebarOpen={props.sidebar} 
                onClick={() => handleActivityClick(item)}
                />
            ))}
        </SidebarWrap>
      </SidebarNav>

    </SideMenu>) : (<></>)
  );
}

export default SideBar;

// import React, { useState } from 'react';
// import styled from 'styled-components';
// import SubMenu from './SubMenu';
// import classes from './SideBar.modules.css'
// import { Row, Col } from 'react-bootstrap';
// import { useSelector, useDispatch } from 'react-redux';
// import { moduleActions } from '../store/module-slice';
// import { Link, useHistory } from 'react-router-dom';
// import * as FaIcons from 'react-icons/fa'
// import Logo from '../images/Srilogo.png';
// import { Masters } from './SidebarModulewise/Masters';
// import { MisEntryMenu } from './SidebarModulewise/MisEntryMenu';
// import { Meeting } from './SidebarModulewise/Meeting';
// import { Setting } from './SidebarModulewise/Setting';
// import { HRMS } from './SidebarModulewise/HRMS';
// import { modalActions } from '../store/modal-Slice';

// const SideMenu = styled(Row)``;

// function SideBar(props) {

//   const moduleId = useSelector((state) => state.sideBar.moduleId);

//   let SideBarData = [];
//   if (moduleId === 10) SideBarData = Masters;
//   if (moduleId === 30) SideBarData = Meeting;
//   if (moduleId === 40) SideBarData = Setting;
//   if (moduleId === 50) SideBarData = HRMS;

//   const history = useHistory();
//   const dispatch = useDispatch();

//   const setModuleId = () => {
//     props.onHide();
//     dispatch(moduleActions.selectModuleId({ moduleId: '' }));
//     history.push('/modules');
//   };

//   return (
//     <SideMenu onClick={() => dispatch(modalActions.hideModalHandler())}>
//       {/* Sidebar completely removed */}
//     </SideMenu>
//   );
// }

// export default SideBar;