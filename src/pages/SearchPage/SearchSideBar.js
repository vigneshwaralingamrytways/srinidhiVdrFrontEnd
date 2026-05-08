import React, { useState } from 'react';
import styled from 'styled-components';
import {Row,Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { moduleActions }from '../../store/module-slice';
import { Link, useHistory } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa'
import Logo from '../../images/Srilogo.png';
import SearchSubMenu from './SearchSubMenu';
import { SearchMenu } from '../../Navbar/SidebarModulewise/SearchMenu';

  
  


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
    display: none; // hide when the screen width is greater than 600px
  }
`;
const FaCloseIcon = styled(FaIcons.FaTimes)`
  padding: 0;
   margin: 0;
  height: 1.5rem; 
  color: white !important;
`;

const FaBarIcon = styled(FaIcons.FaBars )`
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
  padding: 0;
  margin: 0;
  height: 2.5rem;
`;

const ChevronRightIcon = styled(FaIcons.FaChevronRight)`
  color: yellow;
  padding: 0;
  margin: 0;
  height: 2.5rem;
`;

const NavHeader = styled(Row)`
  display: flex;
  height: 80px;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  color: #1E90FF;
  text-decoration-thickness: 1200px;
  font-family: sans-serif;
  font-style: italic;
  font-size: 2em;
  font-weight: bold;
  margin-left: 10px;
  padding-top: 20px;
  
`;
const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  left: ${({ sidebar }) => (sidebar ? '0' : '10%')};
`;
/*      sidebar */
const SidebarNav = styled(Col)`
  background:  #1d2430;
  height: calc(100vh - 0px);
  display: block;
  justify-content: center;
  position: fixed;
  top: 0px;
  left: ${({ sidebar }) => (sidebar ? '0' : '0')};
  width: ${({ sidebar }) => (sidebar ? '17.6%' : '5%')};
  transition: 350ms;
  border-radius : 0px;
  padding-right:0px;
  transition: width 350ms;
  z-index: 999;
  overflow-y: auto;
  
  @media (max-width: 600px) {
   
    width: 55%;
    background:  #1d2430;
    left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
    width: ${({ sidebar }) => (sidebar ? '100%' : '-100%')};
  }
`;

const SidebarWrap = styled(Row)`
  width: 100%;
  display:flex;
  position:absolute;
 
 
  
`;
const SideMenu = styled(Row)`
 
`;
const LogoImage = styled.img`
  width: 11rem;
  height: 4.5rem;
  padding-top: 0.5rem;
  margin: 0rem;
  cursor: pointer;
  transition: all 0.3s ease; 

  &:hover {
    transform: scale(1.1); 
  }
`;
const LogoHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin:1.5rem 0;
  
  ${({ sidebarOpen }) => !sidebarOpen && 'width: 90%;'}
`;

const FaHomeIcon = styled(FaIcons.FaHome)`
  font-size: 2rem;
  color: white;
  display: flex;
  cursor: pointer;


  &:hover {
    color: #ffffff;
    cursor: pointer;
  }
`;

function SearchSideBar(props) {
 

  
  const moduleId = useSelector((state) => state.sideBar.moduleId);
 
  let SideBarData =[];
 if(moduleId===20){
     SideBarData=SearchMenu(props.dynamicMenu)
   }
   
   
   
  const history = useHistory();
  const dispatch = useDispatch();
  

  const setModuleId = () => {
    props.onHide();
    dispatch(
      moduleActions.selectModuleId({
        moduleId: '',
      })
          );
    history.push('/modules');
  };
 
    
 
  return (
    <SideMenu>
   
<MobileNavigator sidebar={props.sidebar} onClick={props.onIconClick}>
{props.sidebar ?  <FaCloseIcon /> : <FaBarIcon />}
</MobileNavigator>
        
<Navigator sidebar={props.sidebar} onClick={props.onIconClick}>
{props.sidebar ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </Navigator>
      
    <SidebarNav sidebar={props.sidebar}>
    <LogoHeader>
    {props.sidebar ? (
  
    <LogoImage src={Logo} alt="Logo" onClick={setModuleId} />
  
) : (
  
    <FaHomeIcon onClick={setModuleId} />
  
)}

  </LogoHeader>


    <SidebarWrap>
      {SideBarData.map((item, index) => {
        return <SearchSubMenu item={item} key={index} sidebarOpen={props.sidebar} handleDocumentType={props.handleDocumentType}/>;
      })}
    </SidebarWrap>
  </SidebarNav>
  </SideMenu>
  )
}

export default SearchSideBar