import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as FiIcons from "react-icons/fc";
import * as HiIcons from "react-icons/hi";
import styled from 'styled-components';

const CircleOutlineWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  background-color: white;  // Fix the typo here

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

export const Masters = [
  

  /* {
    title: 'Upload Entry Master',
    path: '/upload/entry',
    icon:  <LetterIcon letter="U" />
  }, */
  {
    title: 'Settings',
    path: '/entry/search',
    icon:  <LetterIcon letter="S" />
  },
  {
    title: 'User Master',
    path: '/user/search',
    icon:  <LetterIcon letter="U" />
  }, /*  {
    title: 'Upload Search',
    path: '/upload/search',
    icon:  <LetterIcon letter="U" />
  }, *//* {
    title: 'Upload Search',
    path: '/nested/search',
    icon:  <LetterIcon letter="U" />
  },  {
    title: 'Download Search',
    path: '/download/search',
    icon:  <LetterIcon letter="D" />
  }, */ 
  
  
];