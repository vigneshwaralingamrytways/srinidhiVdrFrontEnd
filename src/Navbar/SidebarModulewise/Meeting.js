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

export const Meeting = [
  /* {
    title: 'Home',
    path: '/modules',
    icon:  <LetterIcon letter="H" />
  }, */
  {
    title: 'Meeting',
    path: '/meeting/meetingtransaction',
    icon:  <LetterIcon letter="T" />
  },
  ,
  {
    title: 'Task',
    path: '/meeting/task',
    icon:  <LetterIcon letter="A" />,
  },
  {
    title: 'Calender',
    path: '/meeting/calender',
    icon:  <LetterIcon letter="C" />
  },
];