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

export const SubFolderTable = (showFormHandler, actions) => {
  
  return [
    /* {
      title: 'Document Type',
      align:'center',
      render: rowData => {
        return <span>{rowData?.documentTypeMaster?.documentType || ""}</span>;
      
      },
    },
   {
      title: 'Folder',
      align:'center',
      render: rowData => {
        return <span>{rowData?.folderMaster?.folderCategoryName || ""}</span>;
      
      },
    },  */{
      title: 'Sub Category',
      align:'center',
      render: rowData => {
        return <span>{rowData.subFolderCategoryName}</span>;
      
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
          return <span>{rowData.subFolderDescribtion}</span>;
        
        },
      },{
        title: 'Edit',
        align:'center',
        render: rowData => {
          return  <FaIcons.FaEdit  onClick={showFormHandler(rowData,actions[0])} style={{ marginLeft: '5px',cursor:"pointer" }}>
          </FaIcons.FaEdit>
      },
      },{
        title: 'Delete',
        align: 'center',
        render: (rowData) => {
          return  <FaIcons.FaTrash  onClick={showFormHandler(rowData,actions[1])} style={{ marginLeft: '5px',cursor:"pointer" }}>
</FaIcons.FaTrash>
            
          
        },
      },
   
  ]
};

export default SubFolderTable ;
