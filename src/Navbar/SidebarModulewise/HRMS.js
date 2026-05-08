import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as FiIcons from "react-icons/fc";
import styled from 'styled-components';

const CircleOutlineWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  background-color: white;  

  color: black;
  padding: 0.6em; 
  font-size: 0.7em;
  border-radius: 50%;
  font-weight: 900;
`;


const LetterIcon = ({ letter }) => (
  <CircleOutlineWrapper>
    {letter}
  </CircleOutlineWrapper>
);

export const HRMS = [
  /* {
    title: 'Home',
    path: '/modules',
    icon:  <LetterIcon letter="H" />
  }, */
  {
    title: 'OrgChart',
    path: '/HRMS/OrgChart',
    icon:  <LetterIcon letter="O" />
  },
  {
    title: 'Leave Request',
    path: '/HRMS/LeaveRequest',
    icon:  <LetterIcon letter="L" />
  },
  {
    title: 'Expense Request',
    path: '/HRMS/ExpenseRequest',
    icon:  <LetterIcon letter="E" />
  },
];