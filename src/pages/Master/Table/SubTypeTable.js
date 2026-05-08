import React from 'react';
import * as FaIcons from 'react-icons/fa'
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  // InputGroup,
  // FormControl
} from "react-bootstrap";


// This is the table constant/settings which needed to render table elements

export const SubTypeTable = (showFormHandler, actions) => {
  
  return [
   {
      title: 'Category Name',
      align:'center',
      render: rowData => {
        return <span>{rowData.folderCategoryName}</span>;
      
      },
    },
    /* {
      title: 'Active',
      align:'center',
      render: rowData => {
        return <span>{rowData.active}</span>;
      
      },
    }, */
    {
        title: 'Describtion',
        align:'center',
        render: rowData => {
          return <span>{rowData.folderDescribtion}</span>;
        
        },
      },{
        title: 'Edit',
        align:'center',
        render: rowData => {
          return  <FaIcons.FaEdit  onClick={showFormHandler(rowData,actions[0])} style={{ marginLeft: '5px',cursor:"pointer" }}>
          </FaIcons.FaEdit>
      },
      },{
        title: 'Sub Category',
        align:'center',
        render: rowData => {
          return  <FaIcons.FaFileAlt  onClick={showFormHandler(rowData,actions[1])} style={{ marginLeft: '5px',cursor:"pointer" }}>
          </FaIcons.FaFileAlt>
      },
      },{
        title: 'Delete',
        align: 'center',
        render: (rowData) => {
          return  <FaIcons.FaTrash  onClick={showFormHandler(rowData,actions[2])} style={{ marginLeft: '5px',cursor:"pointer" }}>
</FaIcons.FaTrash>
            
          
        },
      },
   
  ]
};

export default SubTypeTable ;